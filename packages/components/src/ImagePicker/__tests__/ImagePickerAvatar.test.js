import React, { createRef } from 'react';
import { Platform } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import ButtonWrapper from '../../ButtonWrapper/ButtonWrapper';
import { localized } from '../../Localization/Localization';
import ImagePickerAvatar from '../ImagePickerAvatar';

// The sheet is native; a stand-in records being opened and closed through the same ref the picker uses.
const mockSheet = { shown: 0, hidden: 0 };
jest.mock('react-native-actions-sheet', () => {
    const React = require('react');
    const ActionSheet = React.forwardRef(({ children }, ref) => {
        React.useImperativeHandle(ref, () => ({
            show: () => {
                mockSheet.shown += 1;
            },
            hide: () => {
                mockSheet.hidden += 1;
            },
        }));
        return children;
    });
    return { __esModule: true, default: ActionSheet };
});
// Insets of zero, and the context Paper's Provider reads them from (the library's own jest mock ships as TypeScript
// in the root install, which this config does not transform).
jest.mock('react-native-safe-area-context', () => {
    const React = require('react');
    const insets = { top: 0, bottom: 0, left: 0, right: 0 };
    const frame = { x: 0, y: 0, width: 390, height: 844 };
    return {
        SafeAreaProvider: ({ children }) => children,
        SafeAreaInsetsContext: React.createContext(insets),
        SafeAreaFrameContext: React.createContext(frame),
        useSafeAreaInsets: () => insets,
        useSafeAreaFrame: () => frame,
        initialWindowMetrics: { insets, frame },
    };
});
// The camera and the library are ImagePickerAPI's (its own suite); here each pick answers what a test gives it.
const mockPicks = { takePhoto: jest.fn(), chooseFromLibrary: jest.fn() };
jest.mock('../ImagePickerAPI', () => jest.fn().mockImplementation(() => mockPicks));

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

beforeEach(() => {
    mockSheet.shown = 0;
    mockSheet.hidden = 0;
    mockPicks.takePhoto.mockReset();
    mockPicks.chooseFromLibrary.mockReset();
});

afterEach(() => {
    act(() => {
        mounted.splice(0).forEach((tree) => tree.unmount());
        jest.runOnlyPendingTimers();
    });
    jest.restoreAllMocks();
});

const optionOf = (tree, title) =>
    tree.root.findAll((node) => node.props.title === title && typeof node.props.onPress === 'function')[0];
const ASSET = { uri: 'file:///photo.jpg' };

describe('ImagePicker.Avatar', () => {
    it('opens its sheet from its own text button, as before', () => {
        const tree = render(<ImagePickerAvatar variant="button" title="Add" onChange={jest.fn()} />);
        const [button] = tree.root.findAllByType(ButtonWrapper);
        act(() => button.props.onPress());
        expect(mockSheet.shown).toBe(1);
    });

    it('with variant="sheet", renders no control of its own and opens through the ref', () => {
        const ref = createRef();
        const tree = render(<ImagePickerAvatar ref={ref} variant="sheet" onChange={jest.fn()} />);
        expect(tree.root.findAllByType(ButtonWrapper)).toHaveLength(0);
        act(() => ref.current.show());
        expect(mockSheet.shown).toBe(1);
    });

    it("hands each photo picked to onChange with the caller's capture options, and closes the sheet", async () => {
        const onChange = jest.fn();
        const captureOptions = { maxWidth: 5120, maxHeight: 5120 };
        mockPicks.chooseFromLibrary.mockResolvedValue(ASSET);
        const tree = render(<ImagePickerAvatar variant="sheet" onChange={onChange} captureOptions={captureOptions} />);
        await act(async () => optionOf(tree, localized('chooseFromLibrary')).props.onPress());
        expect(mockPicks.chooseFromLibrary).toHaveBeenCalledWith(captureOptions);
        expect(onChange).toHaveBeenCalledWith(ASSET);
        expect(mockSheet.hidden).toBe(1);
    });

    it('calls nothing and keeps the sheet open when a pick ends without a photo', async () => {
        const onChange = jest.fn();
        mockPicks.takePhoto.mockResolvedValue(null);
        const tree = render(<ImagePickerAvatar variant="sheet" onChange={onChange} />);
        await act(async () => optionOf(tree, localized('takePhoto')).props.onPress());
        expect(onChange).not.toHaveBeenCalled();
        expect(mockSheet.hidden).toBe(0);
    });

    it('ignores the sheet while a pick is in progress, and listens again once it ends', async () => {
        let finish;
        mockPicks.takePhoto.mockReturnValue(
            new Promise((resolve) => {
                finish = resolve;
            })
        );
        mockPicks.chooseFromLibrary.mockResolvedValue(ASSET);
        const tree = render(<ImagePickerAvatar variant="sheet" onChange={jest.fn()} />);
        act(() => optionOf(tree, localized('takePhoto')).props.onPress());
        act(() => optionOf(tree, localized('takePhoto')).props.onPress());
        act(() => optionOf(tree, localized('chooseFromLibrary')).props.onPress());
        expect(mockPicks.takePhoto).toHaveBeenCalledTimes(1);
        expect(mockPicks.chooseFromLibrary).not.toHaveBeenCalled();

        await act(async () => finish(null));
        await act(async () => optionOf(tree, localized('chooseFromLibrary')).props.onPress());
        expect(mockPicks.chooseFromLibrary).toHaveBeenCalledTimes(1);
    });

    it('on the web, where the library is the only choice, opens it straight from show()', async () => {
        jest.replaceProperty(Platform, 'OS', 'web');
        const onChange = jest.fn();
        mockPicks.chooseFromLibrary.mockResolvedValue(ASSET);
        const ref = createRef();
        render(<ImagePickerAvatar ref={ref} variant="sheet" onChange={onChange} />);
        await act(async () => ref.current.show());
        expect(mockSheet.shown).toBe(0);
        expect(onChange).toHaveBeenCalledWith(ASSET);
    });
});
