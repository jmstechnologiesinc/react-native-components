jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import Breadcrumbs from '../Breadcrumbs';

// The WAI-ARIA breadcrumb: a navigation landmark, an ordered list, links for the ancestors, the current page last.

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

const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID)[0];
const pressableOf = (tree, testID) =>
    tree.root.findAll((node) => node.props.testID === testID && typeof node.props.onPress === 'function')[0];

describe('Breadcrumbs', () => {
    it('is a navigation landmark named Breadcrumb over a list; ancestors are buttons, the last is the current page', () => {
        const open = jest.fn();
        const tree = render(
            <Breadcrumbs
                items={[
                    { label: 'Partners', onPress: open, testID: 'crumb-partners' },
                    { label: 'Ava Testwell', onPress: () => {}, testID: 'crumb-ava' },
                    { label: 'Documents', onPress: () => {}, testID: 'crumb-documents' },
                ]}
                testID="crumbs"
            />
        );
        const nav = hostOf(tree, 'crumbs');
        expect(nav.props.role).toBe('navigation');
        expect(nav.props['aria-label']).toBe('Breadcrumb');
        expect(tree.root.findAll((node) => node.type === 'View' && node.props.role === 'listitem')).toHaveLength(3);

        act(() => pressableOf(tree, 'crumb-partners').props.onPress());
        expect(open).toHaveBeenCalledTimes(1);
        // The current page is text, not a button, even when a press handler was given.
        expect(pressableOf(tree, 'crumb-documents')).toBeUndefined();
        expect(hostOf(tree, 'crumb-documents').props['aria-current']).toBe('page');
    });

    it('draws an item without a handler as plain text', () => {
        const tree = render(<Breadcrumbs items={[{ label: 'Queue', testID: 'crumb-queue' }]} />);
        expect(pressableOf(tree, 'crumb-queue')).toBeUndefined();
        expect(hostOf(tree, 'crumb-queue').props['aria-current']).toBe('page');
    });
});
