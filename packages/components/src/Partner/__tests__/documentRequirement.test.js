import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { EN, ES } from '@jmstechnologiesinc/partner';
import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { formatDateTime } from '../../Localization/format';
import { registerFlatCatalog, setI18nConfig } from '../../Localization/Localization';
import DocumentCaptureCard from '../DocumentCaptureCard';
import DocumentRequirementCard from '../DocumentRequirementCard';
import DocumentVersionList from '../DocumentVersionList';
import { documentVersionRows, requirementTitle } from '../viewModel';

// The photo sheet is the native picker; here it is a stand-in that records being opened and hands back the photo a
// test gives it, through the same ref and `onChange` the card uses.
const mockPicker = { shown: 0, take: null };
jest.mock('../../ImagePicker/ImagePickerAvatar', () => {
    const React = require('react');
    const Sheet = React.forwardRef(({ onChange }, ref) => {
        React.useImperativeHandle(ref, () => ({
            show: () => {
                mockPicker.shown += 1;
            },
        }));
        mockPicker.take = onChange;
        return null;
    });
    return { __esModule: true, default: Sheet };
});

// Paper animates on timers; fake ones, and unmounting after each test, keep those animations from firing after the
// environment is torn down.
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

beforeAll(() => {
    setI18nConfig();
    registerFlatCatalog({ en: EN, es: ES });
});

beforeEach(() => {
    mockPicker.shown = 0;
    mockPicker.take = null;
});

afterEach(() => {
    act(() => {
        mounted.splice(0).forEach((tree) => tree.unmount());
        jest.runOnlyPendingTimers();
    });
});

// Every string a host Text renders, in order.
const textsOf = (tree) =>
    tree.root
        .findAll((node) => node.type === 'Text' && typeof node.props.children === 'string')
        .map((node) => node.props.children);
const buttonOf = (tree, testID) =>
    tree.root.findAll((node) => node.props.testID === testID && typeof node.props.onPress === 'function')[0];
const hasTestID = (tree, testID) => tree.root.findAll((node) => node.props.testID === testID).length > 0;
const press = (tree, testID) => act(() => buttonOf(tree, testID).props.onPress());
const take = (photo) => act(() => mockPicker.take(photo));

const INSPECTION = {
    id: 'car1.vehicle_inspection',
    requirementKey: 'vehicle_inspection',
    vehicleId: 'car1',
    bucket: 'eventually_due',
    cause: 'expiring_within_notice',
    evidence: 'document',
    label: { en: 'Annual vehicle safety inspection', es: 'Inspección anual de seguridad del vehículo' },
    explanation: { en: 'The current Massachusetts safety inspection.', es: 'La inspección de seguridad vigente.' },
    documentType: 'state_safety_inspection_report',
    capture: { pages: 1, pdf: true },
    versions: [],
};
const LICENCE = {
    id: 'driver_license',
    requirementKey: 'driver_license',
    bucket: 'currently_due',
    cause: 'missing',
    evidence: 'document',
    documentType: 'driver_licence',
    capture: { pages: 2, pdf: true },
    versions: [],
};
const AT = 1793249082020;

describe('requirementTitle', () => {
    it("is the rule's own name for the market, in the reader's language", () => {
        expect(requirementTitle(INSPECTION)).toBe('Annual vehicle safety inspection');
    });

    it("is the catalogue's name when the rule has none", () => {
        expect(requirementTitle(LICENCE)).toBe(EN['partner.requirement.driver_license']);
        expect(requirementTitle({ requirementKey: 'car1.vehicle_insurance' })).toBe(
            EN['partner.requirement.vehicle_insurance']
        );
    });
});

describe('documentVersionRows', () => {
    it('titles a version by its verification, or as superseded, and says only what the version says', () => {
        const rows = documentVersionRows([
            { versionId: 'v3', verification: { status: 'pending' }, scan: { status: 'pending' }, submittedTime: AT },
            {
                versionId: 'v2',
                verification: { status: 'verified' },
                expires_at: '2026-11-23',
                scan: { status: 'clean' },
                submittedTime: AT,
            },
            {
                versionId: 'v1',
                verification: { status: 'unverified', details_code: 'document_not_readable' },
                scan: { status: 'clean' },
                supersededBy: 'v2',
                submittedTime: AT,
            },
        ]);
        const sent = formatDateTime(AT);
        expect(rows).toEqual([
            {
                key: 'v3',
                title: EN['partner.verification_status.pending'],
                description: `${sent} · ${EN['partner.scan_status.pending']}`,
            },
            {
                key: 'v2',
                title: EN['partner.verification_status.verified'],
                description: `${sent} · Expires 2026-11-23`,
            },
            {
                key: 'v1',
                title: 'Superseded',
                description: `${sent} · ${EN['partner.details_code.document_not_readable']}`,
            },
        ]);
    });

    it('has no rows without versions', () => {
        expect(documentVersionRows(undefined)).toEqual([]);
        expect(documentVersionRows([])).toEqual([]);
    });
});

