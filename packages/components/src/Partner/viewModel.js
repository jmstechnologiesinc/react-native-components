import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';
import {
    CHECKR_REPORT_ADJUDICATION,
    CHECKR_REPORT_RESULT,
    CHECKR_REPORT_STATUS,
    DETAILS_CODE,
    DISABLED_REASON,
    LABEL_GROUPS,
    PARTNERSHIP_STATUS,
    REQUIREMENT_BUCKET,
    REQUIREMENT_CAUSE,
    REQUIREMENT_KEYS,
    REVIEW_TASK_STATUS,
    STAFF_INTENT,
    VERIFICATION_STATUS,
    statusLabelKey,
} from '@jmstechnologiesinc/partner';

import { localized } from '../Localization/Localization';
import { STATUS_TONES } from '../tones';

// Canon §17.3 — THE PLACE WHERE PARTNER KEYS BECOME TEXT, as `Order/viewModel.js`
// is for the order.
//
// `@jmstechnologiesinc/partner` owns the vocabulary, the catalogue groups and
// the `partner.*` catalogue (canon §17.2 layer 3, R1, R2); this package owns
// none of them and spells none of their values (R1, pinned by
// `__tests__/noLocalRedefinition.test.js`). A label is the package's
// `statusLabelKey(group, value)` resolved through `localized`, and the host
// registers the package's `EN`/`ES` with `registerFlatCatalog`. A value the
// vocabulary or the catalogue does not carry — a newer server, or a catalogue
// not registered yet — renders as the raw value, never as the key: a screen
// showing `past_due` is legible, one showing
// `partner.requirement_bucket.past_due` is not.
//
// What IS decided here is presentation, which has one consumer and so stays in
// this package (backend answer to request #6): the tone of each status value
// and the look of each staff intent. Both tables are keyed by the package's
// constants, and `__tests__/viewModelCompleteness.test.js` walks every value
// of each coloured group and every staff intent, so a value the package adds
// fails there until it is given a tone or a presentation here.

/** The catalogue group whose vocabulary is `vocabulary`, read from the
 *  package's `LABEL_GROUPS` (never spelled here); null if the package does not
 *  label it. */
const groupOf = (vocabulary) => {
    const entry = Object.entries(LABEL_GROUPS).find(([, values]) => values === vocabulary);
    return entry ? entry[0] : null;
};

/** The `StatusChip` kinds (ARCHITECTURE §5) and the package vocabulary each
 *  one shows. The kind names are this package's API; the values are not. */
const KIND_VOCABULARY = Object.freeze({
    partnership: PARTNERSHIP_STATUS,
    verification: VERIFICATION_STATUS,
    requirement_bucket: REQUIREMENT_BUCKET,
    requirement_cause: REQUIREMENT_CAUSE,
    screening_report: CHECKR_REPORT_STATUS,
    screening_result: CHECKR_REPORT_RESULT,
    adjudication: CHECKR_REPORT_ADJUDICATION,
    task_status: REVIEW_TASK_STATUS,
});

/** Each kind -> the `LABEL_GROUPS` group it is labelled from. */
export const STATUS_KIND_GROUP = Object.freeze(
    Object.fromEntries(Object.entries(KIND_VOCABULARY).map(([kind, vocabulary]) => [kind, groupOf(vocabulary)]))
);

