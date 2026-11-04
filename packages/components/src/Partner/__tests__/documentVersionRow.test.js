// A document version's list row and the labels a reviewer reads: pure, with the package's catalogue registered as a
// host does (no native module, so this suite runs on its own).
jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import { EN, ES } from '@jmstechnologiesinc/partner';

import { formatDateTime } from '../../Localization/format';
import { registerFlatCatalog, setI18nConfig } from '../../Localization/Localization';
import {
    detailsCodeLabel,
    documentVersionRow,
    documentVersionRows,
    staffDetailsCodeLabel,
    staffScanLabel,
} from '../viewModel';

const AT = 1793249082020;

beforeAll(() => {
    setI18nConfig();
    registerFlatCatalog({ en: EN, es: ES });
});

describe('documentVersionRows', () => {
    it('titles a version by when it was sent, and opens its description with its state, in the cause\'s words', () => {
        const rows = documentVersionRows([
            {
                versionId: 'v3',
                cause: 'pending_review',
                verification: { status: 'pending' },
                scan: { status: 'pending' },
                submittedTime: AT,
            },
            {
                versionId: 'v2',
                cause: 'expiring_within_notice',
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
                title: sent,
                description: `${EN['partner.requirement_cause.pending_review']} · ${EN['partner.scan_status.pending']}`,
            },
            {
                key: 'v2',
                title: sent,
                // The calendar day the server sent, in the app's locale, in no reader's zone.
                description: `${EN['partner.requirement_cause.expiring_within_notice']} · Expires Nov 23, 2026`,
            },
            {
                key: 'v1',
                title: sent,
                description: `Superseded · ${EN['partner.details_code.document_not_readable']}`,
            },
        ]);
    });

    it('never names a version by its verification: that is the reviewer\'s word', () => {
        const row = documentVersionRow({ versionId: 'v2', verification: { status: 'verified' }, submittedTime: AT });
        expect(row).toEqual({ key: 'v2', title: formatDateTime(AT), description: '' });
    });

    it('says the scan of a version while it is not clean, by its catalogue label', () => {
        const row = documentVersionRow({
            versionId: 'v4',
            verification: { status: 'pending' },
            scan: { status: 'infected' },
            submittedTime: AT,
        });
        expect(row.description).toBe(EN['partner.scan_status.infected']);
    });

    it('has no rows without versions', () => {
        expect(documentVersionRows(undefined)).toEqual([]);
        expect(documentVersionRows([])).toEqual([]);
    });

    it('is one version row for every page that lists versions', () => {
        const version = { versionId: 'v2', cause: 'satisfied', expires_at: '2026-11-23' };
        expect(documentVersionRow(version)).toEqual(documentVersionRows([version])[0]);
    });
});

describe('staff labels (owner, 2026-11-04)', () => {
    it('a reviewer reads a code and a scan in the staff\'s words, the partner keeps hers', () => {
        expect(staffDetailsCodeLabel('document_failed_copy')).toBe(EN['partner.details_code_staff.document_failed_copy']);
        expect(detailsCodeLabel('document_failed_copy')).toBe(EN['partner.details_code.document_failed_copy']);
        expect(staffScanLabel('infected')).toBe(EN['partner.scan_status_staff.infected']);
    });
});
