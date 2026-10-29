// One rule for every read-only component (review NIT; alta y consola plan, phase 2): given `readOnly` and
// `disabled` (or `isDisabled`) together, a component is disabled — it renders exactly the tree it renders with
// `disabled` alone, so the result never depends on which component a host reached for.
import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import CheckboxListField from '../src/CheckboxListField/CheckboxListField';
import FormField from '../src/Form/FormField';
import FormSelectField from '../src/Form/FormSelectField';
import SecretInputText from '../src/Form/SecretInputText';
import { setI18nConfig } from '../src/Localization/Localization';
import OptionPickerActionSheet from '../src/OptionPicker/OptionPickerActionSheet';

jest.useFakeTimers();

beforeAll(() => setI18nConfig());

const renderJSON = (element) => {
    let tree;
    act(() => {
        tree = renderer.create(<Provider theme={MD3LightTheme}>{element}</Provider>);
    });
    const json = JSON.parse(JSON.stringify(tree.toJSON()));
    act(() => {
        tree.unmount();
        jest.runOnlyPendingTimers();
    });
    return json;
};

const noop = () => {};

// Each component with its disabled prop's name.
const CASES = {
    FormField: [
        'disabled',
        (props) => <FormField mode="outlined" label="Plate" value="SMPL001" highlighted {...props} />,
    ],
    SecretInputText: [
        'disabled',
        (props) => <SecretInputText mode="outlined" label="SSN" value="123456789" {...props} />,
    ],
    FormSelectField: [
        'disabled',
        (props) => (
            <FormSelectField
                label="Color"
                value="SIL"
                options={[{ value: 'SIL', label: 'Silver' }]}
                onSelect={noop}
                testID="color"
                {...props}
            />
        ),
    ],
    CheckboxListField: [
        'disabled',
        (props) => (
            <CheckboxListField
                label="Items"
                options={[{ value: 'photo', label: 'Photo' }]}
                values={['photo']}
                {...props}
            />
        ),
    ],
    OptionPickerActionSheet: [
        'isDisabled',
        (props) => (
            <OptionPickerActionSheet
                helpText="Pick the industries"
                preSelectedOptions={[{ id: 'Restaurant', title: 'Restaurant' }]}
                options={[{ id: 'Restaurant', title: 'Restaurant' }]}
                onPress={noop}
                {...props}
            />
        ),
    ],
};

describe('readOnly with disabled', () => {
    it.each(Object.keys(CASES))('%s is exactly the disabled component', (name) => {
        const [disabledProp, element] = CASES[name];
        const disabled = renderJSON(element({ [disabledProp]: true }));
        expect(renderJSON(element({ [disabledProp]: true, readOnly: true }))).toEqual(disabled);
        // And read-only alone is not that tree: the rule is not vacuous.
        expect(renderJSON(element({ readOnly: true }))).not.toEqual(disabled);
    });
});
