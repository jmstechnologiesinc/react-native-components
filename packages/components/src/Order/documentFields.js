// ADR-0017 §7 rebanada 2 — the order document's timestamp FIELDS.
//
// These are the DATA MODEL, not the vocabulary, and the difference is the
// whole reason this file exists. The persisted key names predate the canon,
// and D-12 (2026-09-11) settled that persisted documents are never rewritten
// — so these names outlived the fifteen legacy statuses C6 retired (M96) and
// stay as the keys the documents carry (the shared package names the same
// keys by the canon: `ORDER_STATUS_TIME_KEY`, 0.2.0).
export const ORDER_TIME_FIELDS = Object.freeze({
    placed: 'placedTime',
    driverAccepted: 'driverAcceptedTime',
});
