import React, { createRef } from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import ButtonWrapper from '../../ButtonWrapper/ButtonWrapper';
import ImagePickerAvatar from '../ImagePickerAvatar';

// The sheet is native; a stand-in records being opened through the same ref the picker uses.
const mockSheet = { shown: 0 };
jest.mock('react-native-actions-sheet', () => {
    const React = require('react');
    const ActionSheet = React.forwardRef(({ children }, ref) => {
        React.useImperativeHandle(ref, () => ({
            show: () => {
                mockSheet.shown += 1;
            },
            hide: () => {},
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
jest.mock('../ImagePickerAPI', () => jest.fn());

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
});

afterEach(() => {
    act(() => {
        mounted.splice(0).forEach((tree) => tree.unmount());
        jest.runOnlyPendingTimers();
    });
});

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
});
