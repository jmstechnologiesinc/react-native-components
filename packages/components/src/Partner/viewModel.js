import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

import { localized } from '../Localization/Localization';
import { STATUS_TONES } from '../tones';

// Canon §17.3 — THE PLACE WHERE PARTNER KEYS BECOME TEXT, as `Order/viewModel.js`
// is for the order.
//
// `@jmstechnologiesinc/partner` owns the vocabulary and the `partner.*`
// catalogue (canon R1, R2); this package owns neither. So nothing here lists
// the values of a group: a label is the key `partner.<group>.<value>` resolved
// through `localized`, and the host registers the catalogue with
// `registerFlatCatalog`. A value the catalogue does not carry — a new member,
// or a catalogue not registered yet — renders as the raw value, never as the
// key: a screen showing `past_due` is legible, one showing
// `partner.requirement_bucket.past_due` is not.
//
// The TONES below do name values, because a tone is a presentation decision
// this package makes. Anything not in the table is `neutral`.

const CATALOG_PREFIX = 'partner';

/** The `StatusChip` kinds (ARCHITECTURE §5) and the catalogue group each one
 *  is labelled from. */
export const STATUS_KIND_GROUP = Object.freeze({
    partnership: 'status',
    verification: 'verification_status',
    requirement_bucket: 'requirement_bucket',
    screening_report: 'checkr_report_status',
    screening_result: 'checkr_report_result',
    adjudication: 'checkr_report_adjudication',
    task_status: 'review_task_status',
});

const { success, warning, danger, neutral, info } = STATUS_TONES;

/**
 * The tone of each value, by kind:
 * - success: verified, active, clear, engaged — the partner may proceed;
 * - warning: pending, pending_verification, eventually_due, consider, pre_adverse_action and the in-flight
 *   report states — someone has to look;
 * - danger: unverified, rejected, deactivated, past_due, post_adverse_action — something is blocked;
 * - info: onboarding, an open or assigned task, a completed report (its result carries the outcome);
 * - neutral: currently_due, a closed task, a canceled report, and anything unknown.
 */
const TONE_BY_KIND = Object.freeze({
    partnership: { active: success, onboarding: info, deactivated: danger, rejected: danger },
    verification: { verified: success, pending: warning, unverified: danger },
    requirement_bucket: {
        currently_due: neutral,
        eventually_due: warning,
        past_due: danger,
        pending_verification: warning,
    },
    screening_report: {
        pending: warning,
        complete: info,
        suspended: warning,
        paused: warning,
        dispute: warning,
        canceled: neutral,
    },
    screening_result: { clear: success, consider: warning },
    adjudication: { engaged: success, pre_adverse_action: warning, post_adverse_action: danger },
    task_status: { open: info, assigned: info, closed: neutral },
});

/** Button tone (the `DecisionDialog` `confirmTone`) and icon of each staff
 *  intent. An adverse intent is `danger` and asks for confirmation. */
const INTENT_PRESENTATION = Object.freeze({
    verify: { tone: 'primary', icon: 'check-decagram-outline' },
    unverify: { tone: 'danger', icon: 'close-octagon-outline' },
    activate: { tone: 'primary', icon: MATERIAL_ICONS.accountCheck },
    reject: { tone: 'danger', icon: 'account-cancel-outline' },
    engage: { tone: 'primary', icon: 'handshake-outline' },
    pre_adverse_action: { tone: 'danger', icon: MATERIAL_ICONS.alert },
    deactivate: { tone: 'danger', icon: 'account-off-outline' },
    reactivate: { tone: 'primary', icon: 'account-reactivate-outline' },
});

const has = (table, key) => Object.prototype.hasOwnProperty.call(table, key);

const labelOf = (group, value) => {
    if (value === null || value === undefined || value === '') return null;
    const key = `${CATALOG_PREFIX}.${group}.${value}`;
    const text = localized(key);
    return text === key ? String(value) : text;
};

/** The label of a status value of a `StatusChip` kind. An unknown kind is
 *  treated as a catalogue group of its own name. */
export const statusLabel = (kind, value) =>
    labelOf(has(STATUS_KIND_GROUP, kind) ? STATUS_KIND_GROUP[kind] : kind, value);

/** `success | warning | danger | neutral | info` — see the table above. */
export const statusTone = (kind, value) => {
    const tones = has(TONE_BY_KIND, kind) ? TONE_BY_KIND[kind] : null;
    return tones && has(tones, value) ? tones[value] : neutral;
};

/** The label of a requirement key. A vehicle requirement is written
 *  `<vehicleId>.<key>` (canon §7.3) and is labelled by its `<key>`. */
export const requirementLabel = (key) => {
    if (typeof key !== 'string' || key === '') return null;
    const member = key.includes('.') ? key.slice(key.indexOf('.') + 1) : key;
    return labelOf('requirement', member);
};

/** The label of a Stripe `details_code` (canon §7.4). */
export const detailsCodeLabel = (code) => labelOf('details_code', code);

/** The label of a `disabled_reason` (canon §7.2); the values are dotted, and
 *  the flat catalogue resolves them by exact match. */
export const reasonLabel = (reason) => labelOf('disabled_reason', reason);

/**
 * A staff intent from `presentation.allowedIntents.staff` -> what its button
 * needs: `{ intent, title, tone: 'primary' | 'danger', icon, confirm }`. The
 * server decides WHICH intents exist (K-32); this only decides how they look.
 * An intent this table does not know keeps its label, has no icon and asks
 * for confirmation, the cautious default for an action nobody described.
 */
export const intentAction = (intent) => {
    const presentation = has(INTENT_PRESENTATION, intent) ? INTENT_PRESENTATION[intent] : null;
    return {
        intent,
        title: labelOf('intent', intent),
        tone: presentation ? presentation.tone : 'primary',
        icon: presentation ? presentation.icon : null,
        confirm: presentation ? presentation.tone === 'danger' : true,
    };
};
