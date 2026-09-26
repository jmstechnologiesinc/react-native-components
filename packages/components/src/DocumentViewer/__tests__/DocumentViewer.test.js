jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import DocumentViewer from '../DocumentViewer';

const IMAGE = { uri: 'https://example.com/license.jpg', mimeType: 'image/jpeg' };

// Paper animates on timers; fake ones, and unmounting after each test, keep
// those animations from firing after the environment is torn down.
jest.useFakeTimers();

const mounted = [];

const render = (element) => {
    let tree;
    act(() => {
        tree = renderer.create(<Provider theme={MD3LightTheme}>{element}</Provider>);
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

// The HOST node of a testID: what a screen reader reads.
const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID)[0];

// The node that handles a press for a testID: what a user touches.
const pressableOf = (tree, testID) =>
    tree.root.findAll((node) => node.props.testID === testID && typeof node.props.onPress === 'function')[0];

const control = (tree, id) => hostOf(tree, `viewer-${id}`);

const press = (tree, id) => act(() => pressableOf(tree, `viewer-${id}`).props.onPress());

// The `Image` element as the viewer wrote it, before RN flattens its style.
const imageTransform = (tree) =>
    tree.root.findAll((node) => node.props.testID === 'viewer-image' && Array.isArray(node.props.style))[0].props
        .style[1].transform;

beforeAll(() => {
    setI18nConfig();
});

describe('DocumentViewer — the default image renderer', () => {
    it('labels the toolbar and every control', () => {
        const tree = render(<DocumentViewer source={IMAGE} testID="viewer" />);

        const toolbar = tree.root.findAll(
            (node) => typeof node.type === 'string' && node.props.accessibilityRole === 'toolbar'
        )[0];
        expect(toolbar.props.accessibilityLabel).toBe('Document controls');
        expect(control(tree, 'zoom-in').props.accessibilityLabel).toBe('Zoom in');
        expect(control(tree, 'zoom-out').props.accessibilityLabel).toBe('Zoom out');
        expect(control(tree, 'zoom-reset').props.accessibilityLabel).toBe('Reset zoom');
        expect(control(tree, 'rotate').props.accessibilityLabel).toBe('Rotate');
    });

    it('zooms and rotates on its own when uncontrolled, and reports every change', () => {
        const onZoomChange = jest.fn();
        const onRotate = jest.fn();
        const tree = render(
            <DocumentViewer source={IMAGE} onZoomChange={onZoomChange} onRotate={onRotate} testID="viewer" />
        );

        press(tree, 'zoom-in');
        press(tree, 'rotate');

        expect(onZoomChange).toHaveBeenLastCalledWith(1.25);
        expect(onRotate).toHaveBeenLastCalledWith(90);
        expect(imageTransform(tree)).toEqual([{ rotate: '90deg' }, { scale: 1.25 }]);
    });

    it('follows the host when controlled', () => {
        const onZoomChange = jest.fn();
        const tree = render(
            <DocumentViewer source={IMAGE} zoom={2} rotation={180} onZoomChange={onZoomChange} testID="viewer" />
        );

        press(tree, 'zoom-in');

        expect(onZoomChange).toHaveBeenCalledWith(2.25);
        expect(imageTransform(tree)).toEqual([{ rotate: '180deg' }, { scale: 2 }]);
    });

    it('stops at the zoom limits', () => {
        const tree = render(<DocumentViewer source={IMAGE} zoom={4} testID="viewer" />);
        expect(control(tree, 'zoom-in').props.accessibilityState.disabled).toBe(true);
        expect(control(tree, 'zoom-out').props.accessibilityState.disabled).toBe(false);
    });

    it('wraps around after a full turn', () => {
        const onRotate = jest.fn();
        const tree = render(<DocumentViewer source={IMAGE} rotation={270} onRotate={onRotate} testID="viewer" />);
        press(tree, 'rotate');
        expect(onRotate).toHaveBeenCalledWith(0);
    });
});

describe('DocumentViewer — pages and sides', () => {
    it('pages within bounds and says where it is', () => {
        const onPageChange = jest.fn();
        const tree = render(
            <DocumentViewer source={IMAGE} pageCount={3} page={1} onPageChange={onPageChange} testID="viewer" />
        );

        expect(control(tree, 'page-previous').props.accessibilityState.disabled).toBe(true);
        press(tree, 'page-next');
        expect(onPageChange).toHaveBeenCalledWith(2);
        expect(JSON.stringify(tree.toJSON())).toContain('Page 1 of 3');
    });

    it('hides the pager for a single page', () => {
        const tree = render(<DocumentViewer source={IMAGE} testID="viewer" />);
        expect(control(tree, 'page-next')).toBeUndefined();
    });

    it('switches sides through a segmented control', () => {
        const onSideChange = jest.fn();
        const sides = [
            { value: 'front', label: 'Front' },
            { value: 'back', label: 'Back' },
        ];
        const tree = render(
            <DocumentViewer source={IMAGE} sides={sides} onSideChange={onSideChange} testID="viewer" />
        );

        expect(control(tree, 'side-back').props.accessibilityLabel).toBe('Document side: Back');
        press(tree, 'side-back');
        expect(onSideChange).toHaveBeenCalledWith('back');
    });
});

describe('DocumentViewer — injection points', () => {
    it('hands a non-image document to renderDocument with the viewer state', () => {
        const renderDocument = jest.fn(() => <Text>pdf page</Text>);
        const source = { uri: 'https://example.com/doc.pdf', mimeType: 'application/pdf' };
        render(<DocumentViewer source={source} page={2} pageCount={4} rotation={90} renderDocument={renderDocument} />);

        expect(renderDocument).toHaveBeenCalledWith({ source, page: 2, side: undefined, zoom: 1, rotation: 90 });
    });

    it('lets renderZoom own the scale', () => {
        const renderZoom = jest.fn(({ children }) => children);
        const tree = render(<DocumentViewer source={IMAGE} zoom={2} renderZoom={renderZoom} testID="viewer" />);

        expect(renderZoom).toHaveBeenCalledWith(
            expect.objectContaining({ zoom: 2, onZoomChange: expect.any(Function) })
        );
        expect(imageTransform(tree)).toEqual([{ rotate: '0deg' }, { scale: 1 }]);
    });

    it('says so when it cannot preview a file and nothing was injected', () => {
        const tree = render(
            <DocumentViewer source={{ uri: 'https://example.com/doc.pdf', mimeType: 'application/pdf' }} />
        );
        expect(JSON.stringify(tree.toJSON())).toContain('Preview not available for this file');
    });

    it('shows the empty label without a source and disables the controls', () => {
        const tree = render(<DocumentViewer emptyLabel="Nothing uploaded" testID="viewer" />);
        expect(JSON.stringify(tree.toJSON())).toContain('Nothing uploaded');
        expect(control(tree, 'rotate').props.accessibilityState.disabled).toBe(true);
    });

    it('renders the footer', () => {
        const tree = render(<DocumentViewer source={IMAGE} footer={<Text>uploaded yesterday</Text>} />);
        expect(JSON.stringify(tree.toJSON())).toContain('uploaded yesterday');
    });
});
