import React, { useState } from 'react';
import { View } from 'react-native';

import { MD3LightTheme, Provider, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { LAYOUT, PANE, NavigationRail, Pane, PaneFooter, PaneHeader, PaneLayout, SideSheet, BottomSheet } from '.';
import ListRow from '../ListRow/ListRow';

export default {
    title: 'packages/Layout',
};

// The window the panes sit on: MD3 paints it `elevation.level3`.
const Window = ({ children }) => {
    const { colors } = useTheme();
    return (
        <View style={{ flex: 1, minHeight: 560, flexDirection: 'row', backgroundColor: colors.elevation.level3 }}>
            {children}
        </View>
    );
};

const ITEMS = ['Queue', 'Partners', 'Rules', 'Audit'].map((label) => ({ key: label, label, icon: 'circle-outline' }));

const ListPane = ({ onOpen }) => (
    <Pane accessibilityLabel="Queue">
        <PaneHeader title="Queue" subtitle="3 open" />
        <View role="list" aria-label="Tasks">
            {['Driver license', 'Vehicle insurance', 'Background check'].map((title) => (
                <ListRow key={title} title={title} description="Waiting for review" onPress={() => onOpen(title)} />
            ))}
        </View>
    </Pane>
);

const DetailPane = ({ title }) => (
    <Pane accessibilityLabel="Task">
        <PaneHeader title={title ?? 'No task'} actions={[{ icon: 'refresh', label: 'Refresh', onPress: () => {} }]} />
        <View style={{ flex: 1, padding: MD3LightTheme.spacing.x4 }}>
            <Text>The task's details.</Text>
        </View>
        <PaneFooter
            caption="Assigned to you"
            actions={[
                { key: 'reject', label: 'Reject', tone: 'danger', onPress: () => {} },
                { key: 'verify', label: 'Verify', onPress: () => {} },
            ]}
        />
    </Pane>
);

const SupportingPane = () => (
    <Pane accessibilityLabel="Partner">
        <PaneHeader title="Partner" />
        <View style={{ padding: MD3LightTheme.spacing.x4 }}>
            <Text>Supporting information.</Text>
        </View>
    </Pane>
);

// Resize the window: XL shows three panes; large and expanded move the supporting pane to a side sheet; medium
// and compact show one pane at a time with a back arrow.
export const L3 = () => {
    const [task, setTask] = useState();
    const [active, setActive] = useState('Queue');
    return (
        <Provider>
            <Window>
                <NavigationRail
                    items={ITEMS}
                    activeKey={active}
                    onSelect={(item) => setActive(item.key)}
                    fab={{ icon: 'inbox-arrow-down', label: 'Next task', onPress: () => {} }}
                    accessibilityLabel="Sections"
                />
                <PaneLayout
                    layout={LAYOUT.L3}
                    list={<ListPane onOpen={setTask} />}
                    detail={<DetailPane title={task} />}
                    supporting={<SupportingPane />}
                    activePane={task ? PANE.DETAIL : PANE.LIST}
                    onBack={() => setTask(undefined)}
                    supportingLabel="Partner"
                />
            </Window>
        </Provider>
    );
};

export const L2A = () => {
    const [task, setTask] = useState();
    return (
        <Provider>
            <Window>
                <PaneLayout
                    layout={LAYOUT.L2A}
                    list={<ListPane onOpen={setTask} />}
                    detail={<DetailPane title={task} />}
                    activePane={task ? PANE.DETAIL : PANE.LIST}
                    onBack={() => setTask(undefined)}
                />
            </Window>
        </Provider>
    );
};

// Below expanded the supporting pane opens in a bottom sheet from the primary pane's header.
export const L2B = () => (
    <Provider>
        <Window>
            <PaneLayout
                layout={LAYOUT.L2B}
                primary={<DetailPane title="Partner case" />}
                supporting={<SupportingPane />}
            />
        </Window>
    </Provider>
);

export const Sheets = () => {
    const [side, setSide] = useState(false);
    const [bottom, setBottom] = useState(false);
    return (
        <Provider>
            <Window>
                <Pane accessibilityLabel="Sheets">
                    <PaneFooter
                        actions={[
                            { key: 'side', label: 'Side sheet', onPress: () => setSide(true) },
                            { key: 'bottom', label: 'Bottom sheet', onPress: () => setBottom(true) },
                        ]}
                    />
                </Pane>
                <SideSheet visible={side} onDismiss={() => setSide(false)} title="Validation">
                    <Text style={{ padding: MD3LightTheme.spacing.x6 }}>
                        Esc, the scrim or the close button dismiss it.
                    </Text>
                </SideSheet>
                <BottomSheet visible={bottom} onDismiss={() => setBottom(false)} title="Checks">
                    <Text style={{ padding: MD3LightTheme.spacing.x6 }}>
                        Esc, the scrim or the close button dismiss it.
                    </Text>
                </BottomSheet>
            </Window>
        </Provider>
    );
};
