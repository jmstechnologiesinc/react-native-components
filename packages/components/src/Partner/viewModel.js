import { interpunct, MATERIAL_ICONS } from '@jmstechnologiesinc/commons';
import {
    CHECKR_REPORT_ADJUDICATION,
    CHECKR_REPORT_RESULT,
    CHECKR_REPORT_STATUS,
    CLAUSE_VALUE,
    CONSENT_TYPE,
    DETAILS_CODE,
    DISABLED_REASON,
    ENTITY_TYPE,
    FIELD_ERROR_CODE,
    INTEGRATION_PROVIDER,
    LABEL_GROUPS,
    LOCALES,
    PARTNER_FACT,
    PARTNERSHIP_STATUS,
    REFUSAL_REASON,
    REQUIREMENT_BUCKET,
    REQUIREMENT_CAUSE,
    REQUIREMENT_EVIDENCE,
    REQUIREMENT_KEYS,
    REVIEW_QUEUE,
    REVIEW_TASK_STATUS,
    RULE_CLAUSE,
    RULE_ERROR_CODE,
    RULE_REFERENCE_SUBJECT,
    SCAN_STATUS,
    SCREENING_PACKAGE,
    STAFF_INTENT,
    VERIFICATION_STATUS,
    statusLabelKey,
} from '@jmstechnologiesinc/partner';

import { formatDateTime } from '../Localization/format';
import { currentLocale, localized } from '../Localization/Localization';
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

/** The kinds this view model labels (the `StatusChip` kinds of ARCHITECTURE
 *  §5, and the label-only kinds below) and the package vocabulary each one
 *  shows. The kind names are this package's API; the values are not. */
const KIND_VOCABULARY = Object.freeze({
    partnership: PARTNERSHIP_STATUS,
    verification: VERIFICATION_STATUS,
    requirement_bucket: REQUIREMENT_BUCKET,
    requirement_cause: REQUIREMENT_CAUSE,
    screening_report: CHECKR_REPORT_STATUS,
    screening_result: CHECKR_REPORT_RESULT,
    adjudication: CHECKR_REPORT_ADJUDICATION,
    task_status: REVIEW_TASK_STATUS,
    // Partner 0.1.1: the §7.8 facts (request #14) title a history entry, and
    // the §8.1 field-error codes (request #20) explain a refused field.
    fact: PARTNER_FACT,
    field_error: FIELD_ERROR_CODE,
    rule_error: RULE_ERROR_CODE,
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
    refusal: groupOf(REFUSAL_REASON),
    scan: groupOf(SCAN_STATUS),
});

// A vocabulary labelled twice, once per audience: the partner's group is the one `groupOf` finds, these the staff's.
const STAFF_GROUP = Object.freeze({
    detailsCode: 'details_code_staff',
    scan: 'scan_status_staff',
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
 * `requirement_cause`, `fact`, `field_error` and `rule_error` are LABEL-ONLY
 * kinds, so they have no row here (see `LABEL_ONLY_KINDS`): the checklist
 * tones a requirement by its bucket and shows the cause as text; a history
 * entry is titled by its fact and toned by its host (the fact alone does not
 * say whether it went well for the partner); an error is an error, already
 * painted in the error colour where it is shown.
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
export const LABEL_ONLY_KINDS = Object.freeze(['requirement_cause', 'fact', 'field_error', 'rule_error']);

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
    // Screening (§9.8.3): the reviewer records that the adverse-action notice reached the partner.
    [STAFF_INTENT.RECORD_NOTICE_DELIVERY]: Object.freeze({ tone: 'primary', icon: 'email-check-outline' }),
    // #53: an active driver's trip class; #56: the driver's registration sent to Fleet again.
    [STAFF_INTENT.SET_TRIP_CLASS]: Object.freeze({ tone: 'primary', icon: 'swap-horizontal' }),
    [STAFF_INTENT.SYNC_FLEET_REGISTRATION]: Object.freeze({ tone: 'primary', icon: 'sync' }),
    // C-b (#86): the reviewer links a driver to a store's own deliveries, or ends the link — the driver stops
    // receiving that store's orders, so ending it is adverse and asks for confirmation.
    [STAFF_INTENT.LINK_MERCHANT_DRIVER]: Object.freeze({ tone: 'primary', icon: 'store-plus-outline' }),
    [STAFF_INTENT.UNLINK_MERCHANT_DRIVER]: Object.freeze({ tone: 'danger', icon: 'store-remove-outline' }),
    // #99 (J-1): staff keep the license date the driver declared when the MVR does not confirm it.
    [STAFF_INTENT.KEEP_DECLARED_LICENSE_DATE]: Object.freeze({ tone: 'primary', icon: 'card-account-details-outline' }),
    // #101 (J-6): staff ratify the chain the tree extended under the partner, or keep hers; neither takes work
    // from her, so neither asks for confirmation.
    [STAFF_INTENT.RATIFY_JURISDICTION]: Object.freeze({ tone: 'primary', icon: 'map-marker-check-outline' }),
    [STAFF_INTENT.KEEP_JURISDICTION]: Object.freeze({ tone: 'primary', icon: 'map-marker-outline' }),
    // #115 (D1): staff assign a chain to a partner the tree did not place; it takes no work from her either.
    [STAFF_INTENT.ASSIGN_JURISDICTION]: Object.freeze({ tone: 'primary', icon: 'map-marker-plus-outline' }),
});

