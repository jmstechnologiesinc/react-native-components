// C-25 — `readOnly` and `highlightFields` on the three forms the partner
// console reuses, and the header-height crash that kept `BusinessInfo` out of
// any screen without a navigator.
import React from 'react';
import { StyleSheet } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider, TextInput } from '@jmstechnologiesinc/react-native-paper';

import ButtonWrapper from '../../ButtonWrapper/ButtonWrapper';
import ChipList from '../../ChipList/ChipList';
import { localized, setI18nConfig } from '../../Localization/Localization';
import OptionSheet from '../../OptionPicker/OptionSheet';
import { EMPTY_VALUE } from '../../valueText';
// Each form by its own module, as the portable entry exposes them: `Form.js`
// also carries `PhoneNumber`, whose phone-input library imports this package's
// whole barrel back.
import BusinessInfo from '../FormBusinessInfo';
import PersonInfo from '../FormPersonInfo';
import VehicleInfo from '../FormVehicleInfo';
import { drawnInput } from './__fixtures__/drawnInput';

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

// Alta y consola plan 2.1-2.4 (audit F6): under `readOnly` each field is shown, not disabled — it takes no input
// and keeps the enabled colours, as Paper draws them. One line per value, so a failure names the field.
const { colors } = MD3LightTheme;
const drawnAs = (tree, values) =>
    values.map((value) => {
        const { editable, textColor } = drawnInput(tree, value);
        return `${value}: ${editable ? 'editable' : 'not editable'}, ${
            textColor === colors.onSurfaceDisabled ? 'disabled' : 'enabled'
        }`;
    });
const readOnlyLines = (values) => values.map((value) => `${value}: not editable, enabled`);
const disabledLines = (values) => values.map((value) => `${value}: not editable, disabled`);

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

    it('shows every field read-only, the email included, under readOnly: not editable, not disabled', () => {
        const values = ['Jose', 'Santos', 'jose@example.com', '8297872134'];
        expect(drawnAs(render(<Form.PersonInfo {...PERSON} readOnly />), values)).toEqual(readOnlyLines(values));
    });

    it('greys out every field but the email under isDisabled, as before', () => {
        const tree = render(<Form.PersonInfo {...PERSON} isDisabled />);
        const locked = ['Jose', 'Santos', '8297872134'];
        expect(drawnAs(tree, locked)).toEqual(disabledLines(locked));
        expect(drawnAs(tree, ['jose@example.com'])).toEqual(['jose@example.com: editable, enabled']);
    });

    it('marks exactly the highlighted fields', () => {
        const tree = render(<Form.PersonInfo {...PERSON} highlightFields={['lastName', 'email']} />);
        expect(changedCount(tree)).toBe(2);
        expect(outlinedInPrimary(tree, 'Santos')).toBe(true);
        expect(outlinedInPrimary(tree, 'Jose')).toBe(false);
    });

    it('keeps the «changed» outline and its line on a read-only form', () => {
        const tree = render(<Form.PersonInfo {...PERSON} readOnly highlightFields={['firstName', 'email']} />);
        expect(changedCount(tree)).toBe(2);
        expect(drawnInput(tree, 'Jose').outlineColor).toBe(colors.primary);
        expect(drawnInput(tree, 'jose@example.com').outlineColor).toBe(colors.primary);
        expect(drawnInput(tree, 'Santos').outlineColor).toBe(colors.outline);
    });

    it('renders as before without the new props', () => {
        const tree = render(<Form.PersonInfo {...PERSON} />);
        expect(changedCount(tree)).toBe(0);
        expect(inputWithValue(tree, 'Jose').props.editable).toBe(true);
    });
});

