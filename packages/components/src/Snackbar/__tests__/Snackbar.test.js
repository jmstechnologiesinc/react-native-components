jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React, { useEffect } from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider, Snackbar } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import { SnackbarProvider, useSnackbar } from '../Snackbar';

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

const textOf = (tree) => JSON.stringify(tree.toJSON());

const Emit = ({ messages }) => {
    const { show } = useSnackbar();
    useEffect(() => messages.forEach((message) => show(message)), [messages, show]);
    return null;
};

describe('SnackbarProvider', () => {
    it('shows one message at a time, in order, each for its duration', () => {
        const tree = render(
            <SnackbarProvider>
                <Emit messages={['First saved', 'Second saved']} />
            </SnackbarProvider>
        );
        expect(textOf(tree)).toContain('First saved');
        expect(textOf(tree)).not.toContain('Second saved');

        act(() => jest.advanceTimersByTime(10000));
        expect(textOf(tree)).not.toContain('First saved');
        expect(textOf(tree)).toContain('Second saved');
    });

    it('passes the action and duration to Paper and dismisses on demand', () => {
        let api;
        const action = { label: 'Undo', onPress: jest.fn() };
        const Show = () => {
            api = useSnackbar();
            return null;
        };
        const tree = render(
            <SnackbarProvider testID="toast">
                <Show />
            </SnackbarProvider>
        );
        act(() => {
            api.show('Archived', { action, duration: 3000 });
        });
        const snackbar = tree.root.findByType(Snackbar);
        expect(snackbar.props.action).toBe(action);
        expect(snackbar.props.duration).toBe(3000);
        expect(snackbar.props.testID).toBe('toast');

        act(() => api.dismiss());
        act(() => jest.runOnlyPendingTimers());
        expect(tree.root.findAllByType(Snackbar)).toHaveLength(0);
    });

    it('fails loudly without its provider', () => {
        const Orphan = () => {
            useSnackbar();
            return null;
        };
        jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => renderer.create(<Orphan />)).toThrow(/SnackbarProvider is missing/);
        jest.restoreAllMocks();
    });
});
