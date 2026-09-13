// ADR-0017 §7 rebanada 2 — the order document's timestamp FIELDS.
//
// These are the DATA MODEL, not the vocabulary, and the difference is the
// whole reason this file exists. Canon §15's legacy spelling is baked into the
// persisted key names, and D-12 (2026-09-11) settled that persisted documents
// are never rewritten — so these names outlive the fifteen legacy statuses and
// are retired, if ever, with the rest of the model at C6 (plan §20.8, «claves
// de tiempo: modelo de datos, C6»).
//
// They used to be written `orderStatusTime(ORDER_STATUS.placed)`, which reads
// like a status comparison and is not one: `orderStatusTime` is
// `invert(ORDER_STATUS)` plus «Time», so it answers `undefinedTime` for a
// CANONICAL status and only ever worked because a legacy constant was handed
// to it. Naming the fields directly says what they are and removes the last
// legacy status reference from the component; the suite pins them against
// `orderStatusTime` so the two spellings cannot drift while both exist.
export const ORDER_TIME_FIELDS = Object.freeze({
    placed: 'placedTime',
    driverAccepted: 'driverAcceptedTime',
});
