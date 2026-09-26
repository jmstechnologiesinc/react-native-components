import React, { useState } from 'react';
import { View } from 'react-native';

import { Text } from '@jmstechnologiesinc/react-native-paper';

import DocumentViewer from './DocumentViewer';

export default {
    title: 'packages/DocumentViewer',
};

const frame = { height: 480 };

const IMAGE = { uri: 'https://reactnative.dev/img/tiny_logo.png', mimeType: 'image/png' };

const SIDES = [
    { value: 'front', label: 'Front' },
    { value: 'back', label: 'Back' },
];

export const ImageDocument = () => (
    <View style={frame}>
        <DocumentViewer source={IMAGE} />
    </View>
);

export const SidesAndPages = () => {
    const [page, setPage] = useState(1);
    return (
        <View style={frame}>
            <DocumentViewer source={IMAGE} sides={SIDES} pageCount={3} page={page} onPageChange={setPage} />
        </View>
    );
};

// The host injects what the default renderer cannot draw (a PDF page, on the
// web with `react-pdf`); this stands in for it.
export const InjectedRenderer = () => (
    <View style={frame}>
        <DocumentViewer
            source={{ uri: 'https://example.com/insurance.pdf', mimeType: 'application/pdf' }}
            pageCount={2}
            renderDocument={({ page, rotation }) => <Text>{`PDF page ${page}, rotated ${rotation}°`}</Text>}
            footer={<Text variant="bodySmall">Uploaded 2026-09-22</Text>}
        />
    </View>
);

export const PreviewUnavailable = () => (
    <View style={frame}>
        <DocumentViewer source={{ uri: 'https://example.com/insurance.pdf', mimeType: 'application/pdf' }} />
    </View>
);

export const Empty = () => (
    <View style={frame}>
        <DocumentViewer />
    </View>
);
