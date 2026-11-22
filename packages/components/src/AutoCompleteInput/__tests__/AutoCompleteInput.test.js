// The places library clears its suggestions whenever `predefinedPlaces` changes identity; a screen that re-renders on
// the input's blur (the shopping address screen) must not hand it a new list, or a click on a suggestion on the web
// lands on a list that is already gone (daxir-qa #336).
import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';
import { GooglePlacesAutocomplete } from '@jmstechnologiesinc/react-native-google-places-autocomplete';

import AutoCompleteInput from '../index';
import { localized, setI18nConfig } from '../../Localization/Localization';
import { installSilentNetwork } from '../../../__tests__/__fixtures__/silentNetwork';

jest.useFakeTimers();
installSilentNetwork();

const mounted = [];

const inProvider = (element) => <Provider theme={MD3LightTheme}>{element}</Provider>;

const render = (element) => {
    let tree;
    act(() => {
        tree = renderer.create(inProvider(element));
    });
    mounted.push(tree);
    return tree;
};

const update = (tree, element) => {
    act(() => {
        tree.update(inProvider(element));
    });
};

const placesOf = (tree) => tree.root.findByType(GooglePlacesAutocomplete).props.predefinedPlaces;

afterEach(() => {
    act(() => {
        mounted.splice(0).forEach((tree) => tree.unmount());
        jest.runOnlyPendingTimers();
    });
});

beforeAll(() => {
    setI18nConfig();
});

describe('AutoCompleteInput', () => {
    it('keeps the same predefined places across a re-render with new callbacks', () => {
        const tree = render(<AutoCompleteInput title="address" onBlur={() => {}} onFocus={() => {}} />);
        const before = placesOf(tree);

        update(tree, <AutoCompleteInput title="address" onBlur={() => {}} onFocus={() => {}} />);

        expect(placesOf(tree)).toBe(before);
        expect(before).toEqual([{ description: localized('useGPSLocation'), isPredefinedPlace: true }]);
    });

    it('drops the GPS place when the location permission is denied, and keeps that list stable too', () => {
        const tree = render(<AutoCompleteInput title="address" locationPermissionStatus={false} />);
        expect(placesOf(tree)).toHaveLength(1);

        update(tree, <AutoCompleteInput title="address" locationPermissionStatus={true} />);
        const denied = placesOf(tree);
        expect(denied).toEqual([]);

        update(tree, <AutoCompleteInput title="address" locationPermissionStatus={true} onBlur={() => {}} />);
        expect(placesOf(tree)).toBe(denied);
    });

    it('offers no GPS place when the screen asks for none', () => {
        const tree = render(<AutoCompleteInput title="address" predefinedPlaces={false} />);

        expect(placesOf(tree)).toEqual([]);
    });
});
