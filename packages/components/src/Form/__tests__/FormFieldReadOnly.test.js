jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import FormField from '../FormField';
import { drawnInput } from './__fixtures__/drawnInput';

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

beforeAll(() => setI18nConfig());

const { colors } = MD3LightTheme;

const changedCount = (tree) => (JSON.stringify(tree.toJSON()).match(/"Changed"/g) || []).length;

const field = (props) => render(<FormField mode="outlined" label="Plate" value="SMPL001" {...props} />);

// Alta y consola plan 2.5 (audit F6): a read-only field is shown, not disabled.
describe('FormField readOnly', () => {
    it('takes no input but keeps the enabled colours', () => {
        const drawn = drawnInput(field({ readOnly: true }), 'SMPL001');
        expect(drawn.editable).toBe(false);
        expect(drawn.textColor).toBe(colors.onSurface);
        expect(drawn.outlineColor).toBe(colors.outline);
    });

    it('keeps the «changed» outline in primary, with its line', () => {
        const tree = field({ readOnly: true, highlighted: true });
        const drawn = drawnInput(tree, 'SMPL001');
        expect(drawn.outlineColor).toBe(colors.primary);
        expect(changedCount(tree)).toBe(1);
    });

    it('never enters the focused state', () => {
        const drawn = drawnInput(field({ readOnly: true }), 'SMPL001');
        drawn.focus();
        expect(drawn.read()).toMatchObject({ outlineWidth: 1, outlineColor: colors.outline });
    });

    it('is disabled when disabled as well: greyed out, the custom outline dropped, the line kept', () => {
        const tree = field({ readOnly: true, disabled: true, highlighted: true });
        const drawn = drawnInput(tree, 'SMPL001');
        expect(drawn.editable).toBe(false);
        expect(drawn.textColor).toBe(colors.onSurfaceDisabled);
        expect(drawn.outlineColor).not.toBe(colors.primary);
        expect(changedCount(tree)).toBe(1);
    });

    it('changes nothing without it: editable, focusable, the disabled field as it was', () => {
        const editable = drawnInput(field({}), 'SMPL001');
        expect(editable.editable).toBe(true);
        editable.focus();
        expect(editable.read().outlineWidth).toBe(2);
        const disabled = drawnInput(field({ disabled: true }), 'SMPL001');
        expect([disabled.editable, disabled.textColor]).toEqual([false, colors.onSurfaceDisabled]);
    });
});
