'use strict';

/* Canon §17.5 R1 — ONE DECLARATION: THE PARTNER VOCABULARY IS NEVER SPELLED HERE.
 *
 * `@jmstechnologiesinc/partner` declares every partner value once, and a
 * consumer imports the constant; a copied literal is a second declaration that
 * keeps compiling after the package renames or drops the value. This walks the
 * partner surface of this library and fails on:
 *   - a string literal (or a whole template chunk) equal to a partner value;
 *   - a plain object key equal to one (`{ past_due: danger }` is the same
 *     redefinition as `{ 'past_due': danger }`; `{ [REQUIREMENT_BUCKET.PAST_DUE]:
 *     danger }` is not);
 *   - a string starting with the catalogue prefix (`partner.`): the keys belong
 *     to the package's catalogue (R2), and are built with `statusLabelKey`.
 *
 * The vocabulary is COLLECTED from the package, never listed: every exported
 * UPPER_SNAKE constant that is a flat list of strings, plus every group of
 * `LABEL_GROUPS` (which also carries the internal staff role names). Left out:
 *   - `EN`/`ES` (catalogue TEXT, not values) and `LOCALES`;
 *   - the `PARTNER_ACCOUNT_EVENT_*FIELDS` lists: they name schema FIELDS
 *     (`email`, `phoneNumber`, …), which every form of this library spells as
 *     its own prop names.
 *
 * SCOPE. Many partner values are ordinary words other domains of this library
 * own: `active` and `pending` are order states (Order/utils.js), `car` is a
 * vehicle icon, `web` a platform, `change` an event handler name. Scanning
 * the whole `src/` would force an allowlist of exactly the words most likely
 * to be misused, so the scan covers only the code that shows partner data:
 * `src/Partner/**`, the other K-22 components (`DecisionDialog`,
 * `DocumentViewer`, `Timeline`) and `src/tones.js`. Tests and stories are out
 * of scope (they plant values on purpose), and so is the Translations JSON,
 * whose `global.*` strings are this library's own words, not partner keys.
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const partner = require('@jmstechnologiesinc/partner');

const SRC = path.resolve(__dirname, '../src');

const SCOPE = ['Partner', 'DecisionDialog', 'DocumentViewer', 'Timeline', 'tones.js'].map((entry) =>
    path.join(SRC, entry)
);

const NOT_VOCABULARY = new Set(['EN', 'ES', 'LOCALES']);
const FIELD_LIST = /^PARTNER_ACCOUNT_EVENT_.*FIELDS$/;
const CATALOG_KEY = `${partner.CATALOG_KEY_PREFIX}.`;

const flatStrings = (value) => {
    if (!value || typeof value !== 'object') return null;
    const list = Array.isArray(value) ? value : Object.values(value);
    return list.length > 0 && list.every((item) => typeof item === 'string') ? list : null;
};

/** value -> the package constants that declare it. */
const VOCABULARY = (() => {
    const found = new Map();
    const add = (value, owner) => found.set(value, [...(found.get(value) ?? []), owner]);
    Object.entries(partner).forEach(([name, value]) => {
        if (!/^[A-Z][A-Z0-9_]*$/.test(name) || NOT_VOCABULARY.has(name) || FIELD_LIST.test(name)) return;
        (flatStrings(value) ?? []).forEach((item) => add(item, name));
    });
    Object.entries(partner.LABEL_GROUPS).forEach(([group, values]) =>
        Object.values(values).forEach((item) => add(item, `LABEL_GROUPS.${group}`))
    );
    return found;
})();

const offence = (value) => {
    if (VOCABULARY.has(value)) return `"${value}" (${VOCABULARY.get(value).join(', ')})`;
    if (value.startsWith(CATALOG_KEY)) return `"${value}" (a catalogue key: use statusLabelKey)`;
    return null;
};

/** Every offending spelling in `source`, as `line: description`. */
const offendersIn = (source) => {
    const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
    const found = [];
    const report = (node, value) => {
        const why = typeof value === 'string' ? offence(value) : null;
        if (why) found.push(`${node.loc.start.line}: ${why}`);
    };
    const visit = (node) => {
        if (!node || typeof node.type !== 'string') return;
        if (node.type === 'StringLiteral') report(node, node.value);
        if (node.type === 'TemplateElement') report(node, node.value.cooked);
        if ((node.type === 'ObjectProperty' || node.type === 'ObjectMethod') && !node.computed) {
            if (node.key.type === 'Identifier') report(node.key, node.key.name);
        }
        Object.keys(node).forEach((field) => {
            if (field === 'loc' || field === 'leadingComments' || field === 'trailingComments') return;
            const child = node[field];
            if (Array.isArray(child)) child.forEach(visit);
            else if (child && typeof child.type === 'string') visit(child);
        });
    };
    visit(ast.program);
    return found;
};

const filesIn = (entry) => {
    if (!fs.existsSync(entry)) return [];
    if (fs.statSync(entry).isFile()) return [entry];
    return fs
        .readdirSync(entry, { withFileTypes: true })
        .flatMap((item) => (item.name === '__tests__' ? [] : filesIn(path.join(entry, item.name))));
};

const SCANNED = SCOPE.flatMap(filesIn).filter((file) => /\.js$/.test(file) && !/\.stories\.js$/.test(file));

describe('R1 — no partner value is spelled outside @jmstechnologiesinc/partner', () => {
    it('collects the vocabulary from the package', () => {
        expect(VOCABULARY.size).toBeGreaterThan(100);
        expect(VOCABULARY.get(partner.REQUIREMENT_BUCKET.PAST_DUE)).toContain('REQUIREMENT_BUCKET');
        expect(VOCABULARY.has(partner.STAFF_INTENT.PRE_ADVERSE_ACTION)).toBe(true);
    });

    it('scans the partner surface', () => {
        const relative = SCANNED.map((file) => path.relative(SRC, file));
        expect(relative).toEqual(expect.arrayContaining(['Partner/viewModel.js', 'Partner/StatusChip.js', 'tones.js']));
    });

    it.each(SCANNED.map((file) => [path.relative(SRC, file), file]))('%s', (name, file) => {
        expect(offendersIn(fs.readFileSync(file, 'utf8'))).toEqual([]);
    });
});

describe('the scan catches a planted redefinition', () => {
    it.each([
        ['a string literal', "const bucket = 'past_due';"],
        ['a plain object key', 'const TONES = { past_due: DANGER };'],
        ['a quoted object key', "const TONES = { 'pre_adverse_action': DANGER };"],
        ['a JSX attribute', 'const chip = <StatusChip kind="partnership" value="onboarding" />;'],
        ['a template chunk', 'const intent = `reactivate`;'],
        ['a catalogue key', "const key = 'partner.status.x';"],
    ])('%s', (_, source) => {
        expect(offendersIn(source)).not.toEqual([]);
    });

    it('lets the constants through', () => {
        const source = [
            "import { REQUIREMENT_BUCKET } from '@jmstechnologiesinc/partner';",
            'const TONES = { [REQUIREMENT_BUCKET.PAST_DUE]: DANGER };',
            '// past_due, in a comment, is prose',
        ].join('\n');
        expect(offendersIn(source)).toEqual([]);
    });
});
