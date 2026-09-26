import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { IconButton, List, SegmentedButtons, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { currentLocale, localized } from '../Localization/Localization';

export const ZOOM = Object.freeze({ min: 0.5, max: 4, step: 0.25, initial: 1 });

const ROTATION_STEP = 90;

const ICONS = Object.freeze({
    zoomOut: 'magnify-minus-outline',
    zoomIn: 'magnify-plus-outline',
    resetZoom: 'fit-to-screen-outline',
    rotate: 'rotate-right',
    previousPage: 'chevron-left',
    nextPage: 'chevron-right',
    empty: 'file-document-outline',
});

const clampZoom = (value) => Math.min(ZOOM.max, Math.max(ZOOM.min, value));

// A value the host may control (`value` + `onChange`) or leave to the viewer:
// when `value` is undefined the viewer keeps its own state and still reports
// every change.
const useControllable = (value, onChange, initial) => {
    const [own, setOwn] = useState(initial);
    const current = value === undefined ? own : value;
    const set = (next) => {
        if (value === undefined) setOwn(next);
        onChange?.(next);
    };
    return [current, set];
};

const isImage = (source) => !source?.mimeType || source.mimeType.startsWith('image/');

const Message = ({ icon, text, theme }) => (
    <View style={styles.centered} accessibilityRole="text" accessibilityLabel={text}>
        <List.Icon icon={icon} color={theme.colors.onSurfaceVariant} />
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {text}
        </Text>
    </View>
);

/**
 * Shows one document — a page of it, one side of it — with zoom, rotation,
 * page and side controls.
 *
 * Built on RN primitives only, so it runs on the phone and on the web alike.
 * The default renderer draws images with RN `Image` and applies zoom and
 * rotation itself. What needs the DOM is INJECTED by the host:
 * - `renderDocument({ source, page, side, zoom, rotation })` draws anything the
 *   default cannot (a PDF page);
 * - `renderZoom({ children, zoom, onZoomChange })` wraps the drawing in a
 *   pan-and-pinch surface. A host that injects it owns the scaling, so the
 *   default renderer then leaves the scale to it.
 *
 * `zoom`, `rotation`, `page` and `side` are controlled when given and kept by
 * the viewer otherwise; the `on*` callbacks report every change either way.
 * `sides` is `[{ value, label }]` (front / back). `page` is 1-based.
 */
const DocumentViewer = ({
    source,
    pageCount = 1,
    page,
    onPageChange,
    sides,
    side,
    onSideChange,
    zoom,
    rotation,
    onZoomChange,
    onRotate,
    renderDocument,
    renderZoom,
    footer,
    emptyLabel,
    testID,
}) => {
    const theme = useTheme();
    const [currentZoom, setZoom] = useControllable(zoom, onZoomChange, ZOOM.initial);
    const [currentRotation, setRotation] = useControllable(rotation, onRotate, 0);
    const [currentPage, setPage] = useControllable(page, onPageChange, 1);
    const [chosenSide, setSide] = useControllable(side, onSideChange, sides?.[0]?.value);
    // `sides` may arrive after the first render, when the initial state was already taken.
    const currentSide = chosenSide ?? sides?.[0]?.value;

    const hasDocument = Boolean(source?.uri);
    const hasPages = pageCount > 1;
    const hasSides = Array.isArray(sides) && sides.length > 1;
    const zoomLabel = new Intl.NumberFormat(currentLocale(), { style: 'percent' }).format(currentZoom);

    const drawing = !hasDocument ? (
        <Message icon={ICONS.empty} text={emptyLabel ?? localized('global.noDocument')} theme={theme} />
    ) : renderDocument ? (
        renderDocument({ source, page: currentPage, side: currentSide, zoom: currentZoom, rotation: currentRotation })
    ) : isImage(source) ? (
        <Image
            source={{ uri: source.uri }}
            resizeMode="contain"
            accessibilityRole="image"
            accessibilityLabel={localized('global.document')}
            style={[
                styles.image,
                {
                    transform: [{ rotate: `${currentRotation}deg` }, { scale: renderZoom ? 1 : currentZoom }],
                },
            ]}
            testID={testID ? `${testID}-image` : undefined}
        />
    ) : (
        <Message icon={ICONS.empty} text={localized('global.previewUnavailable')} theme={theme} />
    );

    return (
        <View style={styles.container} testID={testID}>
            <View
                style={[styles.toolbar, { paddingHorizontal: theme.spacing.x2, gap: theme.spacing.x2 }]}
                accessibilityRole="toolbar"
                accessibilityLabel={localized('global.documentControls')}
            >
                <IconButton
                    icon={ICONS.zoomOut}
                    accessibilityLabel={localized('global.zoomOut')}
                    disabled={!hasDocument || currentZoom <= ZOOM.min}
                    onPress={() => setZoom(clampZoom(currentZoom - ZOOM.step))}
                    testID={testID ? `${testID}-zoom-out` : undefined}
                />
                <Text variant="labelLarge">{zoomLabel}</Text>
                <IconButton
                    icon={ICONS.zoomIn}
                    accessibilityLabel={localized('global.zoomIn')}
                    disabled={!hasDocument || currentZoom >= ZOOM.max}
                    onPress={() => setZoom(clampZoom(currentZoom + ZOOM.step))}
                    testID={testID ? `${testID}-zoom-in` : undefined}
                />
                <IconButton
                    icon={ICONS.resetZoom}
                    accessibilityLabel={localized('global.resetZoom')}
                    disabled={!hasDocument || currentZoom === ZOOM.initial}
                    onPress={() => setZoom(ZOOM.initial)}
                    testID={testID ? `${testID}-zoom-reset` : undefined}
                />
                <IconButton
                    icon={ICONS.rotate}
                    accessibilityLabel={localized('global.rotate')}
                    disabled={!hasDocument}
                    onPress={() => setRotation((currentRotation + ROTATION_STEP) % 360)}
                    testID={testID ? `${testID}-rotate` : undefined}
                />
                {hasPages ? (
                    <View style={styles.pager}>
                        <IconButton
                            icon={ICONS.previousPage}
                            accessibilityLabel={localized('global.previousPage')}
                            disabled={currentPage <= 1}
                            onPress={() => setPage(currentPage - 1)}
                            testID={testID ? `${testID}-page-previous` : undefined}
                        />
                        <Text variant="labelLarge">
                            {localized('global.pageOf', { page: currentPage, count: pageCount })}
                        </Text>
                        <IconButton
                            icon={ICONS.nextPage}
                            accessibilityLabel={localized('global.nextPage')}
                            disabled={currentPage >= pageCount}
                            onPress={() => setPage(currentPage + 1)}
                            testID={testID ? `${testID}-page-next` : undefined}
                        />
                    </View>
                ) : null}
                {hasSides ? (
                    <SegmentedButtons
                        density="small"
                        value={currentSide}
                        onValueChange={setSide}
                        buttons={sides.map((item) => ({
                            value: item.value,
                            label: item.label,
                            accessibilityLabel: `${localized('global.documentSide')}: ${item.label}`,
                            testID: testID ? `${testID}-side-${item.value}` : undefined,
                        }))}
                        style={styles.sides}
                    />
                ) : null}
            </View>
            <View style={[styles.stage, { backgroundColor: theme.colors.surfaceVariant }]}>
                {hasDocument && renderZoom
                    ? renderZoom({
                          children: drawing,
                          zoom: currentZoom,
                          onZoomChange: (next) => setZoom(clampZoom(next)),
                      })
                    : drawing}
            </View>
            {footer}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toolbar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    pager: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sides: {
        flexGrow: 0,
    },
    stage: {
        flex: 1,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default DocumentViewer;
