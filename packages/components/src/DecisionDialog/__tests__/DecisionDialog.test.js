jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import DecisionDialog from '../DecisionDialog';

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

const byTestID = (tree, id) => hostOf(tree, `decision-${id}`);

const press = (tree, id) => act(() => pressableOf(tree, `decision-${id}`).props.onPress());

const OPTIONS = [
    { value: 'document_expired', label: 'Expired', description: 'The expiry date has passed' },
    { value: 'document_not_readable', label: 'Not readable' },
];

const base = {
    visible: true,
    title: 'Reject document',
    confirmLabel: 'Reject',
    onConfirm: () => {},
    onDismiss: () => {},
    testID: 'decision',
};

beforeAll(() => {
    setI18nConfig();
});

describe('DecisionDialog', () => {
    it('renders the title, the description and a localized cancel', () => {
        const tree = render(<DecisionDialog {...base} description="The partner will be asked again." />);
        const text = JSON.stringify(tree.toJSON());

        expect(text).toContain('Reject document');
        expect(text).toContain('The partner will be asked again.');
        expect(text).toContain('Cancel');
    });

    it('renders nothing while not visible', () => {
        const tree = render(<DecisionDialog {...base} visible={false} />);
        expect(JSON.stringify(tree.toJSON())).not.toContain('Reject document');
    });

    it('offers the options as radio items, labelled with their description', () => {
        const onSelectOption = jest.fn();
        const tree = render(<DecisionDialog {...base} options={OPTIONS} onSelectOption={onSelectOption} />);
        const expired = byTestID(tree, 'option-document_expired');

        expect(expired.props.accessibilityRole).toBe('radio');
        expect(expired.props.accessibilityLabel).toBe('Expired, The expiry date has passed');
        press(tree, 'option-document_expired');
        expect(onSelectOption).toHaveBeenCalledWith('document_expired');
    });

    it('keeps confirm disabled until an option is chosen', () => {
        const tree = render(<DecisionDialog {...base} options={OPTIONS} />);
        expect(byTestID(tree, 'confirm').props.accessibilityState.disabled).toBe(true);

        const chosen = render(<DecisionDialog {...base} options={OPTIONS} selectedOption="document_expired" />);
        expect(byTestID(chosen, 'confirm').props.accessibilityState.disabled).toBe(false);
    });

    it('marks a required note and keeps confirm disabled while it is blank', () => {
        const note = { label: 'Note to the partner', value: '  ', onChangeText: () => {}, required: true };
        const tree = render(<DecisionDialog {...base} note={note} />);

        expect(JSON.stringify(tree.toJSON())).toContain('Required');
        expect(byTestID(tree, 'confirm').props.accessibilityState.disabled).toBe(true);
    });

    it('shows the server error on the note', () => {
        const note = { label: 'Note', value: '', onChangeText: () => {}, required: true, error: 'A note is required' };
        const tree = render(<DecisionDialog {...base} note={note} />);
        expect(JSON.stringify(tree.toJSON())).toContain('A note is required');
    });

    it('paints a danger confirmation with the theme error colour, and only a danger one', () => {
        const danger = render(<DecisionDialog {...base} confirmTone="danger" />);
        expect(JSON.stringify(danger.toJSON())).toContain(MD3LightTheme.colors.error);

        const primary = render(<DecisionDialog {...base} />);
        expect(JSON.stringify(primary.toJSON())).not.toContain(MD3LightTheme.colors.error);
    });

    it('confirms and dismisses', () => {
        const onConfirm = jest.fn();
        const onDismiss = jest.fn();
        const tree = render(<DecisionDialog {...base} onConfirm={onConfirm} onDismiss={onDismiss} />);

        press(tree, 'confirm');
        press(tree, 'cancel');

        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('keeps its own choice when the host does not control it, and confirms with it', () => {
        const onConfirm = jest.fn();
        const tree = render(<DecisionDialog {...base} options={OPTIONS} onConfirm={onConfirm} />);

        expect(byTestID(tree, 'confirm').props.accessibilityState.disabled).toBe(true);
        press(tree, 'option-document_not_readable');
        expect(byTestID(tree, 'confirm').props.accessibilityState.disabled).toBe(false);

        press(tree, 'confirm');
        expect(onConfirm).toHaveBeenCalledWith('document_not_readable');
    });

    it('locks everything while busy', () => {
        const tree = render(<DecisionDialog {...base} options={OPTIONS} selectedOption="document_expired" busy />);

        expect(byTestID(tree, 'confirm').props.accessibilityState.disabled).toBe(true);
        expect(byTestID(tree, 'cancel').props.accessibilityState.disabled).toBe(true);
        expect(byTestID(tree, 'option-document_expired').props.accessibilityState.disabled).toBe(true);
    });

    it('renders a summary and extra children', () => {
        const tree = render(
            <DecisionDialog {...base} summary="Plate ABC-123 -> ABC-124">
                <Text>extra</Text>
            </DecisionDialog>
        );
        const text = JSON.stringify(tree.toJSON());
        expect(text).toContain('Plate ABC-123 -> ABC-124');
        expect(text).toContain('extra');
    });
});
