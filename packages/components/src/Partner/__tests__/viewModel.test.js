// Canon §17.3 — the partner view model: keys in, text out, and the raw value
// when the catalogue has nothing to say. The catalogue itself belongs to
// `@jmstechnologiesinc/partner` (R2), so this suite registers a small one the
// way a host does, and checks what happens with and without it.
jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'es', isRTL: false })),
}));

import { setI18nConfig, registerFlatCatalog } from '../../Localization/Localization';
import {
    STATUS_KIND_GROUP,
    detailsCodeLabel,
    intentAction,
    reasonLabel,
    requirementLabel,
    statusLabel,
    statusTone,
} from '../viewModel';

beforeAll(() => {
    setI18nConfig();
    registerFlatCatalog({
        en: {
            'partner.status.active': 'Active',
            'partner.checkr_report_result.clear': 'Clear',
            'partner.requirement.vehicle_insurance': 'Vehicle insurance',
            'partner.details_code.document_expired': 'The document has expired',
            'partner.disabled_reason.rejected.fraud': 'Fraud',
            'partner.intent.verify': 'Verify',
        },
        es: {
            'partner.status.active': 'Activo',
            'partner.checkr_report_result.clear': 'Sin hallazgos',
            'partner.requirement.vehicle_insurance': 'Seguro del vehículo',
            'partner.details_code.document_expired': 'El documento está vencido',
            'partner.disabled_reason.rejected.fraud': 'Fraude',
            'partner.intent.verify': 'Verificar',
        },
    });
});

describe('statusLabel — the key is partner.<group>.<value>', () => {
    it.each([
        ['partnership', 'active', 'Activo'],
        ['screening_result', 'clear', 'Sin hallazgos'],
    ])('%s / %s -> %s', (kind, value, label) => {
        expect(statusLabel(kind, value)).toBe(label);
    });

    it('routes every StatusChip kind to a catalogue group', () => {
        expect(Object.keys(STATUS_KIND_GROUP).sort()).toEqual(
            [
                'adjudication',
                'partnership',
                'requirement_bucket',
                'requirement_cause',
                'screening_report',
                'screening_result',
                'task_status',
                'verification',
            ].sort()
        );
    });

    it('degrades to the raw value, never to the key, when the catalogue lacks it', () => {
        expect(statusLabel('partnership', 'waitlisted')).toBe('waitlisted');
        expect(statusLabel('some_future_kind', 'x')).toBe('x');
    });

    it('answers null for an absent value', () => {
        expect(statusLabel('partnership', null)).toBeNull();
        expect(statusLabel('partnership', undefined)).toBeNull();
        expect(statusLabel('partnership', '')).toBeNull();
    });
});

describe('statusTone — the documented mapping', () => {
    it.each([
        ['partnership', 'active', 'success'],
        ['partnership', 'onboarding', 'info'],
        ['partnership', 'deactivated', 'danger'],
        ['partnership', 'rejected', 'danger'],
        ['verification', 'verified', 'success'],
        ['verification', 'pending', 'warning'],
        ['verification', 'unverified', 'danger'],
        ['requirement_bucket', 'currently_due', 'neutral'],
        ['requirement_bucket', 'eventually_due', 'warning'],
        ['requirement_bucket', 'past_due', 'danger'],
        ['requirement_bucket', 'pending_verification', 'warning'],
        ['screening_report', 'pending', 'warning'],
        ['screening_report', 'complete', 'info'],
        ['screening_report', 'canceled', 'neutral'],
        ['screening_result', 'clear', 'success'],
        ['screening_result', 'consider', 'warning'],
        ['adjudication', 'engaged', 'success'],
        ['adjudication', 'pre_adverse_action', 'warning'],
        ['adjudication', 'post_adverse_action', 'danger'],
        ['task_status', 'open', 'info'],
        ['task_status', 'closed', 'neutral'],
    ])('%s / %s -> %s', (kind, value, tone) => {
        expect(statusTone(kind, value)).toBe(tone);
    });

    it.each([
        ['partnership', 'waitlisted'],
        ['unknown_kind', 'active'],
        ['partnership', undefined],
        ['partnership', 'toString'],
    ])('%s / %s is neutral', (kind, value) => {
        expect(statusTone(kind, value)).toBe('neutral');
    });
});

describe('requirementLabel, detailsCodeLabel, reasonLabel', () => {
    it.each([
        ['vehicle_insurance', 'Seguro del vehículo'],
        // A vehicle requirement is written `<vehicleId>.<key>` (canon §7.3).
        ['veh_123.vehicle_insurance', 'Seguro del vehículo'],
        ['tos_acceptance', 'tos_acceptance'],
    ])('requirement %s -> %s', (key, label) => {
        expect(requirementLabel(key)).toBe(label);
    });

    it('labels a details_code and a dotted disabled_reason', () => {
        expect(detailsCodeLabel('document_expired')).toBe('El documento está vencido');
        expect(detailsCodeLabel('document_corrupt')).toBe('document_corrupt');
        expect(reasonLabel('rejected.fraud')).toBe('Fraude');
        expect(reasonLabel('requirements.past_due')).toBe('requirements.past_due');
    });

    it('answers null for nothing', () => {
        expect(requirementLabel(undefined)).toBeNull();
        expect(detailsCodeLabel(null)).toBeNull();
        expect(reasonLabel(undefined)).toBeNull();
    });
});

describe('intentAction — what a staff button needs, never whether it exists', () => {
    it.each([
        ['verify', 'primary', false],
        ['unverify', 'danger', true],
        ['activate', 'primary', false],
        ['reject', 'danger', true],
        ['engage', 'primary', false],
        ['pre_adverse_action', 'danger', true],
        ['deactivate', 'danger', true],
        ['reactivate', 'primary', false],
    ])('%s -> %s, confirm %s', (intent, tone, confirm) => {
        const action = intentAction(intent);
        expect(action).toMatchObject({ intent, tone, confirm });
        expect(action.icon).toEqual(expect.any(String));
        expect(action.title).toBeTruthy();
    });

    it('titles through the catalogue', () => {
        expect(intentAction('verify').title).toBe('Verificar');
    });

    it('keeps an unknown intent, without an icon, and asks for confirmation', () => {
        expect(intentAction('escalate')).toEqual({
            intent: 'escalate',
            title: 'escalate',
            tone: 'primary',
            icon: null,
            confirm: true,
        });
    });
});
