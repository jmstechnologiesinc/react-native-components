import React, { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';
import { EN, ES, STAFF_INTENT } from '@jmstechnologiesinc/partner';
import {
    Appbar,
    Avatar,
    Button,
    Card,
    Divider,
    IconButton,
    List,
    Provider,
} from '@jmstechnologiesinc/react-native-paper';

import ChipRow from '../ChipRow/ChipRow';
import { LAYOUT, Pane, PaneFooter, PaneLayout } from '../Layout';
import { registerFlatCatalog } from '../Localization/Localization';
import MenuFilterChip from '../MenuFilterChip/MenuFilterChip';
import ScreenWrapper from '../ScreenWrapper';
import StatusBanner from '../StatusBanner/StatusBanner';
import TabsBar from '../Tabs/TabsBar';
import { TONE_ICONS } from '../tones';
import { intentAction, requirementLabel } from './viewModel';

// The partner page of the console (wireframe 2026-10-09) composed the way the app composes a record
// (`OrderViewScreen`): the top app bar, the record's `Card.Title`, `List.Section`s of `List.Item`s divided by a
// `Divider`, and the decisions at the bottom (`PaneFooter`, the console's `ActionGroup.Buttons`). Every component
// is Paper's or this library's, as it is: no style is added. Sample data in the shapes `getCase` answers; the
// `partner.*` labels come from the package catalogue, registered as a host does.
registerFlatCatalog({ en: EN, es: ES });

export default {
    title: 'patterns/Partner page',
};

const noop = () => {};

/** What the host's `TopAppbar` (CustomerApp `Core/topAppbar`) draws from the route: its title and its
 *  `options.appbarActions`. Stories have no navigator, so the story draws the same Paper bar. */
const TopAppbar = ({ title, actions = [] }) => (
    <Appbar.Header mode="center-aligned" elevated={false}>
        <Appbar.BackAction onPress={noop} />
        <Appbar.Content title={title} />
        {actions.map((action) => (
            <Appbar.Action key={action.icon} icon={action.icon} iconColor={action.color} onPress={action.onPress} />
        ))}
    </Appbar.Header>
);

/** The decisions of the footer from the server's allowed intents: label, tone and icon from the view model. */
const decisionsOf = (intents) =>
    intents.map(intentAction).map((action) => ({
        key: action.intent,
        label: action.title,
        icon: action.icon ?? undefined,
        tone: action.tone === 'danger' ? 'danger' : undefined,
        onPress: noop,
    }));

const icon = (name) => (props) => <List.Icon {...props} icon={name} />;
const chevron = icon('chevron-right');
const copy = (props) => <IconButton {...props} icon="content-copy" accessibilityLabel="Copy" onPress={noop} />;

/** The window: the app bar over the record in L2B (the content, its decisions, and the supporting pane). */
const RecordWindow = ({ title, appbarActions, primary, footer, supporting }) => {
    const { height } = useWindowDimensions();
    return (
        <Provider>
            <View style={{ height }}>
                <TopAppbar title={title} actions={appbarActions} />
                <PaneLayout
                    layout={LAYOUT.L2B}
                    primary={
                        <Pane accessibilityLabel={title}>
                            <ScreenWrapper>{primary}</ScreenWrapper>
                            {footer}
                        </Pane>
                    }
                    supporting={
                        supporting ? (
                            <Pane accessibilityLabel="Summary">
                                <ScreenWrapper>{supporting}</ScreenWrapper>
                            </Pane>
                        ) : undefined
                    }
                />
            </View>
        </Provider>
    );
};

const TABS = [
    { value: 'overview', label: 'Overview' },
    { value: 'compliance', label: 'Compliance (3)' },
    { value: 'profile', label: 'Profile' },
    { value: 'operations', label: 'Operations' },
];

/* ------------------------------------------------------------------ driver */

const DriverSummary = () => (
    <>
        <List.Section title="Status">
            <List.Item title="Active since Sep 14, 2026" description="Partnership" left={icon(TONE_ICONS.success)} />
            <List.Item title="Oct 10, 2026, 12:00 AM" description="Next evaluation" left={icon('calendar-clock')} />
            <List.Item title="US@2026.1 + US-MA@2026.2" description="Rules in force" left={icon('scale-balance')} />
        </List.Section>
        <Divider />
        <List.Section title="Identifiers">
            <List.Item title="drv_3HZP8Q" description="Partner ID" right={copy} />
            <List.Item title="u_8sK2fLw" description="Account ID" right={copy} />
            <List.Item title="42" description="Version" />
        </List.Section>
        <Divider />
        <List.Section title="Recent activity">
            <List.Item title="Requirements updated" description="System · 41 min ago" />
            <List.Item title="Document submitted" description="Vehicle registration v3 · Partner · 2 h ago" />
            <List.Item title="Trip class changed" description="Economy → Comfort · Staff, compliance · Sep 20" />
            <List.Item title="Activated" description="Onboarding → Active · Staff, reviewer · Sep 14" />
        </List.Section>
        <ScreenWrapper.Container>
            <Button mode="text" onPress={noop}>
                View all activity
            </Button>
        </ScreenWrapper.Container>
    </>
);

const DriverPage = ({ initialTab, children }) => {
    const [tab, setTab] = useState(initialTab);
    return (
        <RecordWindow
            title="Darnell Brooks"
            appbarActions={[{ icon: MATERIAL_ICONS.account, onPress: noop }]}
            primary={
                <>
                    <Card.Title
                        title="Darnell Brooks"
                        subtitle="Driver · Active · 2 past due · 1 open task"
                        titleVariant="headlineSmall"
                        left={(props) => <Avatar.Text {...props} label="DB" />}
                    />
                    <StatusBanner
                        tone="danger"
                        message="Ride is suspended: vehicle inspection and vehicle registration for the 2019 Toyota Camry are past due since Oct 2, 2026. Delivery is not affected."
                        actions={[{ label: 'View requirements', onPress: noop }]}
                    />
                    <TabsBar tabs={TABS} value={tab} onChange={setTab} accessibilityLabel="Partner sections" />
                    {children}
                </>
            }
            footer={<PaneFooter actions={decisionsOf([STAFF_INTENT.DEACTIVATE])} />}
            supporting={<DriverSummary />}
        />
    );
};

export const Overview = () => (
    <DriverPage initialTab="overview">
        <List.Section title="Services">
            <List.Item
                title="Ride"
                description="Suspended · blocked by Vehicle inspection and Vehicle registration (past due)"
                left={icon(TONE_ICONS.danger)}
            />
            <List.Item title="Delivery" description="Active · nothing outstanding" left={icon(TONE_ICONS.success)} />
        </List.Section>
        <Divider />
        <List.Section title="Needs attention">
            <List.Item
                title="Review vehicle registration · version 3"
                description="Documents queue · due in 4 h · Unassigned"
                left={icon('inbox-outline')}
                right={chevron}
                onPress={noop}
            />
            <List.Item
                title={`${requirementLabel('veh_1.vehicle_inspection')} · 2019 Toyota Camry`}
                description="Past due since Oct 2 · version 2 expired Sep 30"
                left={icon(TONE_ICONS.danger)}
                right={chevron}
                onPress={noop}
            />
            <List.Item
                title={requirementLabel('driver_license')}
                description="Due later · expires Nov 20, 2026"
                left={icon('clock-outline')}
                right={chevron}
                onPress={noop}
            />
        </List.Section>
        <Divider />
        <List.Section title="At a glance">
            <List.Item
                title="Documents"
                description="9 verified · 1 pending review · 1 expired"
                left={icon('file-document-outline')}
                right={chevron}
                onPress={noop}
            />
            <List.Item
                title="Background check"
                description="Report complete · Clear · Sep 12"
                left={icon('shield-check-outline')}
                right={chevron}
                onPress={noop}
            />
            <List.Item
                title="Trip class"
                description="Comfort · eligible for Economy, Comfort"
                left={icon('swap-horizontal')}
                right={chevron}
                onPress={noop}
            />
            <List.Item
                title="Fleet"
                description="Registered as Comfort · Offline since 8:12 AM"
                left={icon('sync')}
                right={chevron}
                onPress={noop}
            />
            <List.Item
                title="Payouts"
                description="Chase ••4321 · Verified · Weekly on Monday"
                left={icon('bank-outline')}
                right={chevron}
                onPress={noop}
            />
            <List.Item
                title="Jurisdiction"
                description="US › US-MA · Ratified · 4 of 4 sources agree"
                left={icon('map-marker-outline')}
                right={chevron}
                onPress={noop}
            />
        </List.Section>
    </DriverPage>
);

/** A requirement as a row: its label, where it stands and its evidence, and where its review opens. */
const Requirement = ({ requirementKey, description, tone, applies }) => (
    <List.Item
        title={applies ? `${requirementLabel(requirementKey)} · ${applies}` : requirementLabel(requirementKey)}
        description={description}
        left={icon(TONE_ICONS[tone])}
        right={chevron}
        onPress={noop}
    />
);

export const Compliance = () => (
    <DriverPage initialTab="compliance">
        <List.Section title="Past due">
            <Requirement
                requirementKey="veh_1.vehicle_inspection"
                applies="2019 Toyota Camry"
                tone="danger"
                description="Since Oct 2, 2026 · version 2 expired Sep 30 · Document expired"
            />
            <Requirement
                requirementKey="veh_1.vehicle_registration"
                applies="2019 Toyota Camry"
                tone="danger"
                description="Since Oct 2, 2026 · version 3 waiting for review"
            />
        </List.Section>
        <Divider />
        <List.Section title="Due later">
            <Requirement
                requirementKey="driver_license"
                tone="warning"
                description="Nov 20, 2026 · version 1 verified, expires that day"
            />
        </List.Section>
        <Divider />
        <List.Section title="Satisfied">
            <Requirement
                requirementKey="background_check"
                tone="success"
                description="Clear · report complete Sep 12"
            />
            <Requirement
                requirementKey="ma_dpu_clearance_certificate"
                tone="success"
                description="Verified · expires Aug 31, 2027"
            />
            <Requirement requirementKey="payout_account" tone="success" description="Chase ••4321 · Verified" />
        </List.Section>
        <ScreenWrapper.Container>
            <Button mode="text" onPress={noop}>
                Why these requirements?
            </Button>
        </ScreenWrapper.Container>
        <Divider />
        <List.Section title="Change requests">
            <List.Item
                title="Vehicle change · 2019 Toyota Camry"
                description="Asks to change: seats, doors · Pending review"
                left={icon('pencil-outline')}
                right={chevron}
                onPress={noop}
            />
        </List.Section>
    </DriverPage>
);

export const Operations = () => (
    <DriverPage initialTab="operations">
        <List.Section title="Vehicles">
            <List.Item
                title="2019 Toyota Camry · 8ABC123 (US-MA)"
                description="In use · Inactive: 2 requirements past due"
                left={(props) => <Avatar.Icon style={props.style} icon={MATERIAL_ICONS.driver} />}
                right={chevron}
                onPress={noop}
            />
            <List.Item
                title="2016 Honda Fit · 6XYZ771 (US-MA)"
                description="Active"
                left={(props) => <Avatar.Icon style={props.style} icon={MATERIAL_ICONS.driver} />}
                right={chevron}
                onPress={noop}
            />
        </List.Section>
        <Divider />
        <List.Section title="Trip class">
            <List.Item title="Comfort" description="Assigned" left={icon('swap-horizontal')} />
            <List.Item title="Economy, Comfort" description="Eligible, on the vehicle in use" />
        </List.Section>
        <ScreenWrapper.Container>
            <Button mode="text" onPress={noop}>
                Change trip class
            </Button>
        </ScreenWrapper.Container>
        <Divider />
        <List.Section title="Fleet">
            <List.Item
                title="Registered as Comfort"
                description="Since Sep 20, 2026"
                left={icon(TONE_ICONS.success)}
                right={chevron}
                onPress={noop}
            />
            <List.Item title="Offline" description="Since 8:12 AM · Signed out" left={icon('power-plug-off-outline')} />
        </List.Section>
    </DriverPage>
);

/* ------------------------------------------------------------------ vendor */

export const VendorProfile = () => {
    const [tab, setTab] = useState('profile');
    return (
        <RecordWindow
            title="Empanadas María"
            appbarActions={[{ icon: MATERIAL_ICONS.account, onPress: noop }]}
            primary={
                <>
                    <Card.Title
                        title="Empanadas María"
                        subtitle="Business · Onboarding · 2 requirements outstanding"
                        titleVariant="headlineSmall"
                        left={(props) => <Avatar.Icon {...props} icon={MATERIAL_ICONS.businessDetail} />}
                    />
                    <TabsBar
                        tabs={TABS.map((item) =>
                            item.value === 'compliance' ? { ...item, label: 'Compliance (2)' } : item
                        )}
                        value={tab}
                        onChange={setTab}
                        accessibilityLabel="Partner sections"
                    />
                    <List.Section title="Business">
                        <List.Item title="Empanadas María" description="Name" left={icon(MATERIAL_ICONS.store)} />
                        <List.Item
                            title="Colombian empanadas and arepas, made to order."
                            description="Description"
                            titleNumberOfLines={0}
                            left={icon('text-short')}
                        />
                        <List.Item
                            title="212 Hanover St, Suite 2, Boston, MA 02113, US"
                            description="Address"
                            left={icon('map-marker-outline')}
                        />
                        <List.Item title="+1 617 555 0190" description="Phone" left={icon('phone-outline')} />
                        <List.Item
                            title="hola@empanadasmaria.example"
                            description="Email"
                            left={icon('email-outline')}
                        />
                        <List.Item title="empanadasmaria.example" description="Website" left={icon('web')} />
                        <List.Item title="Restaurant" description="Categories" left={icon('tag-outline')} />
                    </List.Section>
                    <Divider />
                    <List.Section title="Legal entity">
                        <List.Item title="Empanadas María LLC" description="Legal name" left={icon('domain')} />
                        <List.Item
                            title="US EIN · •••••6789"
                            description="Tax ID"
                            left={icon('card-account-details-outline')}
                        />
                        <List.Item
                            title="Same as the business address"
                            description="Tax address"
                            left={icon('map-marker-outline')}
                        />
                        <List.Item title="Sep 30, 2026" description="Tax ID verified" left={icon(TONE_ICONS.success)} />
                    </List.Section>
                    <Divider />
                    <List.Section title="Owner account">
                        <List.Item
                            title="María López"
                            description="Owner · open the account"
                            left={(props) => <Avatar.Text style={props.style} label="ML" />}
                            right={chevron}
                            onPress={noop}
                        />
                        <List.Item
                            title="maria.lopez@example.com"
                            description="Email · verified"
                            left={icon('email-outline')}
                        />
                        <List.Item title="+1 617 555 0142" description="Phone" left={icon('phone-outline')} />
                        <List.Item title="Phone, Google" description="Signs in with" left={icon('login')} />
                        <List.Item title="Today, 9:02 AM" description="Last sign-in" left={icon('clock-outline')} />
                    </List.Section>
                    <Divider />
                    <List.Section title="Payouts">
                        <List.Item
                            title="Bank of America"
                            description="•••• 7710 · New, not yet validated"
                            left={icon('bank-outline')}
                        />
                        <List.Item title="Weekly on Friday" description="Schedule" left={icon('calendar-sync')} />
                    </List.Section>
                </>
            }
            footer={<PaneFooter actions={decisionsOf([STAFF_INTENT.REJECT, STAFF_INTENT.ACTIVATE])} />}
            supporting={
                <List.Section title="Identifiers">
                    <List.Item title="ven_T3KS9A" description="Partner ID" right={copy} />
                    <List.Item title="u_m4Lp0Qz" description="Account ID" right={copy} />
                    <List.Item title="7" description="Version" />
                </List.Section>
            }
        />
    );
};

/* -------------------------------------------------------- screens one level down */

export const RequirementsAndRules = () => (
    <RecordWindow
        title="Requirements and rules"
        primary={
            <>
                <List.Section title="Driver">
                    <List.Item
                        title={requirementLabel('driver_license')}
                        description="Expiring within the notice period · US-MA@2026.2 r1 · 220 CMR 274.05"
                        left={icon(TONE_ICONS.warning)}
                    />
                    <List.Item
                        title={requirementLabel('background_check')}
                        description="Satisfied · US-MA@2026.2 r4 · sample citation"
                        left={icon(TONE_ICONS.success)}
                    />
                </List.Section>
                <Divider />
                <List.Section title="2019 Toyota Camry">
                    <List.Item
                        title={requirementLabel('veh_1.vehicle_inspection')}
                        description="Expired past grace · US-MA@2026.2 r9 · 540 CMR 4.04"
                        left={icon(TONE_ICONS.danger)}
                    />
                    <List.Item
                        title={requirementLabel('veh_1.vehicle_registration')}
                        description="Waiting for review · US-MA@2026.2 r8 · M.G.L. c.90 §2"
                        left={icon('timer-sand')}
                    />
                </List.Section>
            </>
        }
        supporting={
            <>
                <List.Section title="Evaluation">
                    <List.Item title="US@2026.1 + US-MA@2026.2" description="Rules version" />
                    <List.Item title="Yes" description="In force" left={icon(TONE_ICONS.success)} />
                    <List.Item title="Oct 10, 2026, 12:00 AM" description="Next evaluation" />
                </List.Section>
                <Divider />
                <List.Section title="Jurisdiction">
                    <List.Item
                        title="US › US-MA"
                        description="Ratified by Staff, reviewer"
                        left={icon(TONE_ICONS.success)}
                    />
                    <List.Item title="US-MA" description="Declared market · agrees" />
                    <List.Item title="US-MA" description="Operating address · agrees" />
                    <List.Item title="US-MA" description="License state · agrees" />
                </List.Section>
            </>
        }
    />
);

export const Vehicle = () => (
    <RecordWindow
        title="2019 Toyota Camry"
        primary={
            <>
                <Card.Title
                    title="2019 Toyota Camry"
                    subtitle="In use · Inactive: 2 requirements past due"
                    titleVariant="headlineSmall"
                    left={(props) => <Avatar.Icon {...props} icon={MATERIAL_ICONS.driver} />}
                />
                <List.Section title="Details">
                    <List.Item title="Car" description="Type" />
                    <List.Item title="8ABC123 · US-MA" description="Plate" />
                    <List.Item title="4T1B11HK9KU802417" description="VIN" right={copy} />
                    <List.Item title="Sedan · 4 doors · 5 seats" description="Body" />
                    <List.Item title="None" description="Declared flags" />
                </List.Section>
                <Divider />
                <List.Section title="Trip-class eligibility">
                    <List.Item title="Economy" description="Eligible" left={icon(TONE_ICONS.success)} />
                    <List.Item title="Comfort" description="Eligible" left={icon(TONE_ICONS.success)} />
                    <List.Item
                        title="XL"
                        description="Seats: needs at least 6, has 5"
                        left={icon(TONE_ICONS.neutral)}
                    />
                    <List.Item
                        title="Black"
                        description="Colour: needs black, is silver"
                        left={icon(TONE_ICONS.neutral)}
                    />
                </List.Section>
            </>
        }
        supporting={
            <List.Section title="Requirements of this vehicle">
                <Requirement requirementKey="veh_1.vehicle_inspection" tone="danger" description="Past due" />
                <Requirement
                    requirementKey="veh_1.vehicle_registration"
                    tone="danger"
                    description="Past due · in review"
                />
                <Requirement requirementKey="veh_1.vehicle_insurance" tone="success" description="Satisfied" />
            </List.Section>
        }
    />
);

export const Fleet = () => (
    <RecordWindow
        title="Fleet"
        primary={
            <>
                <StatusBanner
                    tone="danger"
                    message="Fleet refused the last registration (Oct 8, 4:10 PM): trip class not priceable in this market."
                    actions={[{ label: 'Sync with Fleet', onPress: noop }]}
                />
                <List.Section title="Registration history">
                    <List.Item title="Registered as Comfort" description="Sep 20, 11:31 AM · Console · changed" />
                    <List.Item title="Registered as Economy" description="Sep 14, 3:02 PM · Activation · changed" />
                </List.Section>
            </>
        }
        supporting={
            <>
                <List.Section title="Registration">
                    <List.Item title="Registered" description="Status" left={icon(TONE_ICONS.success)} />
                    <List.Item title="Comfort (ride)" description="Trip class" />
                    <List.Item title="Sep 14, 2026" description="Registered" />
                </List.Section>
                <Divider />
                <List.Section title="Presence">
                    <List.Item title="Offline" description="Since today, 8:12 AM · Signed out" />
                </List.Section>
            </>
        }
    />
);

const ACTIVITY_KINDS = [
    { value: 'status', label: 'Status changes' },
    { value: 'access', label: 'Data access' },
];
const PERIODS = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
];

