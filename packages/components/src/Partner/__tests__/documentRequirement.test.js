import React, { useState } from 'react';
import { Platform, ScrollView } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { EN, ES } from '@jmstechnologiesinc/partner';
import { Card, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { formatDateTime } from '../../Localization/format';
import { registerFlatCatalog, setI18nConfig } from '../../Localization/Localization';
import DocumentCaptureCard from '../DocumentCaptureCard';
import DocumentRequirementCard from '../DocumentRequirementCard';
import DocumentVersionList from '../DocumentVersionList';
import { documentVersionRow, documentVersionRows, requirementTitle } from '../viewModel';

// The photo sheet is the native picker; here it is a stand-in that records being opened and the capture options it was
// given, and hands back the photo a test gives it, through the same ref and `onChange` the card uses.
const mockPicker = { shown: 0, take: null, captureOptions: null };
jest.mock('../../ImagePicker/ImagePickerAvatar', () => {
    const React = require('react');
    const Sheet = React.forwardRef(({ onChange, captureOptions }, ref) => {
        React.useImperativeHandle(ref, () => ({
            show: () => {
                mockPicker.shown += 1;
            },
        }));
        mockPicker.take = onChange;
        mockPicker.captureOptions = captureOptions;
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
    mockPicker.captureOptions = null;
});

afterEach(() => {
    act(() => {
        mounted.splice(0).forEach((tree) => tree.unmount());
        jest.runOnlyPendingTimers();
    });
    jest.restoreAllMocks();
});

// Every string a host Text renders, in order.
const textsOf = (tree) =>
    tree.root
        .findAll((node) => node.type === 'Text' && typeof node.props.children === 'string')
        .map((node) => node.props.children);
const buttonOf = (tree, testID) =>
    tree.root.findAll((node) => node.props.testID === testID && typeof node.props.onPress === 'function')[0];
const hasTestID = (tree, testID) => tree.root.findAll((node) => node.props.testID === testID).length > 0;
const propsOf = (tree, testID) => tree.root.findAll((node) => node.props.testID === testID)[0].props;
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
const BOTH_SIDES = [
    { uri: 'file:///front.jpg', label: 'Front' },
    { uri: 'file:///back.jpg', label: 'Back' },
];
// The cover's height, as the first cover reports it (Card.Cover's own), and the width the covers are laid out in.
const COVER_HEIGHT = 195;
const layOut = (tree, width) =>
    act(() => {
        propsOf(tree, 'document-requirement-cover-0').onLayout({ nativeEvent: { layout: { height: COVER_HEIGHT } } });
        propsOf(tree, 'document-requirement-covers').onLayout({ nativeEvent: { layout: { width } } });
    });

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
                // The calendar day the server sent, in the app's locale, in no reader's zone.
                description: `${sent} · Expires Nov 23, 2026`,
            },
            {
                key: 'v1',
                title: 'Superseded',
                description: `${sent} · ${EN['partner.details_code.document_not_readable']}`,
            },
        ]);
    });

    it('says the scan of a version while it is not clean, by its catalogue label', () => {
        // `infected` is partner 0.2.54's (O-10); before it, the view model shows the raw value it does not know.
        const infected = EN['partner.scan_status.infected'] ?? 'infected';
        const row = documentVersionRow({
            versionId: 'v4',
            verification: { status: 'unverified' },
            scan: { status: 'infected' },
            submittedTime: AT,
        });
        expect(row.description).toBe(`${formatDateTime(AT)} · ${infected}`);
    });

    it('has no rows without versions', () => {
        expect(documentVersionRows(undefined)).toEqual([]);
        expect(documentVersionRows([])).toEqual([]);
    });

    it('is one version row for every page that lists versions', () => {
        const version = { versionId: 'v2', verification: { status: 'verified' }, expires_at: '2026-11-23' };
        expect(documentVersionRow(version)).toEqual(documentVersionRows([version])[0]);
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
        expect(hasTestID(tree, 'document-requirement-cover-0')).toBe(false);
        expect(tree.root.findAll((node) => typeof node.props.onPress === 'function')).toHaveLength(0);
    });

    it('shows a photo taken, named for a screen reader, what to do next, and the actions the host gives it', () => {
        const onPress = jest.fn();
        const tree = render(
            <DocumentRequirementCard
                item={LICENCE}
                covers={[{ uri: 'file:///front.jpg', label: 'Front' }]}
                note="Now take a photo of the back of your licence."
                actions={[{ label: 'Cancel', onPress, testID: 'cancel' }]}
            />
        );
        expect(propsOf(tree, 'document-requirement-cover-0')).toEqual(
            expect.objectContaining({ accessibilityRole: 'imagebutton', accessibilityLabel: 'Front' })
        );
        // One photo is the cover, not a carousel.
        expect(hasTestID(tree, 'document-requirement-covers')).toBe(false);
        expect(textsOf(tree)).toContain('Now take a photo of the back of your licence.');
        press(tree, 'cancel');
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('keeps a polite live region for the note, so a screen reader announces each next step', () => {
        const liveRegionOf = (tree) => tree.root.findAll((node) => node.props['aria-live'] === 'polite')[0];
        // Mounted before there is anything to say: a region that appears together with its text is not announced.
        const empty = render(<DocumentRequirementCard item={INSPECTION} />);
        expect(liveRegionOf(empty)).toBeDefined();
        expect(hasTestID(empty, 'document-requirement-note')).toBe(false);

        const tree = render(<DocumentRequirementCard item={INSPECTION} note="Now take a photo of the back." />);
        const note = liveRegionOf(tree).findAll((node) => node.props.testID === 'document-requirement-note');
        expect(note.length).toBeGreaterThan(0);
    });

    it("lets its actions wrap, keeping Card.Actions' own alignment, and shows an action in progress", () => {
        const tree = render(
            <DocumentRequirementCard
                item={INSPECTION}
                actions={[
                    { label: 'Retake', onPress: jest.fn(), mode: 'text', isDisabled: true, testID: 'retake' },
                    { label: 'Send to review', onPress: jest.fn(), isDisabled: true, loading: true, testID: 'send' },
                ]}
            />
        );
        expect(tree.root.findByType(Card.Actions).props.style).toEqual({
            flexWrap: 'wrap',
            rowGap: MD3LightTheme.spacing.x2,
        });
        expect(buttonOf(tree, 'send').props).toEqual(expect.objectContaining({ loading: true, disabled: true }));
    });

    it('shows both sides as a carousel that snaps item by item, the next one peeking (Material 3 hero)', () => {
        const { spacing } = MD3LightTheme;
        const tree = render(<DocumentRequirementCard item={LICENCE} covers={BOTH_SIDES} />);
        expect(propsOf(tree, 'document-requirement-carousel')).toEqual(
            expect.objectContaining({
                horizontal: true,
                pagingEnabled: true,
                decelerationRate: 'fast',
                showsHorizontalScrollIndicator: false,
            })
        );
        expect(propsOf(tree, 'document-requirement-cover-0').accessibilityLabel).toBe('Front');
        expect(propsOf(tree, 'document-requirement-cover-1').accessibilityLabel).toBe('Back');

        layOut(tree, 400);
        // The large item is what the width leaves after the small item that peeks (56 dp) and the gap (8 dp).
        const itemWidth = 400 - spacing.x14 - spacing.x2;
        expect(propsOf(tree, 'document-requirement-cover-0').style).toEqual({ width: itemWidth });
        expect(propsOf(tree, 'document-requirement-carousel').snapToInterval).toBe(itemWidth + spacing.x2);
        expect(propsOf(tree, 'document-requirement-carousel').contentContainerStyle).toEqual({ gap: spacing.x2 });
    });

    it('scrolls back to the item it rested on when its width changes', () => {
        const { spacing } = MD3LightTheme;
        const tree = render(<DocumentRequirementCard item={LICENCE} covers={BOTH_SIDES} />);
        layOut(tree, 400);
        // At its end the carousel rests with the back whole and the front peeking.
        const interval = 400 - spacing.x14;
        act(() =>
            propsOf(tree, 'document-requirement-carousel').onScroll({
                nativeEvent: { contentOffset: { x: 2 * interval - spacing.x2 - 400 } },
            })
        );
        const { scrollTo } = tree.root.findAllByType(ScrollView)[0].instance;
        scrollTo.mockClear();

        layOut(tree, 600);
        const wider = 600 - spacing.x14;
        expect(scrollTo).toHaveBeenCalledWith({ x: 2 * wider - spacing.x2 - 600, animated: false });
    });

    it('shows both sides whole, without a carousel, where they fit at the largest large item', () => {
        const { spacing } = MD3LightTheme;
        const tree = render(<DocumentRequirementCard item={LICENCE} covers={BOTH_SIDES} />);
        // Twice as wide as the cover is tall, each, and the gap between them.
        layOut(tree, 2 * (2 * COVER_HEIGHT) + spacing.x2);
        expect(hasTestID(tree, 'document-requirement-carousel')).toBe(false);
        expect(propsOf(tree, 'document-requirement-cover-0').style).toEqual({ width: 2 * COVER_HEIGHT });
        expect(propsOf(tree, 'document-requirement-cover-1').style).toEqual({ width: 2 * COVER_HEIGHT });
    });

    it('on the web, shows the scrollbar and makes each photo a button named by its label', () => {
        jest.replaceProperty(Platform, 'OS', 'web');
        const tree = render(<DocumentRequirementCard item={LICENCE} covers={BOTH_SIDES} />);
        expect(propsOf(tree, 'document-requirement-carousel').showsHorizontalScrollIndicator).toBe(true);
        expect(propsOf(tree, 'document-requirement-cover-1')).toEqual(
            expect.objectContaining({ role: 'button', 'aria-label': 'Back' })
        );
    });

    it('opens a photo full screen in the document viewer, on its side, before anything is sent', () => {
        const tree = render(<DocumentRequirementCard item={LICENCE} covers={BOTH_SIDES} />);
        expect(propsOf(tree, 'document-requirement-viewer').visible).toBe(false);

        press(tree, 'document-requirement-cover-1');
        expect(propsOf(tree, 'document-requirement-viewer').visible).toBe(true);
        const viewer = propsOf(tree, 'document-requirement-viewer-document');
        expect(viewer.source).toEqual({ uri: 'file:///back.jpg' });
        expect(viewer.sides.map(({ label }) => label)).toEqual(['Front', 'Back']);

        act(() => viewer.onSideChange(viewer.sides[0].value));
        expect(propsOf(tree, 'document-requirement-viewer-document').source).toEqual({ uri: 'file:///front.jpg' });

        press(tree, 'document-requirement-viewer-header-close');
        expect(propsOf(tree, 'document-requirement-viewer').visible).toBe(false);
    });

    it('opens a one-page document with no sides to choose', () => {
        const tree = render(
            <DocumentRequirementCard item={INSPECTION} covers={[{ uri: 'file:///page.jpg', label: 'Document' }]} />
        );
        press(tree, 'document-requirement-cover-0');
        const viewer = propsOf(tree, 'document-requirement-viewer-document');
        expect(viewer.source).toEqual({ uri: 'file:///page.jpg' });
        expect(viewer.sides).toBeUndefined();
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

// A host as the app is one: it owns the pages, hands them to its send, and clears them only once the send succeeded.
const host = { clear: null };
const Host = ({ item, onSend = jest.fn(), isSending = false }) => {
    const [pages, setPages] = useState([]);
    host.clear = () => setPages([]);
    return (
        <DocumentCaptureCard
            item={item}
            pages={pages}
            onPagesChange={setPages}
            onSend={() => onSend(pages)}
            isSending={isSending}
        />
    );
};
const NOT_SENT = 'These photos are not sent yet. Tap «Send to review».';
const BACK_PROMPT = 'Now take a photo of the back of the document.';
const actionKeysOf = (tree) => tree.root.findByType(Card.Actions).props.children.map((button) => button.key);

describe('DocumentCaptureCard', () => {
    it('takes one photo of a one-page document, shows it, and hands it to the host only on «Send to review»', () => {
        const onSend = jest.fn();
        const tree = render(<Host item={INSPECTION} onSend={onSend} />);
        expect(textsOf(tree)).toEqual(expect.arrayContaining(['Add', 'Send to review']));
        // Photos only (owner, 2026-11-04): no PDF, even where the server takes one.
        expect(textsOf(tree)).not.toContain('Upload a PDF');
        expect(buttonOf(tree, 'document-requirement-send').props.disabled).toBe(true);
        // A text button takes the photo; sending is the only one with a border (owner, 2026-11-04).
        expect(buttonOf(tree, 'document-requirement-add').props.mode).toBe('text');
        expect(buttonOf(tree, 'document-requirement-send').props.mode).toBe('outlined');
        press(tree, 'document-requirement-add');
        expect(mockPicker.shown).toBe(1);

        take({ uri: 'file:///page.jpg' });
        expect(onSend).not.toHaveBeenCalled();
        expect(propsOf(tree, 'document-requirement-cover-0').accessibilityLabel).toBe('Document');
        // The way to take a photo stays, and now says it starts again; the note says nothing is sent yet.
        expect(textsOf(tree)).toEqual(expect.arrayContaining(['Retake', 'Send to review', NOT_SENT]));
        expect(buttonOf(tree, 'document-requirement-send').props.disabled).toBe(false);

        press(tree, 'document-requirement-send');
        expect(onSend).toHaveBeenCalledWith([{ uri: 'file:///page.jpg' }]);
        // The card never clears the pages itself: a send that fails keeps them.
        expect(hasTestID(tree, 'document-requirement-cover-0')).toBe(true);
        act(() => host.clear());
        expect(hasTestID(tree, 'document-requirement-cover-0')).toBe(false);
        expect(buttonOf(tree, 'document-requirement-send').props.disabled).toBe(true);
    });

    it('keeps the front of a two-sided document, then the back, and hands over both on «Send to review»', () => {
        const onSend = jest.fn();
        const tree = render(<Host item={LICENCE} onSend={onSend} />);
        expect(textsOf(tree)).toContain('Add the front');

        take({ uri: 'file:///front.jpg' });
        expect(hasTestID(tree, 'document-requirement-cover-0')).toBe(true);
        expect(textsOf(tree)).toEqual(expect.arrayContaining([BACK_PROMPT, 'Add the back']));
        expect(buttonOf(tree, 'document-requirement-send').props.disabled).toBe(true);

        take({ uri: 'file:///back.jpg' });
        expect(onSend).not.toHaveBeenCalled();
        expect(propsOf(tree, 'document-requirement-cover-0').accessibilityLabel).toBe('Front');
        expect(propsOf(tree, 'document-requirement-cover-1').accessibilityLabel).toBe('Back');
        expect(textsOf(tree)).not.toContain(BACK_PROMPT);
        expect(textsOf(tree)).toEqual(expect.arrayContaining([NOT_SENT, 'Retake']));
        expect(buttonOf(tree, 'document-requirement-send').props.disabled).toBe(false);

        press(tree, 'document-requirement-send');
        expect(onSend).toHaveBeenCalledWith([{ uri: 'file:///front.jpg' }, { uri: 'file:///back.jpg' }]);
        act(() => host.clear());
        expect(textsOf(tree)).toContain('Add the front');
    });

    it('replaces what was taken with a photo taken once every page is there', () => {
        const onSend = jest.fn();
        const single = render(<Host item={INSPECTION} onSend={onSend} />);
        take({ uri: 'file:///wrong.jpg' });
        take({ uri: 'file:///right.jpg' });
        press(single, 'document-requirement-send');
        expect(onSend).toHaveBeenCalledWith([{ uri: 'file:///right.jpg' }]);

        // The sheet stand-in now hands photos to this card, the last one rendered.
        const licence = render(<Host item={LICENCE} />);
        take({ uri: 'file:///front.jpg' });
        take({ uri: 'file:///back.jpg' });
        expect(textsOf(licence)).toContain('Retake');
        take({ uri: 'file:///front-again.jpg' });
        expect(hasTestID(licence, 'document-requirement-cover-1')).toBe(false);
        expect(textsOf(licence)).toContain('Add the back');
        expect(buttonOf(licence, 'document-requirement-send').props.disabled).toBe(true);
    });

    it('while the host sends, shows the progress on «Send to review», disables every action and keeps the photos', () => {
        const tree = render(
            <DocumentCaptureCard
                item={INSPECTION}
                pages={[{ uri: 'file:///page.jpg' }]}
                onPagesChange={jest.fn()}
                onSend={jest.fn()}
                isSending
            />
        );
        expect(buttonOf(tree, 'document-requirement-add').props.disabled).toBe(true);
        expect(buttonOf(tree, 'document-requirement-send').props).toEqual(
            expect.objectContaining({ disabled: true, loading: true })
        );
        expect(hasTestID(tree, 'document-requirement-cover-0')).toBe(true);
        expect(textsOf(tree)).not.toContain(NOT_SENT);
    });

    it('keys its buttons by position, so a label that changes does not remount the button', () => {
        const tree = render(<Host item={LICENCE} />);
        const keys = actionKeysOf(tree);
        take({ uri: 'file:///front.jpg' });
        expect(actionKeysOf(tree)).toEqual(keys);
    });

    it('takes every document at the resolution its standards need, at full quality, as JPEG', () => {
        render(<Host item={INSPECTION} />);
        expect(mockPicker.captureOptions).toEqual({
            maxWidth: 5120,
            maxHeight: 5120,
            quality: 1,
            assetRepresentationMode: 'compatible',
            conversionQuality: 1,
        });
    });
});