describe('Form.VehicleInfo', () => {
    const values = ['Toyota', 'Camry', 'White', '2019', 'ABC123'];

    it('shows every field read-only under readOnly, and greys them out under isDisabled, as before', () => {
        expect(drawnAs(render(<Form.VehicleInfo {...VEHICLE} readOnly />), values)).toEqual(readOnlyLines(values));
        expect(drawnAs(render(<Form.VehicleInfo {...VEHICLE} isDisabled />), values)).toEqual(disabledLines(values));
    });

    it('marks the highlighted fields', () => {
        const tree = render(<Form.VehicleInfo {...VEHICLE} highlightFields={['licensePlateNumber']} />);
        expect(changedCount(tree)).toBe(1);
        expect(outlinedInPrimary(tree, 'ABC123')).toBe(true);
    });

    it('keeps the «changed» outline and its line on a read-only form', () => {
        const tree = render(<Form.VehicleInfo {...VEHICLE} readOnly highlightFields={['licensePlateNumber']} />);
        expect(changedCount(tree)).toBe(1);
        expect(drawnInput(tree, 'ABC123').outlineColor).toBe(colors.primary);
    });
});

describe('Form.BusinessInfo', () => {
    it('renders outside a navigator (useHeaderHeight used to throw here)', () => {
        expect(() => render(<Form.BusinessInfo {...BUSINESS} />)).not.toThrow();
    });

    const values = ['Casa Nostra', 'Pasta', '1 Main St', 'Suite 2', '6175550100', '12-3456789'];
    const industries = [{ id: 'Restaurant', title: 'Restaurant' }];

    it('shows every field read-only under readOnly, the secret one masked with no «show» toggle', () => {
        const tree = render(<Form.BusinessInfo {...BUSINESS} readOnly />);
        expect(drawnAs(tree, values)).toEqual(readOnlyLines(values));
        expect(inputWithValue(tree, '12-3456789').props.secureTextEntry).toBe(true);
        expect(tree.root.findAllByType(TextInput.Icon)).toHaveLength(0);
    });

    it('greys out every field under isDisabled, as before', () => {
        expect(drawnAs(render(<Form.BusinessInfo {...BUSINESS} isDisabled />), values)).toEqual(disabledLines(values));
    });

    it('shows the industries as rows of a list named by its title under readOnly: no chip, nothing disabled', () => {
        const tree = render(<Form.BusinessInfo {...BUSINESS} industries={industries} readOnly />);
        // The host nodes, as a screen reader meets them (review MD-1).
        expect(hostOf(tree, 'chip')).toHaveLength(0);
        const list = tree.root.findAll(
            (node) => typeof node.type === 'string' && node.props.role === 'list' && node.props['aria-label']
        );
        expect(list.map((node) => node.props['aria-label'])).toEqual([localized('Industries')]);
        const rows = list[0].findAll((node) => typeof node.type === 'string' && node.props.role === 'listitem');
        expect(rows.map((row) => [row.props.accessible, row.props.accessibilityLabel])).toEqual([[true, 'Restaurant']]);
        // Nothing in the picker is a control or announced disabled, on native (accessibilityState) or the web.
        const industriesSection = list[0].parent;
        const controls = industriesSection.findAll(
            (node) =>
                typeof node.type === 'string' &&
                (node.props.accessibilityRole === 'button' ||
                    node.props.role === 'button' ||
                    node.props.accessibilityState?.disabled ||
                    node.props['aria-disabled'])
        );
        expect(controls.map((node) => node.type)).toEqual([]);
        const label = tree.root.find((node) => node.type === 'Text' && node.props.children === 'Restaurant');
        expect(StyleSheet.flatten(label.props.style).color).toBe(colors.onSurface);
        // No help on how to pick, and no sheet to pick from (review LO-4).
        expect(JSON.stringify(tree.toJSON())).not.toContain(localized('helpTextIndustries'));
        expect(tree.root.findAllByType(OptionSheet)).toHaveLength(0);
        const editable = render(<Form.BusinessInfo {...BUSINESS} industries={industries} />);
        expect(JSON.stringify(editable.toJSON())).toContain(localized('helpTextIndustries'));
        expect(editable.root.findAllByType(OptionSheet)).toHaveLength(1);
    });

    it('shows the library’s empty value under readOnly when no industry is picked', () => {
        const tree = render(<Form.BusinessInfo {...BUSINESS} industries={[]} readOnly />);
        const lists = tree.root.findAll((node) => typeof node.type === 'string' && node.props.role === 'list');
        expect(lists).toHaveLength(0);
        const empty = tree.root.findAll((node) => node.type === 'Text' && node.props.children === EMPTY_VALUE);
        expect(empty).toHaveLength(1);
    });

    it('keeps the industries picker as it was under isDisabled and while editable', () => {
        const disabled = render(<Form.BusinessInfo {...BUSINESS} industries={industries} isDisabled />);
        expect(disabled.root.findByType(ButtonWrapper).props.isDisabled).toBe(true);
        expect(disabled.root.findByType(ChipList).props.isDisabled).toBe(true);
        const editable = render(<Form.BusinessInfo {...BUSINESS} industries={industries} />);
        expect(editable.root.findByType(ButtonWrapper).props.isDisabled).toBe(false);
        expect(typeof editable.root.findByType(ChipList).props.onClose).toBe('function');
    });

    it('keeps the «changed» outline and its line on a read-only form, the industries’ line too', () => {
        const tree = render(
            <Form.BusinessInfo {...BUSINESS} readOnly highlightFields={['title', 'tin', 'industries']} />
        );
        expect(changedCount(tree)).toBe(3);
        expect(drawnInput(tree, 'Casa Nostra').outlineColor).toBe(colors.primary);
        expect(drawnInput(tree, '12-3456789').outlineColor).toBe(colors.primary);
        expect(drawnInput(tree, 'Pasta').outlineColor).toBe(colors.outline);
    });

    it('marks highlighted fields, industries included', () => {
        const tree = render(<Form.BusinessInfo {...BUSINESS} highlightFields={['title', 'tin', 'industries']} />);
        expect(changedCount(tree)).toBe(3);
    });

    // P-3: the merchant's legal entity rides with the tax id.
    const LEGAL = { legalName: 'Casa Nostra LLC', taxAddress: '9 Elm St, Boston', taxIdTypeLabel: 'EIN' };

    it('shows the legal name and tax address with the tax id, and reports each by its field', () => {
        const changes = [];
        const tree = render(
            <Form.BusinessInfo {...BUSINESS} {...LEGAL} inputActionHandler={(field, value) => changes.push([field, value])} />
        );
        act(() => inputWithValue(tree, 'Casa Nostra LLC').props.onChangeText('Casa Nostra Inc'));
        act(() => inputWithValue(tree, '9 Elm St, Boston').props.onChangeText('10 Elm St'));
        expect(changes).toEqual([['legalName', 'Casa Nostra Inc'], ['taxAddress', '10 Elm St']]);
        expect(JSON.stringify(tree.toJSON())).toContain('(EIN)');
        const hidden = render(<Form.BusinessInfo {...BUSINESS} {...LEGAL} showTIN={false} />);
        expect(hidden.root.findAll((node) => node.props.value === 'Casa Nostra LLC')).toHaveLength(0);
    });

    it('names the tax id on file (masked) instead of showing it', () => {
        const tree = render(<Form.BusinessInfo {...BUSINESS} tin="" tinOnFile="•••••6789" />);
        expect(JSON.stringify(tree.toJSON())).toContain('•••••6789');
    });

    it('shows the legal entity read-only under readOnly and highlights it', () => {
        const tree = render(
            <Form.BusinessInfo {...BUSINESS} {...LEGAL} readOnly highlightFields={['legalName', 'taxAddress']} />
        );
        const legal = ['Casa Nostra LLC', '9 Elm St, Boston'];
        expect(drawnAs(tree, legal)).toEqual(readOnlyLines(legal));
        expect(legal.map((value) => drawnInput(tree, value).outlineColor)).toEqual([colors.primary, colors.primary]);
        expect(changedCount(tree)).toBe(2);
    });
});

