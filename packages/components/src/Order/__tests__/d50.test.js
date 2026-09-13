// D-50, MADE MECHANICAL FOR THIS PACKAGE.
//
// `order-narration` carries a `d50.test.js` that fails if a legacy status ever
// appears in it. That package could make the rule absolute — it was written
// after the canon — and this one cannot: `whatIsTheOrderStatus` is 707 lines
// of legacy comparisons and lives exactly one more release (D-51).
//
// So the rule here is CONTAINMENT, which is the same rule stated for a surface
// that is mid-migration: the legacy vocabulary may exist in the file that is
// being retired, and nowhere else. That is what makes C6's DoD — «cero
// comparaciones legacy en la superficie» (plan §20.6) — a test instead of an
// inspection, and it is the same shape as Commerce's
// `order/c3CapabilityClosure.test.js`: an entry that stops being true fails
// here, and so does a new comparison anywhere else.
//
// When `whatIsTheOrderStatus` goes at C6, delete its line from QUARANTINE and
// this suite becomes the absolute rule `order-narration` already has.
import fs from 'fs';
import path from 'path';

import { CANONICAL_ORDER_STATUS as C } from '@jmstechnologiesinc/order';
import { EN, ES } from '@jmstechnologiesinc/order-narration';

const ORDER_DIR = path.join(__dirname, '..');
const LOCALIZATION_DIR = path.join(__dirname, '..', '..', 'Localization');

// The ONE file allowed to hold the legacy vocabulary, with the reason and the
// gate that removes it. Anything else is a defect.
const QUARANTINE = {
    'WhatIsTheOrderStatus.js': 'deprecated at 0.2.0, retired at C6 (D-51: it lives exactly one release)',
};

const sourceFiles = (dir) =>
    fs
        .readdirSync(dir)
        .filter((name) => name.endsWith('.js') && !name.endsWith('.stories.js'))
        .map((name) => ({ name, body: fs.readFileSync(path.join(dir, name), 'utf8') }));

// `ORDER_STATUS.foo` but never `CANONICAL_ORDER_STATUS.foo` (the lookbehind is
// the point — the canonical name CONTAINS the legacy one) and never
// `ORDER_LIST_STATUS.foo`, which is this package's own bucket table.
const LEGACY_REFERENCE = /(?<![A-Z_])ORDER_STATUS\.[a-z][A-Za-z]*/g;

// A Title Case i18n key: `order.Vendor Accepted`, `order.Completed`.
const LEGACY_I18N_KEY = /['"`]order\.[A-Z][A-Za-z ]*['"`]/g;

const withoutComments = (body) => body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

describe('D-50 — the legacy vocabulary is contained, and the container is declared', () => {
    it.each(sourceFiles(ORDER_DIR).map((file) => [file.name, file]))(
        'Order/%s holds no legacy status',
        (name, file) => {
            const found = withoutComments(file.body).match(LEGACY_REFERENCE) || [];

            if (QUARANTINE[name]) {
                // Quarantined, not exempt: it must still BE the legacy table.
                // An entry that stops being true is as much a defect as a new
                // comparison somewhere else.
                expect(found.length).toBeGreaterThan(0);
                return;
            }
            expect(found).toEqual([]);
        }
    );

    it.each(sourceFiles(ORDER_DIR).map((file) => [file.name, file]))(
        'Order/%s builds no i18n key from a legacy status',
        (name, file) => {
            const found = withoutComments(file.body).match(LEGACY_I18N_KEY) || [];
            if (QUARANTINE[name]) return;
            expect(found).toEqual([]);
        }
    );

    it('the Localization layer holds neither', () => {
        for (const file of sourceFiles(LOCALIZATION_DIR)) {
            const body = withoutComments(file.body);
            expect(body.match(LEGACY_REFERENCE) || []).toEqual([]);
            expect(body.match(LEGACY_I18N_KEY) || []).toEqual([]);
        }
    });

    it('names no notification provider — channels belong to the Policy and to Novu (ADR-0018 §22)', () => {
        const providers = /\b(novu|sendgrid|twilio|fcm|firebase-messaging)\b/i;
        for (const dir of [ORDER_DIR, LOCALIZATION_DIR]) {
            for (const file of sourceFiles(dir)) {
                expect(withoutComments(file.body)).not.toMatch(providers);
            }
        }
    });
});

describe('D-50 — the canonical label family is complete, which is what makes the retirement possible', () => {
    // The whole reason the app's 14 `` localized(`order.${status}`) `` sites can
    // be retired without waiting for the pending capabilities: those sites are
    // LABELS, and this family covers all eleven members of canon §10 — including
    // the ones whose sentence does not exist yet.
    it.each(Object.values(C))('order.status.%s exists in both languages', (status) => {
        expect(EN[`order.status.${status}`]).toBeTruthy();
        expect(ES[`order.status.${status}`]).toBeTruthy();
    });

    it('and carries no Title Case legacy value as a key', () => {
        for (const catalogue of [EN, ES]) {
            for (const key of Object.keys(catalogue)) {
                expect(key).not.toMatch(/^order\.[A-Z]/);
            }
        }
    });
});
