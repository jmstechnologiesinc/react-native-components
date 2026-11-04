import React from 'react';
import { ScrollView, View } from 'react-native';

import { interpunct } from '@jmstechnologiesinc/commons';
import { EN, ES, REQUIREMENT_CAUSE, formatVehicleValue, vehicleValueParts } from '@jmstechnologiesinc/partner';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { localized, registerFlatCatalog, setI18nConfig } from '../Localization/Localization';
import DocumentCaptureCard from './DocumentCaptureCard';
import DocumentRequirementCard from './DocumentRequirementCard';
import DocumentVersionList from './DocumentVersionList';
import { requirementTitle, statusLabel } from './viewModel';

// The library's own words, then the `partner.*` catalogue, which belongs to `@jmstechnologiesinc/partner` (R2): a
// host sets both up once, as here.
setI18nConfig();
registerFlatCatalog({ en: EN, es: ES });

export default {
    title: 'packages/Partner/DocumentRequirement',
};

// Real items, nothing made up: the two drivers of the local circuit (US → US-MA, Boxford), as getMyStatus answers
// their checklist (read from the emulators on 2026-11-03), with the five fields of contract request #117 filled from
// what the server holds for them — the composed rules persisted beside their state (`label`, `explanation`), the
// server's capture table, and their versions in `…/partner_documents`.
const HONDA = { vehicleType: 'car', color: 'BLK', make: 'Honda', model: 'Accord', licensePlate: '123456' };
const CIVIC = { vehicleType: 'car', color: 'BGE', make: 'cifid', model: 'civic', licensePlate: '123445' };
const ONE_PAGE = { pages: 1, pdf: true };

const US_LICENCE = {
    en: "The valid driver's license of whoever drives a motor vehicle. Not asked for a store's own deliveries: the store's declaration stands in for it there.",
    es: 'La licencia de conducir vigente de quien conduce un vehículo de motor. No se pide para las entregas de una tienda: ahí la sustituye la declaración de la tienda.',
};
const US_INSURANCE = {
    en: "The valid insurance policy of each motor vehicle they work with. Not asked for a store's own deliveries: the store's declaration stands in for it there.",
    es: 'La póliza de seguro vigente de cada vehículo de motor con el que trabaja. No se pide para las entregas de una tienda: ahí la sustituye la declaración de la tienda.',
};

const LICENCE_NOTHING_SENT = {
    id: 'driver_license',
    requirementKey: 'driver_license',
    bucket: 'currently_due',
    cause: 'missing',
    evidence: 'document',
    explanation: US_LICENCE,
    documentType: 'driver_licence',
    capture: { pages: 2, pdf: true },
    versions: [],
};

const INSPECTION_DUE_SOON = {
    id: 'lhmawbh2rCiMmzcoY5Om.vehicle_inspection',
    requirementKey: 'vehicle_inspection',
    vehicleId: 'lhmawbh2rCiMmzcoY5Om',
    vehicle: HONDA,
    bucket: 'eventually_due',
    cause: 'expiring_within_notice',
    evidence: 'document',
    expiresAt: 1795478400000,
    label: { en: 'Annual vehicle safety inspection', es: 'Inspección anual de seguridad del vehículo' },
    explanation: {
        en: 'The current Massachusetts safety inspection of each vehicle they drive passengers in, done every year at an RMV-licensed station.',
        es: 'La inspección de seguridad vigente de Massachusetts de cada vehículo con el que lleva pasajeros, hecha cada año en una estación autorizada por el RMV.',
    },
    documentType: 'state_safety_inspection_report',
    capture: ONE_PAGE,
    versions: [
        {
            versionId: '6WoqFfmibiFIgv6Ko6nh',
            verification: { status: 'verified' },
            expires_at: '2026-11-23',
            scan: { status: 'clean' },
            submittedTime: 1793249082020,
        },
    ],
};

const INSURANCE_WITH_HISTORY = {
    id: 'lhmawbh2rCiMmzcoY5Om.vehicle_insurance',
    requirementKey: 'vehicle_insurance',
    vehicleId: 'lhmawbh2rCiMmzcoY5Om',
    vehicle: HONDA,
    bucket: null,
    cause: 'satisfied',
    evidence: 'document',
    expiresAt: 1893456000000,
    explanation: US_INSURANCE,
    documentType: 'insurance',
    capture: ONE_PAGE,
    versions: [
        {
            versionId: '3p9wgxM49qaibuOFC9KT',
            verification: { status: 'verified' },
            expires_at: '2029-12-31',
            scan: { status: 'clean' },
            submittedTime: 1793249519602,
        },
        {
            versionId: 'VjNKwrsZCIt1uEiYJS1F',
            verification: { status: 'unverified', details_code: 'document_not_readable' },
            scan: { status: 'clean' },
            supersededBy: '3p9wgxM49qaibuOFC9KT',
            submittedTime: 1793249040678,
        },
    ],
};

