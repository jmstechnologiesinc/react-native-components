import React, { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';
import { EN, ES, PARTNERSHIP_STATUS } from '@jmstechnologiesinc/partner';
import { Appbar, Avatar, Button, List, Provider, Searchbar } from '@jmstechnologiesinc/react-native-paper';

import ChipRow from '../ChipRow/ChipRow';
import DataTableView from '../DataTableView/DataTableView';
import { registerFlatCatalog } from '../Localization/Localization';
import MenuFilterChip from '../MenuFilterChip/MenuFilterChip';
import ScreenWrapper from '../ScreenWrapper';
import TabsBar from '../Tabs/TabsBar';
import { statusLabel } from './viewModel';

// The partner directory of the console (wireframe 2026-10-09) with Paper's and this library's components as
// they are: the top app bar, four work tabs, an exact search, one set of menu filter chips, and the table, each
// partner with its picture on the left as the app's lists show a person (`Avatar.Image`, else the kind's
// `Avatar.Icon`). Sample rows in the shape `listPartners` answers; `photoUrl` is NOT in that answer today
// (contract #47 would have to add it), so without it every row shows the kind's icon.
registerFlatCatalog({ en: EN, es: ES });

export default {
    title: 'patterns/Partners list',
};

const noop = () => {};

const VIEWS = [
    { value: 'all', label: 'All' },
    { value: 'to_review', label: 'To review (41)' },
    { value: 'restricted', label: 'Restricted (9)' },
    { value: 'restricted_soon', label: 'Restricted soon (23)' },
];
const TYPES = [
    { value: 'driver', label: 'Driver' },
    { value: 'vendor', label: 'Business' },
];
const STATUSES = Object.values(PARTNERSHIP_STATUS).map((value) => ({
    value,
    label: statusLabel('partnership', value),
}));
const JURISDICTIONS = [
    { value: 'US', label: 'US' },
    { value: 'US-MA', label: 'US › US-MA' },
    { value: 'DO', label: 'DO' },
];

const ROWS = [
    {
        partnerId: 'drv_7Q2M',
        kind: 'driver',
        name: 'Marisol Peña',
        photoUrl: '/assets/daxir-app.png',
        status: 'onboarding',
        requirements: '1 due now',
        openTasks: 2,
        chain: 'US › US-MA',
        updated: '4 min ago',
    },
    {
        partnerId: 'ven_K81D',
        kind: 'vendor',
        name: 'La Esquina Café',
        status: 'active',
        requirements: 'Up to date',
        openTasks: 0,
        chain: 'DO',
        updated: '18 min ago',
    },
    {
        partnerId: 'drv_3HZP',
        kind: 'driver',
        name: 'Darnell Brooks',
        status: 'active',
        requirements: '2 past due',
        openTasks: 1,
        chain: 'US › US-MA',
        updated: '41 min ago',
    },
    {
        partnerId: 'drv_X0LE',
        kind: 'driver',
        name: 'Kevin Tran',
        status: 'deactivated',
        requirements: '1 past due',
        openTasks: 0,
        chain: 'US › US-MA',
        updated: '2 h ago',
    },
    {
        partnerId: 'drv_5RBN',
        kind: 'driver',
        name: null,
        status: 'onboarding',
        requirements: '4 due now',
        openTasks: 0,
        chain: 'US',
        updated: '3 h ago',
    },
    {
        partnerId: 'drv_N4JD',
        kind: 'driver',
        name: 'Ana Lucía Ramírez',
        status: 'rejected',
        requirements: 'Up to date',
        openTasks: 0,
        chain: 'DO',
        updated: 'Yesterday',
    },
];

const KIND = {
    driver: { label: 'Driver', icon: MATERIAL_ICONS.driver },
    vendor: { label: 'Business', icon: MATERIAL_ICONS.businessDetail },
};

/** The partner's picture on the left of the row, as the app shows a person or a vehicle in a list. */
const pictureOf = (row) => (props) =>
    row.photoUrl ? (
        <Avatar.Image style={props.style} source={{ uri: row.photoUrl }} />
    ) : (
        <Avatar.Icon style={props.style} icon={KIND[row.kind].icon} />
    );

const COLUMNS = [
    {
        key: 'name',
        title: 'Partner',
        flex: 2,
        render: (row) => (
            <List.Item
                title={row.name ?? `Unnamed ${KIND[row.kind].label.toLowerCase()}`}
                description={`${KIND[row.kind].label} · ${row.partnerId}`}
                left={pictureOf(row)}
            />
        ),
    },
    { key: 'status', title: 'Status', render: (row) => statusLabel('partnership', row.status) },
    { key: 'requirements', title: 'Requirements' },
    {
        key: 'openTasks',
        title: 'Open tasks',
        numeric: true,
        sortable: true,
        render: (row) => (row.openTasks ? String(row.openTasks) : null),
    },
    { key: 'chain', title: 'Jurisdiction' },
    { key: 'updated', title: 'Last updated', sortable: true },
];

export const Directory = () => {
    const { height } = useWindowDimensions();
    const [view, setView] = useState('all');
    const [query, setQuery] = useState('');
    const [type, setType] = useState(null);
    const [status, setStatus] = useState(null);
    const [jurisdiction, setJurisdiction] = useState(null);
    const filtered = Boolean(type || status || jurisdiction);
    const rows = ROWS.filter(
        (row) =>
            (!type || row.kind === type) &&
            (!status || row.status === status) &&
            (!jurisdiction || row.chain.includes(jurisdiction))
    );

    return (
        <Provider>
            <View style={{ height }}>
                {/* What the host's `TopAppbar` (CustomerApp `Core/topAppbar`) draws for the route. */}
                <Appbar.Header mode="center-aligned" elevated={false}>
                    <Appbar.Content title="Partners" />
                </Appbar.Header>
                <ScreenWrapper>
                    <TabsBar tabs={VIEWS} value={view} onChange={setView} accessibilityLabel="Partner views" />
                    <ScreenWrapper.Container>
                        <ScreenWrapper.Section>
                            <Searchbar
                                placeholder="Partner ID, owner email or phone (exact)"
                                value={query}
                                onChangeText={setQuery}
                            />
                        </ScreenWrapper.Section>
                        <ScreenWrapper.Section>
                            <ChipRow>
                                <MenuFilterChip
                                    label="Type"
                                    options={TYPES}
                                    value={type}
                                    onChange={setType}
                                    clearLabel="Any type"
                                />
                                <MenuFilterChip
                                    label="Status"
                                    options={STATUSES}
                                    value={status}
                                    onChange={setStatus}
                                    clearLabel="Any status"
                                />
                                <MenuFilterChip
                                    label="Jurisdiction"
                                    options={JURISDICTIONS}
                                    value={jurisdiction}
                                    onChange={setJurisdiction}
                                    clearLabel="Any jurisdiction"
                                />
                                {filtered ? (
                                    <Button
                                        mode="text"
                                        onPress={() => {
                                            setType(null);
                                            setStatus(null);
                                            setJurisdiction(null);
                                        }}
                                    >
                                        Clear filters
                                    </Button>
                                ) : null}
                            </ChipRow>
                        </ScreenWrapper.Section>
                    </ScreenWrapper.Container>
                    <DataTableView
                        columns={COLUMNS}
                        rows={rows}
                        rowKey="partnerId"
                        defaultSort={{ key: 'updated', direction: 'descending' }}
                        sortMode="server"
                        onRowPress={noop}
                        emptyLabel="No partner matches the filters"
                        accessibilityLabel="Partners"
                    />
                </ScreenWrapper>
            </View>
        </Provider>
    );
};
