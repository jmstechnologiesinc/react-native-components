'use strict';

/* C-35 — THE PORTABLE ENTRY LOADS ON THE WEB WITHOUT STUBS.
 *
 * A web bundler resolves a module's `.web.js` twin before the module itself.
 * This walks the STATIC import graph of `src/portable.js` the same way and
 * fails if any module on the list below becomes reachable: each one either
 * throws when a web bundle evaluates it (a TurboModule react-native-web does not
 * provide) or needs a Babel plugin a host bundler does not run. The graph is
 * this package's own source; a bare import is checked by package name and not
 * followed.
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');

const SRC = path.resolve(__dirname, '../src');
const ENTRY = path.join(SRC, 'portable.js');

const FORBIDDEN = [
    'react-native-config',
    'react-native-dotenv',
    'react-native-localize',
    'react-native-image-picker',
    'react-native-actions-sheet',
    'react-native-permissions',
    'react-native-geolocation-service',
    'react-native-gesture-handler',
    'react-native-reanimated',
    'react-native-draggable-flatlist',
    '@rnmapbox/maps',
    'mapbox-gl',
    'react-map-gl',
    '@gorhom/bottom-sheet',
    '@jmstechnologiesinc/bottom-sheet',
    'centrifuge',
    // Importing the package by its own name drags the whole barrel back in.
    '@jmstechnologiesinc/react-native-components',
];

const packageOf = (specifier) => {
    const parts = specifier.split('/');
    return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
};

const resolveRelative = (from, specifier) => {
    const base = path.resolve(path.dirname(from), specifier);
    const candidates = [
        `${base}.web.js`,
        `${base}.js`,
        path.join(base, 'index.web.js'),
        path.join(base, 'index.js'),
        base,
    ];
    const found = candidates.find((file) => fs.existsSync(file) && fs.statSync(file).isFile());
    if (!found) throw new Error(`cannot resolve ${specifier} from ${path.relative(SRC, from)}`);
    return found;
};

const specifiersOf = (file) => {
    const ast = parse(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['jsx'] });
    const found = [];
    const visit = (node) => {
        if (!node || typeof node.type !== 'string') return;
        if (
            (node.type === 'ImportDeclaration' ||
                node.type === 'ExportNamedDeclaration' ||
                node.type === 'ExportAllDeclaration') &&
            node.source
        ) {
            found.push(node.source.value);
        }
        if (
            node.type === 'CallExpression' &&
            ((node.callee.type === 'Identifier' && node.callee.name === 'require') || node.callee.type === 'Import') &&
            node.arguments[0]?.type === 'StringLiteral'
        ) {
            found.push(node.arguments[0].value);
        }
        for (const value of Object.values(node)) {
            if (Array.isArray(value)) value.forEach(visit);
            else if (value && typeof value === 'object' && value.type) visit(value);
        }
    };
    visit(ast.program);
    return found;
};

// file -> [the chain of files that reached it], so a failure names its path.
const walk = () => {
    const reached = new Map([[ENTRY, [ENTRY]]]);
    const packages = new Map();
    const queue = [ENTRY];
    while (queue.length) {
        const file = queue.shift();
        if (!file.endsWith('.js')) continue;
        for (const specifier of specifiersOf(file)) {
            if (specifier.startsWith('.')) {
                const target = resolveRelative(file, specifier);
                if (!reached.has(target)) {
                    reached.set(target, [...reached.get(file), target]);
                    queue.push(target);
                }
            } else if (!packages.has(packageOf(specifier))) {
                packages.set(packageOf(specifier), reached.get(file));
            }
        }
    }
    return { reached, packages };
};

const { reached, packages } = walk();
const relative = (file) => path.relative(SRC, file);

describe('the portable entry (C-35)', () => {
    it.each(FORBIDDEN)('never reaches %s', (name) => {
        const chain = packages.get(name);
        expect(chain ? `${name} via ${chain.map(relative).join(' -> ')}` : null).toBeNull();
    });

    it('takes the web twins, as a web bundler would', () => {
        const files = [...reached.keys()].map(relative);
        expect(files).toEqual(
            expect.arrayContaining([
                'Config.web.js',
                'Localization/Localization.web.js',
                'OptionPicker/OptionSheet.web.js',
            ])
        );
        expect(files).not.toContain('Config.js');
        expect(files).not.toContain('Localization/Localization.js');
        expect(files).not.toContain('index.js');
        // The display-only gallery is portable; the picker namespace is not.
        expect(files).toContain('ImagePicker/PhotoGalleryDisplay.js');
        expect(files).toContain('ImagePicker/AvatarDisplay.js');
        expect(files).not.toContain('ImagePicker/ImagePickerAvatar.js');
        expect(files).not.toContain('ImagePicker/ImagePicker.js');
        expect(files).not.toContain('ImagePicker/PhotoGallery.js');
        // The address rows are portable; the map picker and geolocation behind the Geoposition index are not.
        expect(files).toContain('Geoposition/RecentLocations.js');
        expect(files).not.toContain('Geoposition/index.js');
        expect(files).not.toContain('Geoposition/MapPicker/index.js');
    });

    it('loads under Jest and serves what the web host imports', () => {
        const portable = require('../src/portable');
        const expected = [
            'List',
            'ScreenWrapper',
            'ChipList',
            'Tabs',
            'SegmentedButtonGroup',
            'ActionGroup',
            'SideNav',
            'TouchableRippleWrapper',
            'TNActivityIndicator',
            'TNEmptyStateView',
            'styles',
            'LAYOUT_MODE',
            'configureComponents',
            'Form',
            'StripeForm',
            'localized',
            'setI18nConfig',
            'registerFlatCatalog',
            'currentLocale',
            'merge',
            'formatDateTime',
            'formatTime',
            'formatRelativeTime',
            'orderViewModel',
            'statusLabel',
            'PartnerViewModel',
            'StatusChip',
            'SlaChip',
            'DocumentViewer',
            'ZOOM',
            'DecisionDialog',
            'useModalFocus',
            'Timeline',
            'ButtonWrapper',
            'PhotoGalleryDisplay',
            // The console's generic UI, moved here (0.4.0-dev).
            'LAYOUT',
            'PANE',
            'SIZE_CLASS',
            'SUPPORTING_MODE',
            'paneMetrics',
            'sizeClassOf',
            'tokenScale',
            'useWindowSizeClass',
            'paneArrangement',
            'usePaneContext',
            'PaneLayout',
            'Pane',
            'PaneHeader',
            'PaneFooter',
            'SideSheet',
            'BottomSheet',
            'SheetHeader',
            'NavigationRail',
            'SectionCard',
            'KeyValueList',
            'ListRow',
            'iconSlot',
            'nodeSlot',
            'MutedText',
            'EmptyState',
            'LoadingState',
            'ErrorState',
            'SnackbarProvider',
            'useSnackbar',
            'DataTableView',
            'SORT_DIRECTION',
            'sortRows',
            'CodeBlock',
            'NoteField',
            'RadioGroupField',
            'CheckboxListField',
            'FilterChips',
            'StatusBanner',
            'AvatarDisplay',
            'ChangedHelperText',
            'FieldErrorText',
            'FieldErrorList',
            'useNow',
            'valueText',
            'formatCalendarDate',
            'parseCalendarDate',
            'formatDateInput',
            'parseDateInput',
            'parseDay',
            'isBlankDay',
            // The account projection's views (Payouts, Addresses).
            'Accounting',
            'LOCATION_LIST_ITEM',
            'LOCATION_LIST_ITEM_MAPPING',
            'interpunctLocationListItemDescription',
            'LocationListItem',
            'RecentLocations',
        ];
        expect(expected.filter((name) => portable[name] === undefined)).toEqual([]);
        expect(Object.keys(portable.Form).sort()).toEqual(
            ['BusinessInfo', 'DriverInfo', 'EmailPassword', 'PersonInfo', 'SecretInputText', 'VehicleInfo'].sort()
        );
        expect(Object.keys(portable.StripeForm).sort()).toEqual(['AccountBank', 'PaymentFrequency']);
        expect(typeof portable.ScreenWrapper.Section).toBe('function');
        expect(typeof portable.Tabs.Bar).toBe('function');
    });
});