// K-32 — per-field server errors: `errors: [{ field, code, message? }]`, by
// the names the form reports to `inputActionHandler`.
const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID);

const textOf = (node) => JSON.stringify(node.props.children);

// Whether the Paper input holding a value is in its error state.
const inError = (tree, value) =>
    tree.root.findAll((node) => node.props.value === value && node.props.error === true).length > 0;

describe('server errors on the forms', () => {
    it('shows the message under its field and puts only that input in error', () => {
        const tree = render(
            <Form.PersonInfo
                {...PERSON}
                readOnly
                errors={[{ field: 'lastName', code: 'invalid_format', message: 'Use the legal name' }]}
            />
        );
        const lines = hostOf(tree, 'error.lastName');
        expect(lines).toHaveLength(1);
        expect(textOf(lines[0])).toContain('Use the legal name');
        expect(inError(tree, 'Santos')).toBe(true);
        expect(inError(tree, 'Jose')).toBe(false);
        expect(hostOf(tree, 'error.firstName')).toHaveLength(0);
    });

    it('falls back to the code when the host resolved no message', () => {
        const tree = render(
            <Form.VehicleInfo {...VEHICLE} errors={[{ field: 'licensePlateNumber', code: 'mismatch' }]} />
        );
        expect(textOf(hostOf(tree, 'error.licensePlateNumber')[0])).toContain('mismatch');
        expect(inError(tree, 'ABC123')).toBe(true);
    });

    it('shows one line per error of a field', () => {
        const tree = render(
            <Form.BusinessInfo
                {...BUSINESS}
                errors={[
                    { field: 'title', code: 'too_short' },
                    { field: 'title', code: 'reserved' },
                    { field: 'tin', code: 'invalid' },
                    { field: 'industries', code: 'required' },
                ]}
            />
        );
        expect(hostOf(tree, 'error.title')).toHaveLength(2);
        expect(hostOf(tree, 'error.tin')).toHaveLength(1);
        expect(hostOf(tree, 'error.industries')).toHaveLength(1);
        expect(inError(tree, 'Casa Nostra')).toBe(true);
        expect(inError(tree, '12-3456789')).toBe(true);
        expect(inError(tree, 'Pasta')).toBe(false);
    });

    it('ignores errors of fields the form does not render', () => {
        const tree = render(
            <Form.PersonInfo {...PERSON} showEmailInput={false} errors={[{ field: 'email', code: 'taken' }]} />
        );
        expect(hostOf(tree, 'error.email')).toHaveLength(0);
    });

    it('keeps the form’s own required message next to a server error', () => {
        const tree = render(
            <Form.PersonInfo {...PERSON} firstName="" errors={[{ field: 'firstName', code: 'blocked_name' }]} />
        );
        expect(hostOf(tree, 'error.firstName')).toHaveLength(1);
        expect(JSON.stringify(tree.toJSON())).toContain('blocked_name');
    });

    it('renders no error line without the prop', () => {
        const tree = render(<Form.BusinessInfo {...BUSINESS} />);
        expect(JSON.stringify(tree.toJSON())).not.toMatch(/"error\./);
        expect(inError(tree, 'Casa Nostra')).toBe(false);
    });
});

// C-22 — the vehicle form with the catalogue: its options come from the host, a pick reports the market field (and,
// for a make or a model, its name as well), and without a catalogue slice make and model stay typed text.
describe('Form.VehicleInfo with the catalogue', () => {
    const CATALOG = {
        vehicleTypes: [
            { value: 'car', label: 'Car' },
            { value: 'motorcycle', label: 'Motorcycle' },
        ],
        colors: [
            { value: 'SIL', label: 'Silver' },
            { value: 'BLK', label: 'Black' },
        ],
        makes: [
            { value: 'vpic:448', label: 'Toyota' },
            { value: 'vpic:474', label: 'Honda' },
        ],
        models: [{ value: 'vpic:2469', label: 'Camry' }],
    };
    const CATALOG_VEHICLE = {
        vehicleType: 'car',
        year: '2021',
        makeId: 'vpic:448',
        make: 'Toyota',
        modelId: 'vpic:2469',
        model: 'Camry',
        color: 'SIL',
        licensePlateNumber: 'SMPL001',
        licensePlateRegion: 'US-MA',
        vin: '0SAMPLE0VIN000001',
    };

    // Opens a select: its row is a Pressable, whose own `onPress` is the handle the test renderer offers.
    const pressable = (tree, testID) =>
        act(() =>
            tree.root
                .find((node) => typeof node.type !== 'string' && node.props.testID === testID && node.props.onPress)
                .props.onPress()
        );

    it('shows each value by its option label, in the order of canon §9.15', () => {
        const tree = render(<Form.VehicleInfo {...CATALOG_VEHICLE} catalog={CATALOG} inputActionHandler={() => {}} />);
        const values = tree.root.findAll((node) => node.type === 'TextInput').map((node) => node.props.value);
        expect(values).toEqual(['Car', '2021', 'Toyota', 'Camry', 'Silver', 'SMPL001', 'US-MA', '0SAMPLE0VIN000001']);
    });

    it('#91: with catalog.typeOnly the form is the vehicle type alone', () => {
        const reported = [];
        const tree = render(
            <Form.VehicleInfo
                {...CATALOG_VEHICLE}
                vehicleType="motorcycle"
                catalog={{ ...CATALOG, typeOnly: true, flags: [{ value: 'salvage_title', label: 'Salvage title' }] }}
                inputActionHandler={(field, value) => reported.push([field, value])}
            />
        );
        const values = tree.root.findAll((node) => node.type === 'TextInput').map((node) => node.props.value);
        expect(values).toEqual(['Motorcycle']);
        expect(tree.root.findAll((node) => node.props.testID === 'vehicle.flags')).toHaveLength(0);
        pressable(tree, 'vehicle.vehicleType');
        act(() => tree.root.find((node) => node.props.testID === 'vehicle.vehicleType.car').props.onPress());
        expect(reported).toEqual([['vehicleType', 'car']]);
    });

    it('reports a make by its id and its name, and a color by its code', () => {
        const reported = [];
        const tree = render(
            <Form.VehicleInfo
                {...CATALOG_VEHICLE}
                catalog={CATALOG}
                inputActionHandler={(field, value) => reported.push([field, value])}
            />
        );
        pressable(tree, 'vehicle.make');
        act(() => tree.root.find((node) => node.props.testID === 'vehicle.make.vpic:474').props.onPress());
        pressable(tree, 'vehicle.color');
        act(() => tree.root.find((node) => node.props.testID === 'vehicle.color.BLK').props.onPress());
        expect(reported).toEqual([
            ['makeId', 'vpic:474'],
            ['make', 'Honda'],
            ['color', 'BLK'],
        ]);
    });

    it('#62: picks the plate region from the regions the host hands, shown by its label', () => {
        const plateRegions = [
            { value: 'US-MA', label: 'Massachusetts (US-MA)' },
            { value: 'DO', label: 'Dominican Republic (DO)' },
        ];
        const reported = [];
        const tree = render(
            <Form.VehicleInfo
                {...CATALOG_VEHICLE}
                catalog={{ ...CATALOG, plateRegions }}
                inputActionHandler={(field, value) => reported.push([field, value])}
            />
        );
        expect(inputWithValue(tree, 'Massachusetts (US-MA)')).toBeDefined();
        pressable(tree, 'vehicle.licensePlateRegion');
        act(() => tree.root.find((node) => node.props.testID === 'vehicle.licensePlateRegion.DO').props.onPress());
        expect(reported).toEqual([['licensePlateRegion', 'DO']]);
    });

    it('C-d: ticks the flags the host hands, reports the whole list, and puts their error under them', () => {
        const flags = [
            { value: 'salvage_title', label: 'Salvage title' },
            { value: 'commercial_branding', label: 'Commercial branding' },
        ];
        const reported = [];
        const tree = render(
            <Form.VehicleInfo
                {...CATALOG_VEHICLE}
                flags={['commercial_branding']}
                catalog={{ ...CATALOG, flags }}
                errors={[{ field: 'flags', code: 'vehicle_flags_invalid' }]}
                inputActionHandler={(field, value) => reported.push([field, value])}
            />
        );
        const tick = (value) =>
            act(() =>
                tree.root
                    .find((node) => node.props.testID === `vehicle.flags-${value}` && node.props.onPress)
                    .props.onPress()
            );
        tick('salvage_title');
        tick('commercial_branding');
        expect(reported).toEqual([
            ['flags', ['commercial_branding', 'salvage_title']],
            ['flags', []],
        ]);
        expect(hostOf(tree, 'error.flags')).toHaveLength(1);
        // Without flags in the catalogue the form is as before.
        const plain = render(<Form.VehicleInfo {...CATALOG_VEHICLE} catalog={CATALOG} inputActionHandler={() => {}} />);
        expect(plain.root.findAll((node) => node.props.testID === 'vehicle.flags')).toHaveLength(0);
    });

    it('keeps make and model as typed text when the catalogue has no slice for them', () => {
        const reported = [];
        const tree = render(
            <Form.VehicleInfo
                {...CATALOG_VEHICLE}
                makeId={undefined}
                modelId={undefined}
                make="Trek"
                model="FX 2"
                catalog={{ ...CATALOG, makes: [], models: [] }}
                inputActionHandler={(field, value) => reported.push([field, value])}
            />
        );
        act(() => inputWithValue(tree, 'Trek').props.onChangeText('Trek '));
        expect(inputWithValue(tree, 'FX 2').props.editable).not.toBe(false);
        expect(reported).toEqual([['make', 'Trek ']]);
    });

    it('shows a stored make the slice no longer lists by its name', () => {
        const tree = render(
            <Form.VehicleInfo
                {...CATALOG_VEHICLE}
                makeId="dx:retired"
                make="Retired Make"
                catalog={CATALOG}
                inputActionHandler={() => {}}
            />
        );
        expect(inputWithValue(tree, 'Retired Make')).toBeDefined();
    });

    const CATALOG_VALUES = ['Car', '2021', 'Toyota', 'Camry', 'Silver', 'SMPL001', 'US-MA', '0SAMPLE0VIN000001'];

    it('shows every field read-only and offers no menu under readOnly', () => {
        const tree = render(
            <Form.VehicleInfo {...CATALOG_VEHICLE} catalog={CATALOG} readOnly inputActionHandler={() => {}} />
        );
        expect(drawnAs(tree, CATALOG_VALUES)).toEqual(readOnlyLines(CATALOG_VALUES));
        // No select is a button to open: nothing in the form answers a press.
        expect(tree.root.findAll((node) => node.props.accessibilityRole === 'button')).toHaveLength(0);
        expect(tree.root.findAll((node) => node.props.testID === 'vehicle.make.vpic:474')).toHaveLength(0);
    });

    it('greys out every field and opens no menu under isDisabled, as before', () => {
        const tree = render(
            <Form.VehicleInfo {...CATALOG_VEHICLE} catalog={CATALOG} isDisabled inputActionHandler={() => {}} />
        );
        expect(drawnAs(tree, CATALOG_VALUES)).toEqual(disabledLines(CATALOG_VALUES));
        pressable(tree, 'vehicle.make');
        expect(tree.root.findAll((node) => node.props.testID === 'vehicle.make.vpic:474')).toHaveLength(0);
    });

    it('under readOnly shows the flags as rows, the declared ones checked, and keeps the «changed» outlines', () => {
        const flags = [
            { value: 'salvage_title', label: 'Salvage title' },
            { value: 'commercial_branding', label: 'Commercial branding' },
        ];
        const tree = render(
            <Form.VehicleInfo
                {...CATALOG_VEHICLE}
                flags={['commercial_branding']}
                catalog={{ ...CATALOG, flags }}
                readOnly
                highlightFields={['color', 'make']}
                inputActionHandler={() => {}}
            />
        );
        // What a screen reader meets: each flag's host row, the declared one announced as selected.
        const flagRow = (value) => hostOf(tree, `vehicle.flags-${value}`)[0].props;
        expect(flagRow('salvage_title').accessibilityLabel ?? '').not.toContain('selected');
        expect(flagRow('commercial_branding').accessibilityLabel).toBe('Commercial branding, selected');
        expect(changedCount(tree)).toBe(2);
        expect(drawnInput(tree, 'Silver').outlineColor).toBe(colors.primary);
        expect(drawnInput(tree, 'Toyota').outlineColor).toBe(colors.primary);
    });

    it('marks the highlighted fields and puts a server error under its field', () => {
        const tree = render(
            <Form.VehicleInfo
                {...CATALOG_VEHICLE}
                catalog={CATALOG}
                highlightFields={['color', 'vin']}
                errors={[{ field: 'vin', code: 'vin_check_digit' }]}
                inputActionHandler={() => {}}
            />
        );
        expect(changedCount(tree)).toBe(2);
        expect(outlinedInPrimary(tree, 'Silver')).toBe(true);
        expect(hostOf(tree, 'error.vin')).toHaveLength(1);
        expect(inError(tree, '0SAMPLE0VIN000001')).toBe(true);
    });
});
