import React from 'react';
import { Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import ChipList from '../src/ChipList/ChipList';
import FormDriverInfo from '../src/Form/FormDriverInfo';
import { setI18nConfig } from '../src/Localization/Localization';
import SideNav from '../src/SideNav/SideNav';
import * as Tabs from '../src/Tabs/Tabs';

// The props the existing (mobile) consumers pass today — CustomerApp's `drawerSideNav` and
// `InventoryManagerScreen`, and this library's `StickySectionList` and `ChipList`. Their rendered trees were
// captured from the code BEFORE the rail/tab accessibility and MD3 additions (0.4.0-dev, OPEN-ITEMS #12-#14)
// into `__fixtures__/legacyTrees.json`. Rendering them again must give the same tree, except for the tab
// semantics `withoutTabSemantics` removes — nothing else, and nothing at all for SideNav and ChipList.
// `legacyTrees.capture.test.js` re-captures a case from the old source (Form.DriverInfo from `partner-ui/k22`
// @ 7d46582 reproduces the fixture byte for byte).
const APP_MENU = [
    { title: 'Active', icon: 'receipt', value: 'ActiveOrderRootStack', badge: 3 },
    { title: 'History', icon: 'history', value: 'HistoryOrderRootStack' },
    { title: 'Settings', icon: 'cog-outline', value: 'SettingsRootStack' },
];

const CATALOG = [
    { id: 'a', title: 'Breakfast' },
    { id: 'b', title: 'Lunch' },
    { id: 'c', title: 'Dinner' },
];

const LEGACY_CASES = {
    'SideNav drawer, expanded (portrait)': () => (
        <SideNav isExpanded selectedIndex={0} menuItems={APP_MENU} onPress={() => {}} />
    ),
    'SideNav drawer, collapsed (landscape)': () => (
        <SideNav isExpanded={false} selectedIndex={1} menuItems={APP_MENU} onPress={() => {}} />
    ),
    'SideNav collapsed with a header': () => (
        <SideNav
            menuItems={APP_MENU.map((item) => ({ ...item, key: item.value }))}
            selectedKey="HistoryOrderRootStack"
            renderHeader={() => <Text>header</Text>}
            onPress={() => {}}
        />
    ),
    'Tabs.Scrollable (InventoryManagerScreen)': () => (
        <Tabs.Scrollable>
            {CATALOG.map((item, index) => (
                <Tabs.Item
                    key={`sticky-section-${item.id}`}
                    title={item.title}
                    isSelected={index === 1}
                    onPress={() => {}}
                />
            ))}
        </Tabs.Scrollable>
    ),
    'Tabs.Scrollable (StickySectionList)': () => (
        <Tabs.Scrollable title="Menu" currentIndex={0}>
            {CATALOG.map((item, index) => (
                <Tabs.Item
                    key={`sticky-section-${item.id}`}
                    title={item.title}
                    isSelected={index === 0}
                    style={{ backgroundColor: null }}
                    onPress={() => {}}
                />
            ))}
        </Tabs.Scrollable>
    ),
    'Tabs.Item without onPress': () => <Tabs.Item title="Selected" isSelected />,
    ChipList: () => <ChipList options={['All', 'Open', 'Closed']} currentIndex={1} onPress={() => {}} />,
    // The driver onboarding form as the app renders it, captured before `readOnly`, `highlightFields` and
    // `errors` were added (C-25): without them it must be the same tree.
    'Form.DriverInfo (driver onboarding)': () => (
        <FormDriverInfo licenseNumer="D1234567" ssn="123456789" inputActionHandler={() => {}} />
    ),
};

const LEGACY_TREES = require('./__fixtures__/legacyTrees.json');

// What the tab semantics add to a native tree: `accessibilityRole` on the list and on each tab, and
// `selected` inside the tab's `accessibilityState` (which Pressable already filled with `disabled`). Both
// are removed before the comparison, and only from the cases that render tabs.
const withoutTabSemantics = (props = {}) => {
    const { accessibilityRole, accessibilityState, ...rest } = props;
    if (!accessibilityState) {
        return rest;
    }
    const { selected, ...state } = accessibilityState;
    return Object.keys(state).length ? { ...rest, accessibilityState: state } : rest;
};
const IDENTICAL = [
    'SideNav drawer, expanded (portrait)',
    'SideNav drawer, collapsed (landscape)',
    'SideNav collapsed with a header',
    'ChipList',
    'Form.DriverInfo (driver onboarding)',
];

jest.useFakeTimers();

// The form's labels come from the catalogue, as when its tree was captured.
beforeAll(() => setI18nConfig());

const renderJSON = (element) => {
    let tree;
    act(() => {
        tree = renderer.create(<Provider theme={MD3LightTheme}>{element}</Provider>);
    });
    const json = JSON.parse(JSON.stringify(tree.toJSON()));
    act(() => {
        tree.unmount();
        jest.runOnlyPendingTimers();
    });
    return json;
};

const collect = (node, found = []) => {
    if (node && typeof node === 'object') {
        if (node.props) {
            found.push(node.props);
        }
        (node.children ?? []).forEach((child) => collect(child, found));
    }
    return found;
};

const strip = (node) => {
    if (!node || typeof node !== 'object') {
        return node;
    }
    return {
        ...node,
        props: withoutTabSemantics(node.props),
        children: node.children ? node.children.map(strip) : node.children,
    };
};

describe('the existing (mobile) rendering', () => {
    it('has a captured tree for every case', () => {
        expect(Object.keys(LEGACY_TREES).sort()).toEqual(Object.keys(LEGACY_CASES).sort());
    });

    it.each(IDENTICAL)('%s renders exactly as before', (name) => {
        expect(renderJSON(LEGACY_CASES[name]())).toEqual(LEGACY_TREES[name]);
    });

    it.each(Object.keys(LEGACY_CASES).filter((name) => !IDENTICAL.includes(name)))(
        '%s only gains the tab semantics',
        (name) => {
            const now = renderJSON(LEGACY_CASES[name]());
            expect(strip(now)).toEqual(strip(LEGACY_TREES[name]));

            const roles = collect(now)
                .map((props) => props.accessibilityRole)
                .filter(Boolean);
            expect(roles).toContain('tab');
            // Neither existed before: the comparison hides additions only.
            const before = collect(LEGACY_TREES[name]);
            expect(
                before.some((props) => 'accessibilityRole' in props || 'selected' in (props.accessibilityState ?? {}))
            ).toBe(false);
        }
    );
});