const INSURANCE_JUST_SENT = {
    id: 'krb6NkPk2R9LLukYD1bj.vehicle_insurance',
    requirementKey: 'vehicle_insurance',
    vehicleId: 'krb6NkPk2R9LLukYD1bj',
    vehicle: CIVIC,
    bucket: 'currently_due',
    cause: 'missing',
    evidence: 'document',
    explanation: US_INSURANCE,
    documentType: 'insurance',
    capture: ONE_PAGE,
    versions: [
        {
            versionId: 'kOFizggUFsNliTITk3fW',
            verification: { status: 'pending' },
            scan: { status: 'pending' },
            submittedTime: 1793675729952,
        },
    ],
};

const DPU_CERTIFICATE = {
    id: 'ma_dpu_clearance_certificate',
    requirementKey: 'ma_dpu_clearance_certificate',
    bucket: null,
    cause: 'satisfied',
    evidence: 'document',
    expiresAt: 1893456000000,
    label: { en: 'DPU background check clearance certificate', es: 'Certificado de antecedentes del DPU' },
    explanation: {
        en: 'The certificate the Massachusetts Department of Public Utilities issues once it has checked their criminal, sex offender and driving records.',
        es: 'El certificado que emite el Departamento de Servicios Públicos de Massachusetts tras revisar sus antecedentes penales, de delitos sexuales y de manejo.',
    },
    documentType: 'ma_dpu_clearance_certificate',
    capture: ONE_PAGE,
    versions: [
        {
            versionId: 'yzu7Y8MIxmmwb7jHFseI',
            verification: { status: 'verified' },
            expires_at: '2029-12-31',
            scan: { status: 'clean' },
            submittedTime: 1793249092768,
        },
    ],
};

// The subtitle is the host's: the app names the vehicle and where the requirement stands, but not `missing` (its add
// control says it; owner, 2026-11-03). The stories say it the same way.
const subtitleOf = (item) =>
    interpunct([
        item.vehicle ? formatVehicleValue(vehicleValueParts(item.vehicle), localized) : null,
        item.cause === REQUIREMENT_CAUSE.MISSING ? null : statusLabel('requirement_cause', item.cause),
    ]);

const pane = { padding: MD3LightTheme.spacing.x4, gap: MD3LightTheme.spacing.x2 };

// The app's document screen: the card with its capture, then the versions.
const Screen = ({ item }) => (
    <ScrollView contentContainerStyle={pane}>
        <DocumentCaptureCard item={item} subtitle={subtitleOf(item)} onCapture={() => {}} />
        <DocumentVersionList versions={item.versions} accessibilityLabel={requirementTitle(item)} />
    </ScrollView>
);

export const LicenceNothingSent = () => <Screen item={LICENCE_NOTHING_SENT} />;

export const InspectionDueSoonMassachusetts = () => <Screen item={INSPECTION_DUE_SOON} />;

export const InsuranceWithHistory = () => <Screen item={INSURANCE_WITH_HISTORY} />;

export const InsuranceJustSent = () => <Screen item={INSURANCE_JUST_SENT} />;

export const MassachusettsOnlyCertificate = () => <Screen item={DPU_CERTIFICATE} />;

// What the console shows of it («Así lo ve el socio»): the card reads, nothing is sent.
export const ReadOnlyInTheConsole = () => (
    <View style={pane}>
        <DocumentRequirementCard item={INSURANCE_WITH_HISTORY} subtitle={subtitleOf(INSURANCE_WITH_HISTORY)} />
        <DocumentVersionList
            versions={INSURANCE_WITH_HISTORY.versions}
            accessibilityLabel={requirementTitle(INSURANCE_WITH_HISTORY)}
        />
    </View>
);

// The front of a licence taken and waiting for the back. The cover is the partner's own photo, which a story does
// not have: an empty one shows where it goes.
export const LicenceFrontTaken = () => (
    <View style={pane}>
        <DocumentRequirementCard
            item={LICENCE_NOTHING_SENT}
            cover="data:,"
            note={localized('documentAddBackPrompt')}
            actions={[
                { label: localized('cancel'), onPress: () => {} },
                { label: localized('documentAddBack'), onPress: () => {} },
            ]}
        />
    </View>
);
