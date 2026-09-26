import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { useModalFocus } from '../src/useModalFocus';

// The web keyboard contract of a modal surface, on a stand-in DOM (Jest runs
// without one): focus moves in, Tab wraps inside, Esc dismisses, focus goes
// back to the opener. Off the web the hook does nothing.

const fakeDom = () => {
    const listeners = new Set();
    const doc = {
        activeElement: null,
        addEventListener: (type, listener) => listeners.add(listener),
        removeEventListener: (type, listener) => listeners.delete(listener),
        contains: () => true,
    };
    const element = (name) => {
        const node = { name, setAttribute: jest.fn() };
        node.focus = jest.fn(() => {
            doc.activeElement = node;
        });
        return node;
    };
    const opener = element('opener');
    const first = element('first');
    const last = element('last');
    const frame = element('frame');
    frame.querySelectorAll = () => [first, last];
    frame.contains = (node) => node === first || node === last;
    const empty = element('empty');
    empty.querySelectorAll = () => [];
    empty.contains = () => false;
    doc.activeElement = opener;
    const key = (name, extra = {}) => {
        const event = { key: name, preventDefault: jest.fn(), stopPropagation: jest.fn(), ...extra };
        act(() => listeners.forEach((listener) => listener(event)));
        return event;
    };
    return { doc, opener, first, last, frame, empty, key, listeners };
};

/** A modal surface whose ref is the stand-in DOM node. */
const Surface = ({ visible, onDismiss, node }) => {
    const ref = useModalFocus({ visible, onDismiss });
    useEffect(() => {
        ref(node);
    }, [node, ref]);
    return null;
};

describe('useModalFocus', () => {
    const realDocument = global.document;
    let dom;
    let tree;

    beforeEach(() => {
        dom = fakeDom();
        global.document = dom.doc;
    });

    afterEach(() => {
        act(() => tree?.unmount());
        tree = null;
        global.document = realDocument;
        jest.restoreAllMocks();
    });

    const mount = (props) =>
        act(() => {
            tree = renderer.create(<Surface node={dom.frame} {...props} />);
        });

    describe('on the web', () => {
        beforeEach(() => jest.replaceProperty(Platform, 'OS', 'web'));

        it('moves focus to the first focusable, and wraps Tab both ways', () => {
            mount({ visible: true });
            expect(dom.doc.activeElement).toBe(dom.first);

            dom.last.focus();
            expect(dom.key('Tab').preventDefault).toHaveBeenCalled();
            expect(dom.doc.activeElement).toBe(dom.first);

            expect(dom.key('Tab', { shiftKey: true }).preventDefault).toHaveBeenCalled();
            expect(dom.doc.activeElement).toBe(dom.last);
        });

        it('pulls a focus that escaped back in', () => {
            mount({ visible: true });
            dom.opener.focus();

            dom.key('Tab');
            expect(dom.doc.activeElement).toBe(dom.first);
        });

        it('focuses the surface itself when nothing inside can take focus', () => {
            act(() => {
                tree = renderer.create(<Surface node={dom.empty} visible />);
            });

            expect(dom.empty.setAttribute).toHaveBeenCalledWith('tabindex', '-1');
            expect(dom.doc.activeElement).toBe(dom.empty);
        });

        it('dismisses on Esc, and does nothing without onDismiss', () => {
            const onDismiss = jest.fn();
            mount({ visible: true, onDismiss });
            dom.key('Escape');
            expect(onDismiss).toHaveBeenCalledTimes(1);

            act(() => tree.update(<Surface node={dom.frame} visible />));
            expect(() => dom.key('Escape')).not.toThrow();
        });

        it('gives the focus back to the opener when it closes', () => {
            mount({ visible: true });
            act(() => tree.update(<Surface node={dom.frame} visible={false} />));

            expect(dom.doc.activeElement).toBe(dom.opener);
            expect(dom.listeners.size).toBe(0);
        });
    });

    describe('off the web', () => {
        it('listens to nothing and moves no focus', () => {
            mount({ visible: true, onDismiss: jest.fn() });

            expect(dom.listeners.size).toBe(0);
            expect(dom.doc.activeElement).toBe(dom.opener);
        });
    });
});
