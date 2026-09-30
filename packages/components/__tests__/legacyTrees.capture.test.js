// Captures the legacy trees of `legacyRendering.test.js` from the OLD code, so where
// `__fixtures__/legacyTrees.json` came from can be checked, not taken on trust. Skipped unless asked:
//
//   git archive partner-ui/k22 packages/components/src | tar -x -C <dir>
//   ln -s <repo>/node_modules <dir>/node_modules
//   CAPTURE_LEGACY_FROM=<dir>/packages/components/src npx jest packages/components/__tests__/legacyTrees.capture
//
// It renders each case below with THAT source (its own catalogue included), exactly as the comparison renders the
// current one, and writes the tree into the fixture. `Form.DriverInfo (driver onboarding)` was captured this way from
// `partner-ui/k22` @ 7d46582 (the form before C-25's `readOnly`, `highlightFields` and `errors`);
// `Form.VehicleInfo (vehicle form)` from `admin-app` @ 516446e (the form before C-22's catalogue props).
import fs from 'fs';
import path from 'path';

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

const FROM = process.env.CAPTURE_LEGACY_FROM;
const FIXTURE = path.join(__dirname, '__fixtures__', 'legacyTrees.json');

// The vehicle form as the app fills it before the catalogue (C-22): free-text make, model and color.
const LEGACY_VEHICLE = { make: 'Toyota', model: 'Camry', color: 'White', year: '2019', licensePlateNumber: 'ABC123' };

// The cases this capture owns, rendered from the old source (`old(file)` requires a module of it).
const CASES = {
    'Form.DriverInfo (driver onboarding)': (old) => {
        const FormDriverInfo = old('Form/FormDriverInfo').default;
        return <FormDriverInfo licenseNumer="D1234567" ssn="123456789" inputActionHandler={() => {}} />;
    },
    'Form.VehicleInfo (vehicle form)': (old) => {
        const FormVehicleInfo = old('Form/FormVehicleInfo').default;
        return <FormVehicleInfo {...LEGACY_VEHICLE} inputActionHandler={() => {}} />;
    },
};

jest.useFakeTimers();

(FROM ? describe : describe.skip)(`legacy trees captured from ${FROM}`, () => {
    const old = (file) => require(path.join(FROM, file));

    beforeAll(() => old('Localization/Localization').setI18nConfig());

    it.each(Object.keys(CASES))('%s', (name) => {
        let tree;
        act(() => {
            tree = renderer.create(<Provider theme={MD3LightTheme}>{CASES[name](old)}</Provider>);
        });
        const json = JSON.parse(JSON.stringify(tree.toJSON()));
        act(() => {
            tree.unmount();
            jest.runOnlyPendingTimers();
        });

        const fixture = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
        // The fixture's own format (one-space indent, no final newline): a capture that finds the same tree
        // leaves the file byte for byte as it was.
        fs.writeFileSync(FIXTURE, JSON.stringify({ ...fixture, [name]: json }, null, 1));
        expect(json).toBeTruthy();
    });
});
