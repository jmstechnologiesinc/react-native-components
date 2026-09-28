import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { LAYOUT, PANE, SIZE_CLASS, SUPPORTING_MODE, paneArrangement, paneMetrics, sizeClassOf, tokenScale } from '..';

// The pane geometry, the window size classes and the collapse table, as data.

describe('window size classes (MD3 dp)', () => {
    it.each([
        [0, SIZE_CLASS.COMPACT],
        [599, SIZE_CLASS.COMPACT],
        [600, SIZE_CLASS.MEDIUM],
        [839, SIZE_CLASS.MEDIUM],
        [840, SIZE_CLASS.EXPANDED],
        [1199, SIZE_CLASS.EXPANDED],
        [1200, SIZE_CLASS.LARGE],
        [1599, SIZE_CLASS.LARGE],
        [1600, SIZE_CLASS.EXTRA_LARGE],
    ])('%i is %s', (width, sizeClass) => {
        expect(sizeClassOf(width)).toBe(sizeClass);
    });
});

describe('paneMetrics (the theme tokens, never raw pixels)', () => {
    const identity = {
        ...MD3LightTheme,
        roundness: 4,
        spacing: Object.fromEntries(Array.from({ length: 20 }, (_, index) => [`x${index + 1}`, 4 * (index + 1)])),
    };

    it('is MD3 exactly when the theme renders dp 1:1', () => {
        expect(tokenScale(identity)).toBe(1);
        expect(paneMetrics(identity)).toEqual({
            rail: 80,
            margin: 24,
            spacer: 24,
            fixedPane: 360,
            paneRadius: 16,
            sideSheetWidth: 360,
            sideSheetRadius: 16,
            bottomSheetMaxWidth: 640,
            bottomSheetRadius: 28,
            dragHandle: { width: 32, height: 4 },
            documentStage: 560,
        });
    });

    it('scales with the theme, keeping the panes proportionate to Paper components', () => {
        const theme = MD3LightTheme;
        const scale = tokenScale(theme);
        const metrics = paneMetrics(theme);
        // Paper's spacing is scaled (moderateScale); the panes carry the same factor.
        expect(theme.spacing.x6).toBeCloseTo(24 * scale);
        expect(metrics.fixedPane).toBeCloseTo(360 * scale);
        expect(metrics.rail).toBe(theme.spacing.x20);
        expect(metrics.margin).toBe(theme.spacing.x6);
        expect(metrics.bottomSheetRadius).toBe(theme.roundness * 7);
    });
});

describe('paneArrangement (the MD3 collapse table)', () => {
    it.each([
        [LAYOUT.L3, SIZE_CLASS.EXTRA_LARGE, ['list', 'detail', 'supporting'], SUPPORTING_MODE.INLINE],
        [LAYOUT.L3, SIZE_CLASS.LARGE, ['list', 'detail'], SUPPORTING_MODE.SIDE_SHEET],
        [LAYOUT.L3, SIZE_CLASS.EXPANDED, ['list', 'detail'], SUPPORTING_MODE.SIDE_SHEET],
        [LAYOUT.L3, SIZE_CLASS.MEDIUM, ['list'], SUPPORTING_MODE.SIDE_SHEET],
        [LAYOUT.L3, SIZE_CLASS.COMPACT, ['list'], SUPPORTING_MODE.SIDE_SHEET],
        [LAYOUT.L2A, SIZE_CLASS.EXTRA_LARGE, ['list', 'detail'], SUPPORTING_MODE.NONE],
        [LAYOUT.L2A, SIZE_CLASS.EXPANDED, ['list', 'detail'], SUPPORTING_MODE.NONE],
        [LAYOUT.L2A, SIZE_CLASS.MEDIUM, ['list'], SUPPORTING_MODE.NONE],
        [LAYOUT.L2B, SIZE_CLASS.LARGE, ['primary', 'supporting'], SUPPORTING_MODE.INLINE],
        [LAYOUT.L2B, SIZE_CLASS.EXPANDED, ['primary', 'supporting'], SUPPORTING_MODE.INLINE],
        [LAYOUT.L2B, SIZE_CLASS.MEDIUM, ['primary'], SUPPORTING_MODE.BOTTOM_SHEET],
        [LAYOUT.L2B, SIZE_CLASS.COMPACT, ['primary'], SUPPORTING_MODE.BOTTOM_SHEET],
    ])('%s at %s → %j, supporting %s', (layout, sizeClass, panes, supporting) => {
        expect(paneArrangement(layout, sizeClass)).toEqual(expect.objectContaining({ panes, supporting }));
    });

    it('shows the detail alone on a single-pane window when it is the active pane', () => {
        expect(paneArrangement(LAYOUT.L2A, SIZE_CLASS.MEDIUM, PANE.DETAIL)).toEqual({
            panes: ['detail'],
            single: true,
            supporting: SUPPORTING_MODE.NONE,
        });
    });

    it('refuses an unknown layout', () => {
        expect(() => paneArrangement('L4', SIZE_CLASS.LARGE)).toThrow(/Unknown pane layout L4/);
    });
});
