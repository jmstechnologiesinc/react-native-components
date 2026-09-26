jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { Button, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import { EmptyState, ErrorState, LoadingState } from '../States';

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

// The HOST node of a testID: what a screen reader reads.
const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID)[0];

const textOf = (tree) => JSON.stringify(tree.toJSON());

describe('the pane states', () => {
    it('EmptyState shows its title and description and offers its next action', () => {
        const onAction = jest.fn();
        const tree = render(
            <EmptyState title="Nothing waiting" description="All caught up" actionLabel="Refresh" onAction={onAction} />
        );
        const json = textOf(tree);
        expect(json).toContain('Nothing waiting');
        expect(json).toContain('All caught up');
        const button = tree.root.findByType(Button);
        expect(button.props.mode).toBe('outlined');
        act(() => button.props.onPress());
        expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('EmptyState draws no button without an action', () => {
        const tree = render(<EmptyState title="Nothing" actionLabel="Go" />);
        expect(tree.root.findAllByType(Button)).toHaveLength(0);
    });

    it('LoadingState is a labelled, busy progressbar («Loading» by default)', () => {
        const loading = hostOf(render(<LoadingState />), 'loading-state');
        expect(loading.props.role).toBe('progressbar');
        expect(loading.props['aria-busy']).toBe(true);
        expect(loading.props['aria-label']).toBe('Loading');
        expect(hostOf(render(<LoadingState label="Cargando" />), 'loading-state').props['aria-label']).toBe('Cargando');
    });

    it('ErrorState is an alert with a default title and retries with the host’s label', () => {
        const onRetry = jest.fn();
        const tree = render(<ErrorState onRetry={onRetry} />);
        expect(hostOf(tree, 'error-state').props.role).toBe('alert');
        expect(textOf(tree)).toContain('Something went wrong');
        expect(textOf(tree)).toContain('Retry');
        act(() => tree.root.findByType(Button).props.onPress());
        expect(onRetry).toHaveBeenCalledTimes(1);

        const custom = render(<ErrorState title="Offline" onRetry={onRetry} retryLabel="Reintentar" />);
        expect(textOf(custom)).toContain('Offline');
        expect(textOf(custom)).toContain('Reintentar');
        expect(render(<ErrorState />).root.findAllByType(Button)).toHaveLength(0);
    });
});
