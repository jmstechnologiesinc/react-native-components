// C-25 — `readOnly` and `highlightFields` on the three forms the partner
// console reuses, and the header-height crash that kept `BusinessInfo` out of
// any screen without a navigator.
import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
// Each form by its own module, as the portable entry exposes them: `Form.js`
// also carries `PhoneNumber`, whose phone-input library imports this package's
// whole barrel back.
import BusinessInfo from '../FormBusinessInfo';
import PersonInfo from '../FormPersonInfo';
import VehicleInfo from '../FormVehicleInfo';

const Form = { BusinessInfo, PersonInfo, VehicleInfo };

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

beforeAll(() => {
    setI18nConfig();
});

// The native input holding a value: `editable` is what the user meets.
const inputWithValue = (tree, value) =>
    tree.root.findAll((node) => node.type === 'TextInput' && node.props.value === value)[0];

// Whether the Paper input holding a value was given the `primary` outline.
const outlinedInPrimary = (tree, value) =>
    tree.root.findAll((node) => node.props.value === value && node.props.outlineColor === MD3LightTheme.colors.primary)
        .length > 0;

const changedCount = (tree) => (JSON.stringify(tree.toJSON()).match(/"Changed"/g) || []).length;

const PERSON = {
    firstName: 'Jose',
    lastName: 'Santos',
    email: 'jose@example.com',
    phoneNumber: '8297872134',
    inputActionHandler: () => {},
};

const VEHICLE = {
    make: 'Toyota',
    model: 'Camry',
    color: 'White',
    year: '2019',
    licensePlateNumber: 'ABC123',
    inputActionHandler: () => {},
};

const BUSINESS = {
    storeTitle: 'Casa Nostra',
    description: 'Pasta',
    location: '1 Main St',
    line2: 'Suite 2',
    phoneNumber: '6175550100',
    email: 'hola@casanostra.com',
    website: 'casanostra.com',
    showTIN: true,
    tin: '12-3456789',
    industries: [],
    inputActionHandler: () => {},
};

describe('Form.PersonInfo', () => {
    it('keeps the email editable under isDisabled, as the app has always had it', () => {
        const tree = render(<Form.PersonInfo {...PERSON} isDisabled />);
        expect(inputWithValue(tree, 'Jose').props.editable).toBe(false);
        expect(inputWithValue(tree, 'jose@example.com').props.editable).toBe(true);
    });

    it('locks every field, the email included, under readOnly', () => {
        const tree = render(<Form.PersonInfo {...PERSON} readOnly />);
        for (const value of ['Jose', 'Santos', 'jose@example.com', '8297872134']) {
            expect(`${value}:${inputWithValue(tree, value).props.editable}`).toBe(`${value}:false`);
        }
    });

    it('marks exactly the highlighted fields', () => {
        const tree = render(<Form.PersonInfo {...PERSON} highlightFields={['lastName', 'email']} />);
        expect(changedCount(tree)).toBe(2);
        expect(outlinedInPrimary(tree, 'Santos')).toBe(true);
        expect(outlinedInPrimary(tree, 'Jose')).toBe(false);
    });

    it('keeps the marker on a read-only form, where Paper drops the outline', () => {
        const tree = render(<Form.PersonInfo {...PERSON} readOnly highlightFields={['firstName']} />);
        expect(changedCount(tree)).toBe(1);
    });

    it('renders as before without the new props', () => {
        const tree = render(<Form.PersonInfo {...PERSON} />);
        expect(changedCount(tree)).toBe(0);
        expect(inputWithValue(tree, 'Jose').props.editable).toBe(true);
    });
});

describe('Form.VehicleInfo', () => {
    it('locks every field under readOnly, as under isDisabled', () => {
        for (const props of [{ readOnly: true }, { isDisabled: true }]) {
            const tree = render(<Form.VehicleInfo {...VEHICLE} {...props} />);
            for (const value of ['Toyota', 'Camry', 'White', '2019', 'ABC123']) {
                expect(inputWithValue(tree, value).props.editable).toBe(false);
            }
        }
    });

    it('marks the highlighted fields', () => {
        const tree = render(<Form.VehicleInfo {...VEHICLE} highlightFields={['licensePlateNumber']} />);
        expect(changedCount(tree)).toBe(1);
        expect(outlinedInPrimary(tree, 'ABC123')).toBe(true);
    });
});

describe('Form.BusinessInfo', () => {
    it('renders outside a navigator (useHeaderHeight used to throw here)', () => {
        expect(() => render(<Form.BusinessInfo {...BUSINESS} />)).not.toThrow();
    });

    it('locks every field under readOnly, the secret one included', () => {
        const tree = render(<Form.BusinessInfo {...BUSINESS} readOnly />);
        for (const value of ['Casa Nostra', 'Pasta', '1 Main St', 'Suite 2', '6175550100', '12-3456789']) {
            expect(`${value}:${inputWithValue(tree, value).props.editable}`).toBe(`${value}:false`);
        }
    });

    it('marks highlighted fields, industries included', () => {
        const tree = render(<Form.BusinessInfo {...BUSINESS} highlightFields={['title', 'tin', 'industries']} />);
        expect(changedCount(tree)).toBe(3);
    });
});