const has = (table, key) => Object.prototype.hasOwnProperty.call(table, key);

const isAbsent = (value) => value === null || value === undefined || value === '';

/** The registered catalogue's text of `partner.<group>.<value>`, or null when
 *  the package does not know the value or the catalogue lacks the key. */
const catalogText = (group, value) => {
    const key = typeof group === 'string' ? statusLabelKey(group, String(value)) : null;
    if (!key) return null;
    const text = localized(key);
    return text === key ? null : text;
};

/** `fallback` unless the package knows `partner.<group>.<value>` AND the
 *  registered catalogue carries it. */
const labelOf = (group, value, fallback = value) => {
    if (isAbsent(value)) return null;
    const text = catalogText(group, value);
    return text === null ? String(fallback) : text;
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

/** The label of a Stripe `details_code` (canon §7.4), in the words the partner reads. */
export const detailsCodeLabel = (code) => labelOf(GROUP.detailsCode, code);

/** The same code in the words a reviewer reads (owner, 2026-11-04: each audience its own text). */
export const staffDetailsCodeLabel = (code) => labelOf(STAFF_GROUP.detailsCode, code);

/** A version's scan in the words a reviewer reads. */
export const staffScanLabel = (scan) => labelOf(STAFF_GROUP.scan, scan);

/** The label of a `disabled_reason` (canon §7.2); the values are dotted, and
 *  the flat catalogue resolves them by exact match. */
export const reasonLabel = (reason) => labelOf(GROUP.disabledReason, reason);

/** The title of a §7.8 fact (`case.timeline[].event`, request #14). */
export const factLabel = (fact) => statusLabel('fact', fact);

/**
 * The label of the `code` of a §8.1 field error `{field, code}` (requests #20
 * and #24): a `FIELD_ERROR_CODE`, else a `RULE_ERROR_CODE`, else the
 * `REFUSAL_REASON` the error explains, else the raw code. A ZEN diagnostic
 * (`zen.<code>`) is ZEN's vocabulary, not the package's: it has no catalogue
 * key and comes back raw, for the host to word generically.
 */
export const fieldErrorLabel = (code) => {
    if (isAbsent(code)) return null;
    const groups = [STATUS_KIND_GROUP.field_error, STATUS_KIND_GROUP.rule_error, GROUP.refusal];
    for (const group of groups) {
        const text = catalogText(group, code);
        if (text !== null) return text;
    }
    return String(code);
};

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

/** How a clause's value is read (this package's own words, never on the wire). */
export const CLAUSE_VALUE_KIND = Object.freeze({
    RULE_TEXT: 'ruleText',
    LABEL: 'label',
    HOURS: 'hours',
    DAYS: 'days',
    MONTHS: 'months',
    YES_NO: 'yesNo',
    LAYERS: 'layers',
    LEGAL_BASIS: 'legalBasis',
    MARKET_REFERENCE: 'marketReference',
});

/**
 * Request #105: each clause of a requirement's composed rule (the package's `requirementRule`), in the order a
 * reader meets them — what it is, how it is met and reviewed, its life over time, the background check, the
 * consent, who asks it, and why. `valueOf` reads the clause from the rule; `kind` how its value reads; `group` the
 * catalogue group of a vocabulary value. Presentation, one consumer (request #6): the clauses are the package's,
 * and viewModelCompleteness fails on one it adds until it is placed here.
 */
export const RULE_CLAUSE_PRESENTATION = Object.freeze([
    { clause: RULE_CLAUSE.LABEL, kind: CLAUSE_VALUE_KIND.RULE_TEXT, valueOf: (rule) => rule.label },
    { clause: RULE_CLAUSE.EXPLANATION, kind: CLAUSE_VALUE_KIND.RULE_TEXT, valueOf: (rule) => rule.explanation },
    {
        clause: RULE_CLAUSE.PARTNER_EXPLANATION,
        kind: CLAUSE_VALUE_KIND.RULE_TEXT,
        valueOf: (rule) => rule.partnerExplanation,
    },
    {
        clause: RULE_CLAUSE.EVIDENCE,
        kind: CLAUSE_VALUE_KIND.LABEL,
        group: groupOf(REQUIREMENT_EVIDENCE),
        valueOf: (rule) => rule.evidence,
    },
    {
        clause: RULE_CLAUSE.SCOPE,
        kind: CLAUSE_VALUE_KIND.LABEL,
        group: groupOf(ENTITY_TYPE),
        valueOf: (rule) => rule.scope,
    },
    {
        clause: RULE_CLAUSE.REVIEW_QUEUE,
        kind: CLAUSE_VALUE_KIND.LABEL,
        group: groupOf(REVIEW_QUEUE),
        valueOf: (rule) => rule.reviewQueue,
    },
    { clause: RULE_CLAUSE.REVIEW_SLA_HOURS, kind: CLAUSE_VALUE_KIND.HOURS, valueOf: (rule) => rule.reviewSlaHours },
    {
        clause: RULE_CLAUSE.ONBOARDING_WINDOW_DAYS,
        kind: CLAUSE_VALUE_KIND.DAYS,
        valueOf: (rule) => rule.onboardingWindowDays,
    },
    {
        clause: RULE_CLAUSE.EXPIRY_NOTICE_DAYS,
        kind: CLAUSE_VALUE_KIND.DAYS,
        valueOf: (rule) => rule.expiry?.noticeDays,
    },
    { clause: RULE_CLAUSE.EXPIRY_GRACE_DAYS, kind: CLAUSE_VALUE_KIND.DAYS, valueOf: (rule) => rule.expiry?.graceDays },
    {
        clause: RULE_CLAUSE.RECHECK_EVERY_MONTHS,
        kind: CLAUSE_VALUE_KIND.MONTHS,
        valueOf: (rule) => rule.recheckEveryMonths,
    },
    {
        clause: RULE_CLAUSE.SCREENING_PACKAGE,
        kind: CLAUSE_VALUE_KIND.LABEL,
        group: groupOf(SCREENING_PACKAGE),
        valueOf: (rule) => rule.screening?.package,
    },
    {
        clause: RULE_CLAUSE.SCREENING_CONTINUOUS,
        kind: CLAUSE_VALUE_KIND.YES_NO,
        valueOf: (rule) => rule.screening?.continuous,
    },
    {
        clause: RULE_CLAUSE.SCREENING_PROVIDER,
        kind: CLAUSE_VALUE_KIND.LABEL,
        group: groupOf(INTEGRATION_PROVIDER),
        valueOf: (rule) => rule.screening?.provider,
    },
    {
        clause: RULE_CLAUSE.CONSENT_TYPE,
        kind: CLAUSE_VALUE_KIND.LABEL,
        group: groupOf(CONSENT_TYPE),
        valueOf: (rule) => rule.consent?.type,
    },
    {
        clause: RULE_CLAUSE.CONSENT_TEXT_APPROVED,
        kind: CLAUSE_VALUE_KIND.YES_NO,
        valueOf: (rule) => rule.consent?.textApproved,
    },
    { clause: RULE_CLAUSE.VIN_REQUIRED, kind: CLAUSE_VALUE_KIND.YES_NO, valueOf: (rule) => rule.vinRequired },
    { clause: RULE_CLAUSE.LAYERS, kind: CLAUSE_VALUE_KIND.LAYERS, valueOf: (rule) => rule.layers },
    { clause: RULE_CLAUSE.LEGAL_BASIS, kind: CLAUSE_VALUE_KIND.LEGAL_BASIS, valueOf: (rule) => rule.legalBasis },
    {
        clause: RULE_CLAUSE.REFERENCES,
        kind: CLAUSE_VALUE_KIND.MARKET_REFERENCE,
        valueOf: (rule) => rule.references,
    },
].map(Object.freeze));

const CLAUSE = groupOf(RULE_CLAUSE);
const CLAUSE_WORD = groupOf(CLAUSE_VALUE);
const REFERENCE_SUBJECT = groupOf(RULE_REFERENCE_SUBJECT);
// The jurisdictions that asked a requirement, general → specific (the order the server composes them in).
const LAYER_SEPARATOR = ' › ';
const PART_SEPARATOR = ' · ';
const COUNT_WORD = Object.freeze({
    [CLAUSE_VALUE_KIND.HOURS]: CLAUSE_VALUE.HOURS,
    [CLAUSE_VALUE_KIND.DAYS]: CLAUSE_VALUE.DAYS,
    [CLAUSE_VALUE_KIND.MONTHS]: CLAUSE_VALUE.MONTHS,
});

/** A rule's own text (`{en, es}`, written in the rules editor) in the reader's language, else the package's first. */
export const ruleText = (text) => (text ? text[currentLocale().split('-')[0]] ?? text[LOCALES[0]] : null);

/**
 * Contract request #117: a requirement's name — the composed rule's own for the partner's market (`label`, #97) when
 * it has one, else the catalogue's — so the hub, the lists and the document screen name one requirement one way.
 */
export const requirementTitle = (item) => ruleText(item?.label) ?? requirementLabel(item?.requirementKey);

// `expires_at` is a calendar day (`YYYY-MM-DD`), which `Date` reads as that day at 00:00 UTC: formatted in UTC it is
// the same day for every reader, where the reader's zone would move it to the day before west of Greenwich.
const CALENDAR_DAY = Object.freeze({ dateStyle: 'medium', timeZone: 'UTC' });

/**
 * One document version as the server sends it, as a list row `{ key, title, description }`, in the shape of a
 * requirement's row (owner, 2026-11-04): the title names it, by when it was sent (in the app's locale), and the
 * description opens with its state, in the words of a requirement's cause — «Superseded» once a newer one replaced it,
 * else the `cause` the server sends with it. Then its scan while it is not clean (being scanned, or quarantined), why it
 * was not accepted and until when it counts (that day, in the app's locale) — each only when the version says it.
 */
export const documentVersionRow = (version) => {
    const scan = version.scan?.status;
    return {
        key: version.versionId,
        title: formatDateTime(version.submittedTime),
        description: interpunct([
            version.supersededBy ? localized('documentSuperseded') : statusLabel('requirement_cause', version.cause),
            scan && scan !== SCAN_STATUS.CLEAN ? labelOf(GROUP.scan, scan) : null,
            detailsCodeLabel(version.verification?.details_code),
            version.expires_at
                ? localized('documentExpiresOn', { date: formatDateTime(version.expires_at, CALENDAR_DAY) })
                : null,
        ]),
    };
};

/** Contract request #117: a document requirement's versions (`checklistItem.versions`, newest first) as those rows. */
export const documentVersionRows = (versions) => (Array.isArray(versions) ? versions : []).map(documentVersionRow);

/** «24 h», «30 días»: the catalogue's word for the count, or the bare count while no catalogue carries it. */
const countText = (kind, count) => {
    const key = statusLabelKey(CLAUSE_WORD, COUNT_WORD[kind]);
    const text = localized(key, { count });
    return text === key ? String(count) : text;
};

/** One clause's rows: one for a value, one per entry of a list (a norm, a market practice), none when absent. */
const clauseRows = ({ clause, kind, group, valueOf }, rule, layerName) => {
    const value = valueOf(rule);
    if (isAbsent(value) || (Array.isArray(value) && value.length === 0)) return [];
    const title = labelOf(CLAUSE, clause);
    const row = (description) => [{ key: clause, title, description }];
    switch (kind) {
        case CLAUSE_VALUE_KIND.RULE_TEXT:
            return row(ruleText(value));
        case CLAUSE_VALUE_KIND.LABEL:
            return row(labelOf(group, value));
        case CLAUSE_VALUE_KIND.YES_NO:
            return row(labelOf(CLAUSE_WORD, value ? CLAUSE_VALUE.YES : CLAUSE_VALUE.NO));
        case CLAUSE_VALUE_KIND.LAYERS:
            return row(value.map(layerName).join(LAYER_SEPARATOR));
        case CLAUSE_VALUE_KIND.LEGAL_BASIS:
            return value.map((basis, index) => ({
                key: `${clause}.${index}`,
                title,
                description: [ruleText(basis.name), basis.citation].filter(Boolean).join(PART_SEPARATOR),
                url: basis.url,
            }));
        case CLAUSE_VALUE_KIND.MARKET_REFERENCE:
            return value.map((reference, index) => ({
                key: `${clause}.${index}`,
                title,
                description: [ruleText(reference.title), labelOf(REFERENCE_SUBJECT, reference.supports)].join(
                    PART_SEPARATOR
                ),
                url: reference.url,
            }));
        default:
            return row(countText(kind, value));
    }
};

/**
 * Request #105: a requirement's composed rule as list rows `{ key, title, description, url? }`, one per clause the
 * rule states (and one per norm or market practice), in RULE_CLAUSE_PRESENTATION's order: the title is the clause,
 * the description its value. A clause the rule does not state is left out; a null rule (a partner evaluated before
 * #105) has no rows. `layerName(layer)` names a jurisdiction; by default its id.
 */
export const ruleClauseRows = (rule, { layerName = (layer) => layer } = {}) =>
    rule ? RULE_CLAUSE_PRESENTATION.flatMap((entry) => clauseRows(entry, rule, layerName)) : [];
