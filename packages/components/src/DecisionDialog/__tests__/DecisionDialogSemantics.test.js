jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { Platform } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import DecisionDialog from '../DecisionDialog';

// The dialog contract on the web (WAI-ARIA dialog: role, aria-modal,
// aria-labelledby; Esc unless busy, focus back) and the native tree left as
// it was. Jest runs without a DOM and the preset's View is a mock class (its
// ref is no DOM node), so the web half drives the dialog through a minimal
// stand-in for `document`; focus-in and the Tab trap on a DOM node are pinned
// in `__tests__/useModalFocus.test.js`.

jest.useFakeTimers();

const mounted = [];

const render = (element, options) => {
    let tree;
    act(() => {
        tree = renderer.create(<Provider theme={MD3LightTheme}>{element}</Provider>, options);
    });
    mounted.push(tree);
    return tree;
};

afterEach(() => {
    act(() => {
        mounted.splice(0).forEach((tree) => tree.unmount());
        jest.runOnlyPendingTimers();
    });
});

beforeAll(() => setI18nConfig());

const base = {
    visible: true,
    title: 'Reject document',
    confirmLabel: 'Reject',
    onConfirm: () => {},
    onDismiss: () => {},
    testID: 'decision',
};

const hostsWith = (tree, predicate) =>
    tree.root.findAll((node) => typeof node.type === 'string' && predicate(node.props));

/** A stand-in for the few DOM APIs the hook uses. */
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
    const cancel = element('cancel');
    const confirm = element('confirm');
    const frame = element('frame');
    frame.querySelectorAll = () => [cancel, confirm];
    frame.contains = (node) => node === cancel || node === confirm;
    doc.activeElement = opener;
    const key = (name, extra = {}) => {
        const event = { key: name, preventDefault: jest.fn(), stopPropagation: jest.fn(), ...extra };
        act(() => listeners.forEach((listener) => listener(event)));
        return event;
    };
    return { doc, opener, cancel, confirm, frame, key, listeners };
};

describe('DecisionDialog on native', () => {
    it('keeps the native tree: no dialog frame, no ARIA props, no title id', () => {
        const tree = render(<DecisionDialog {...base} />);

        expect(hostsWith(tree, (props) => props.role === 'dialog')).toHaveLength(0);
        expect(hostsWith(tree, (props) => props['aria-modal'] !== undefined)).toHaveLength(0);
        expect(hostsWith(tree, (props) => props.testID === 'decision-frame')).toHaveLength(0);
        const [title] = hostsWith(tree, (props) => props.testID === 'decision-title');
        expect(title.props.nativeID).toBeUndefined();
    });
});

describe('DecisionDialog on the web', () => {
    let dom;
    const realDocument = global.document;

    beforeEach(() => {
        jest.replaceProperty(Platform, 'OS', 'web');
        dom = fakeDom();
        global.document = dom.doc;
    });

    afterEach(() => {
        // Unmount while the stand-in document is still there: closing returns the focus through it.
        act(() => {
            mounted.splice(0).forEach((tree) => tree.unmount());
            jest.runOnlyPendingTimers();
        });
        global.document = realDocument;
        jest.restoreAllMocks();
    });

    const renderWeb = (element) => render(element);

    it('is a modal dialog named by its title', () => {
        const tree = renderWeb(<DecisionDialog {...base} />);

        const [frame] = hostsWith(tree, (props) => props.role === 'dialog');
        const [title] = hostsWith(tree, (props) => props.testID === 'decision-title');
        expect(frame.props['aria-modal']).toBe(true);
        expect(title.props.nativeID).toBeTruthy();
        expect(frame.props['aria-labelledby']).toBe(title.props.nativeID);
    });

    it('closes on Esc', () => {
        const onDismiss = jest.fn();
        renderWeb(<DecisionDialog {...base} onDismiss={onDismiss} />);

        dom.key('Escape');
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('ignores Esc while busy', () => {
        const onDismiss = jest.fn();
        renderWeb(<DecisionDialog {...base} onDismiss={onDismiss} busy />);

        dom.key('Escape');
        expect(onDismiss).not.toHaveBeenCalled();
    });

    it('returns focus to the opener and stops listening when it closes', () => {
        const tree = renderWeb(<DecisionDialog {...base} />);
        expect(dom.listeners.size).toBe(1);

        act(() => {
            tree.update(
                <Provider theme={MD3LightTheme}>
                    <DecisionDialog {...base} visible={false} />
                </Provider>
            );
        });

        expect(dom.opener.focus).toHaveBeenCalled();
        expect(dom.listeners.size).toBe(0);
    });

    it('lets only the innermost of two open dialogs answer Esc', () => {
        const outer = jest.fn();
        const inner = jest.fn();
        renderWeb(<DecisionDialog {...base} onDismiss={outer} />);
        renderWeb(<DecisionDialog {...base} testID="inner" onDismiss={inner} />);

        dom.key('Escape');

        expect(inner).toHaveBeenCalledTimes(1);
        expect(outer).not.toHaveBeenCalled();
    });
});
