import React, { useState } from 'react';

import DataTableView from './DataTableView';

export default {
    title: 'packages/DataTableView',
};

const COLUMNS = [
    { key: 'name', title: 'Partner', sortable: true, flex: 2 },
    { key: 'status', title: 'Status', sortable: true },
    { key: 'count', title: 'Documents', numeric: true, sortable: true },
];

const page = (from) =>
    Array.from({ length: 5 }, (_, index) => ({
        id: String(from + index),
        name: `Partner ${from + index}`,
        status: (from + index) % 3 ? 'active' : 'pending',
        count: (from + index) % 4 ? (from + index) % 7 : null,
    }));

export const SortAndLoadMore = () => {
    const [rows, setRows] = useState(page(1));
    const [selected, setSelected] = useState();
    return (
        <DataTableView
            columns={COLUMNS}
            rows={rows}
            rowKey="id"
            defaultSort={{ key: 'name', direction: 'ascending' }}
            onRowPress={(row) => setSelected(row.id)}
            selectedKey={selected}
            hasMore={rows.length < 15}
            onLoadMore={() => setRows((current) => [...current, ...page(current.length + 1)])}
            accessibilityLabel="Partners"
        />
    );
};

export const Empty = () => (
    <DataTableView columns={COLUMNS} rows={[]} rowKey="id" emptyLabel="No partners match these filters" />
);
