import React, { useState } from 'react';

import { Provider } from '@jmstechnologiesinc/react-native-paper';

import DecisionDialog from './DecisionDialog';

export default {
    title: 'packages/DecisionDialog',
};

const REASONS = [
    { value: 'document_expired', label: 'Expired', description: 'The expiry date has passed' },
    { value: 'document_not_readable', label: 'Not readable' },
    { value: 'document_name_mismatch', label: 'Name does not match' },
];

// The dialog renders in a `Portal`, which needs Paper's provider as its host.
const Host = ({ children }) => <Provider>{children}</Provider>;

export const Reject = () => {
    const [reason, setReason] = useState();
    const [note, setNote] = useState('');
    return (
        <Host>
            <DecisionDialog
                visible
                title="Reject driver license"
                description="The partner is asked to upload it again."
                options={REASONS}
                selectedOption={reason}
                onSelectOption={setReason}
                note={{ label: 'Note to the partner', value: note, onChangeText: setNote, required: true }}
                confirmLabel="Reject"
                confirmTone="danger"
                onConfirm={() => {}}
                onDismiss={() => {}}
            />
        </Host>
    );
};

export const Verify = () => (
    <Host>
        <DecisionDialog
            visible
            title="Verify vehicle insurance"
            summary="Policy 88-123-456, valid until 2027-03-01"
            confirmLabel="Verify"
            onConfirm={() => {}}
            onDismiss={() => {}}
        />
    </Host>
);

export const Busy = () => (
    <Host>
        <DecisionDialog
            visible
            title="Deactivate partner"
            options={REASONS}
            selectedOption="document_expired"
            confirmLabel="Deactivate"
            confirmTone="danger"
            busy
            onConfirm={() => {}}
            onDismiss={() => {}}
        />
    </Host>
);

export const ServerError = () => (
    <Host>
        <DecisionDialog
            visible
            title="Reject driver license"
            note={{
                label: 'Note to the partner',
                value: '',
                onChangeText: () => {},
                required: true,
                error: 'A note is required for this decision',
            }}
            confirmLabel="Reject"
            confirmTone="danger"
            onConfirm={() => {}}
            onDismiss={() => {}}
        />
    </Host>
);