export const Activity = () => {
    const [kind, setKind] = useState(null);
    const [period, setPeriod] = useState('30');
    return (
        <RecordWindow
            title="Activity"
            primary={
                <>
                    <ScreenWrapper.Section>
                        <ChipRow>
                            <MenuFilterChip
                                label="Type"
                                options={ACTIVITY_KINDS}
                                value={kind}
                                onChange={setKind}
                                clearLabel="Any type"
                            />
                            <MenuFilterChip
                                label="Period"
                                options={PERIODS}
                                value={period}
                                onChange={setPeriod}
                                clearLabel="Any time"
                            />
                        </ChipRow>
                    </ScreenWrapper.Section>
                    <List.Section title="October 2026">
                        <List.Item title="Opened the case" description="Staff, reviewer · Oct 9, 10:51 AM" />
                        <List.Item
                            title="Document submitted"
                            description="Partner · Vehicle registration v3 · Oct 9, 8:40 AM"
                        />
                        <List.Item
                            title="Requirements updated"
                            description="System · Due now → Past due · Deadline passed · Oct 2, 12:00 AM"
                        />
                    </List.Section>
                    <Divider />
                    <List.Section title="September 2026">
                        <List.Item
                            title="Trip class changed"
                            description="Staff, compliance · Economy → Comfort · Sep 20"
                        />
                        <List.Item title="Activated" description="Staff, reviewer · Onboarding → Active · Sep 14" />
                    </List.Section>
                </>
            }
        />
    );
};