describe('DocumentRequirementCard', () => {
    it("reads the rule's name, the host's subtitle and the rule's explanation, and offers nothing by itself", () => {
        const tree = render(<DocumentRequirementCard item={INSPECTION} subtitle="Black Honda Accord · 123456" />);
        expect(textsOf(tree)).toEqual([
            'Annual vehicle safety inspection',
            'Black Honda Accord · 123456',
            'The current Massachusetts safety inspection.',
        ]);
        expect(hasTestID(tree, 'document-requirement-cover')).toBe(false);
        expect(tree.root.findAll((node) => typeof node.props.onPress === 'function')).toHaveLength(0);
    });

    it('shows a photo taken, what to do next, and the actions the host gives it', () => {
        const onPress = jest.fn();
        const tree = render(
            <DocumentRequirementCard
                item={LICENCE}
                cover="file:///front.jpg"
                note="Now take a photo of the back of your licence."
                actions={[{ label: 'Cancel', onPress, testID: 'cancel' }]}
            />
        );
        expect(hasTestID(tree, 'document-requirement-cover')).toBe(true);
        expect(textsOf(tree)).toContain('Now take a photo of the back of your licence.');
        press(tree, 'cancel');
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});

describe('DocumentVersionList', () => {
    it('lists one row per version, and nothing without versions', () => {
        const versions = [{ versionId: 'v1', verification: { status: 'verified' }, submittedTime: AT }];
        const tree = render(<DocumentVersionList versions={versions} accessibilityLabel="Driver's license" />);
        expect(hasTestID(tree, 'document-versions-v1')).toBe(true);
        expect(
            hasTestID(render(<DocumentVersionList versions={[]} accessibilityLabel="x" />), 'document-versions')
        ).toBe(false);
    });
});

describe('DocumentCaptureCard', () => {
    it('takes one photo of a one-page document and hands it over at once', () => {
        const onCapture = jest.fn();
        const tree = render(<DocumentCaptureCard item={INSPECTION} onCapture={onCapture} />);
        expect(textsOf(tree)).toContain('Add');
        // Photos only (owner, 2026-11-04): no PDF, even where the server takes one.
        expect(textsOf(tree)).not.toContain('Upload a PDF');
        press(tree, 'document-requirement-add');
        expect(mockPicker.shown).toBe(1);
        take({ uri: 'file:///page.jpg' });
        expect(onCapture).toHaveBeenCalledWith([{ uri: 'file:///page.jpg' }]);
    });

    it('keeps the front of a two-sided document, shows it, then hands over the front and the back', () => {
        const onCapture = jest.fn();
        const tree = render(<DocumentCaptureCard item={LICENCE} onCapture={onCapture} />);
        expect(textsOf(tree)).toContain('Add the front');

        take({ uri: 'file:///front.jpg' });
        expect(onCapture).not.toHaveBeenCalled();
        expect(hasTestID(tree, 'document-requirement-cover')).toBe(true);
        expect(textsOf(tree)).toEqual(
            expect.arrayContaining(['Now take a photo of the back of your licence.', 'Cancel', 'Add the back'])
        );

        take({ uri: 'file:///back.jpg' });
        expect(onCapture).toHaveBeenCalledWith([{ uri: 'file:///front.jpg' }, { uri: 'file:///back.jpg' }]);
        expect(hasTestID(tree, 'document-requirement-cover')).toBe(false);
        expect(textsOf(tree)).toContain('Add the front');
    });

    it('drops the front on «Cancel»', () => {
        const onCapture = jest.fn();
        const tree = render(<DocumentCaptureCard item={LICENCE} onCapture={onCapture} />);
        take({ uri: 'file:///front.jpg' });
        press(tree, 'document-requirement-cancel');
        expect(hasTestID(tree, 'document-requirement-cover')).toBe(false);
        expect(textsOf(tree)).toContain('Add the front');
        expect(onCapture).not.toHaveBeenCalled();
    });

    it('disables sending while the host sends', () => {
        const tree = render(<DocumentCaptureCard item={INSPECTION} onCapture={jest.fn()} isDisabled />);
        expect(buttonOf(tree, 'document-requirement-add').props.disabled).toBe(true);
    });
});