const GROUP = Object.freeze({
    requirement: groupOf(REQUIREMENT_KEYS),
    detailsCode: groupOf(DETAILS_CODE),
    disabledReason: groupOf(DISABLED_REASON),
    intent: groupOf(STAFF_INTENT),
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
 *
 * `requirement_cause` is a LABEL-ONLY kind: the checklist tones a requirement
 * by its bucket and shows the cause as text, so it has no row here (see
 * `LABEL_ONLY_KINDS`).
 */
export const TONE_BY_KIND = Object.freeze({
    partnership: Object.freeze({
        [PARTNERSHIP_STATUS.ACTIVE]: success,
        [PARTNERSHIP_STATUS.ONBOARDING]: info,
        [PARTNERSHIP_STATUS.DEACTIVATED]: danger,
        [PARTNERSHIP_STATUS.REJECTED]: danger,
    }),
    verification: Object.freeze({
        [VERIFICATION_STATUS.VERIFIED]: success,
        [VERIFICATION_STATUS.PENDING]: warning,
        [VERIFICATION_STATUS.UNVERIFIED]: danger,
    }),
    requirement_bucket: Object.freeze({
        [REQUIREMENT_BUCKET.CURRENTLY_DUE]: neutral,
        [REQUIREMENT_BUCKET.EVENTUALLY_DUE]: warning,
        [REQUIREMENT_BUCKET.PAST_DUE]: danger,
        [REQUIREMENT_BUCKET.PENDING_VERIFICATION]: warning,
    }),
    screening_report: Object.freeze({
        [CHECKR_REPORT_STATUS.PENDING]: warning,
        [CHECKR_REPORT_STATUS.COMPLETE]: info,
        [CHECKR_REPORT_STATUS.SUSPENDED]: warning,
        [CHECKR_REPORT_STATUS.PAUSED]: warning,
        [CHECKR_REPORT_STATUS.DISPUTE]: warning,
        [CHECKR_REPORT_STATUS.CANCELED]: neutral,
    }),
    screening_result: Object.freeze({
        [CHECKR_REPORT_RESULT.CLEAR]: success,
        [CHECKR_REPORT_RESULT.CONSIDER]: warning,
    }),
    adjudication: Object.freeze({
        [CHECKR_REPORT_ADJUDICATION.ENGAGED]: success,
        [CHECKR_REPORT_ADJUDICATION.PRE_ADVERSE_ACTION]: warning,
        [CHECKR_REPORT_ADJUDICATION.POST_ADVERSE_ACTION]: danger,
    }),
    task_status: Object.freeze({
        [REVIEW_TASK_STATUS.OPEN]: info,
        [REVIEW_TASK_STATUS.ASSIGNED]: info,
        [REVIEW_TASK_STATUS.CLOSED]: neutral,
    }),
});

/** The kinds that are labelled but never coloured (their tone is `neutral`). */
export const LABEL_ONLY_KINDS = Object.freeze(['requirement_cause']);

/** Button tone (the `DecisionDialog` `confirmTone`) and icon of each staff
 *  intent. An adverse intent is `danger` and asks for confirmation. */
export const INTENT_PRESENTATION = Object.freeze({
    [STAFF_INTENT.VERIFY]: Object.freeze({ tone: 'primary', icon: 'check-decagram-outline' }),
    [STAFF_INTENT.UNVERIFY]: Object.freeze({ tone: 'danger', icon: 'close-octagon-outline' }),
    [STAFF_INTENT.ACTIVATE]: Object.freeze({ tone: 'primary', icon: MATERIAL_ICONS.accountCheck }),
    [STAFF_INTENT.REJECT]: Object.freeze({ tone: 'danger', icon: 'account-cancel-outline' }),
    [STAFF_INTENT.ENGAGE]: Object.freeze({ tone: 'primary', icon: 'handshake-outline' }),
    [STAFF_INTENT.PRE_ADVERSE_ACTION]: Object.freeze({ tone: 'danger', icon: MATERIAL_ICONS.alert }),
    [STAFF_INTENT.DEACTIVATE]: Object.freeze({ tone: 'danger', icon: 'account-off-outline' }),
    [STAFF_INTENT.REACTIVATE]: Object.freeze({ tone: 'primary', icon: 'account-reactivate-outline' }),
});

const has = (table, key) => Object.prototype.hasOwnProperty.call(table, key);

const isAbsent = (value) => value === null || value === undefined || value === '';

/** `fallback` unless the package knows `partner.<group>.<value>` AND the
 *  registered catalogue carries it. */
const labelOf = (group, value, fallback = value) => {
    if (isAbsent(value)) return null;
    const key = typeof group === 'string' ? statusLabelKey(group, String(value)) : null;
    if (!key) return String(fallback);
    const text = localized(key);
    return text === key ? String(fallback) : text;
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
 *  `<vehicleId>.<key>` (canon §7.3) and is labelled by its `<key>`, which the
 *  package's `statusLabelKey` resolves. */
export const requirementLabel = (key) => {
    if (typeof key !== 'string' || key === '') return null;
    const member = key.includes('.') ? key.slice(key.indexOf('.') + 1) : key;
    return labelOf(GROUP.requirement, key, member);
};

/** The label of a Stripe `details_code` (canon §7.4). */
export const detailsCodeLabel = (code) => labelOf(GROUP.detailsCode, code);

/** The label of a `disabled_reason` (canon §7.2); the values are dotted, and
 *  the flat catalogue resolves them by exact match. */
export const reasonLabel = (reason) => labelOf(GROUP.disabledReason, reason);

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
        title: labelOf(GROUP.intent, intent),
        tone: presentation ? presentation.tone : 'primary',
        icon: presentation ? presentation.icon : null,
        confirm: presentation ? presentation.tone === 'danger' : true,
    };
};
