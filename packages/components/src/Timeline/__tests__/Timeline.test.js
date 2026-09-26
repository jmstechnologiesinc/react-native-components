jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import { formatDateTime } from '../../Localization/format';
import Timeline from '../Timeline';

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

const itemOf = (tree, index) => hostOf(tree, `timeline-item-${index}`);

beforeAll(() => {
    setI18nConfig();
});

const STEPS = [
    { id: 'apply', title: 'Application' },
    { id: 'documents', title: 'Documents' },
    { id: 'screening', title: 'Background check' },
];

describe('Timeline — steps', () => {
    it('is a list whose items announce their position and state', () => {
        const tree = render(<Timeline variant="steps" items={STEPS} activeIndex={1} testID="timeline" />);

        expect(hostOf(tree, 'timeline').props.accessibilityRole).toBe('list');
        expect(itemOf(tree, 0).props.accessibilityLabel).toBe('Step 1 of 3, Application, Completed');
        expect(itemOf(tree, 1).props.accessibilityLabel).toBe('Step 2 of 3, Documents, In progress');
        expect(itemOf(tree, 2).props.accessibilityLabel).toBe('Step 3 of 3, Background check, Not started');
    });

    it('marks only the current step as selected', () => {
        const tree = render(<Timeline variant="steps" items={STEPS} activeIndex={1} testID="timeline" />);
        expect(STEPS.map((_, index) => itemOf(tree, index).props.accessibilityState.selected)).toEqual([
            false,
            true,
            false,
        ]);
    });

    it('treats every step as done once activeIndex is past the end', () => {
        const tree = render(<Timeline variant="steps" items={STEPS} activeIndex={3} testID="timeline" />);
        expect(itemOf(tree, 2).props.accessibilityLabel).toContain('Completed');
    });
});

describe('Timeline — history', () => {
    const AT = '2026-09-26T15:30:00.000Z';

    it('shows title, description and the instant in the app locale', () => {
        const tree = render(
            <Timeline
                items={[
                    { id: 'e1', title: 'Document verified', description: 'Driver license', at: AT, tone: 'success' },
                ]}
                testID="timeline"
            />
        );
        const label = itemOf(tree, 0).props.accessibilityLabel;

        expect(label).toBe(`Document verified, Driver license, ${formatDateTime(AT)}`);
        expect(itemOf(tree, 0).props.accessibilityState).toBeUndefined();
    });

    it('paints the item icon with its tone', () => {
        const tree = render(
            <Timeline items={[{ id: 'e1', title: 'Rejected', icon: 'close', tone: 'danger' }]} testID="timeline" />
        );
        expect(JSON.stringify(tree.toJSON())).toContain(MD3LightTheme.colors.errorContainer);
    });

    it('renders nothing but the list for no items', () => {
        const tree = render(<Timeline items={[]} testID="timeline" />);
        expect(hostOf(tree, 'timeline').props.accessibilityRole).toBe('list');
        expect(hostOf(tree, 'timeline-item-0')).toBeUndefined();
    });
});
