import React, { forwardRef, useCallback, useMemo } from 'react';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetFooter,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { HeaderHandle } from './HeaderHandle';

const screenHeight = Dimensions.get('window').height;
export const MIDDLE_SNAP_POINT = screenHeight * 0.75;

const SNAP_POINTS = ['50%', '75%', '100%'];

const AnimatedModalBottomSheet = forwardRef(
    (
        {
            snapPointIndex = 0,
            snapPoints = SNAP_POINTS,
            enableDynamicSizing = false,
            animatedIndex,
            animatedPosition,
            appearsOnIndex = 2,
            disappearsOnIndex = 1,
            footerComponent,
            onChange,
            children,
        },
        ref
    ) => {
        const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();

        return (
            <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={ref}
                    enableDismissOnClose={false}
                    enablePanDownToClose={false}
                    animatedPosition={animatedPosition}
                    animatedIndex={animatedIndex}
                    index={snapPointIndex}
                    snapPoints={snapPoints}
                    enableDynamicSizing={true}
                    topInset={topInset}
                    bottomInset={bottomInset}
                    style={styles.sheetContainer}
                    backgroundComponent={null}
                    footerComponent={footerComponent}
                    // detached={true}
                    onChange={onChange}
                >
                    <BottomSheetView style={styles.contentContainerStyle} enableFooterMarginAdjustment={true}>
                        {children}
                        {children}
                    </BottomSheetView>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    sheetContainer: {
        marginHorizontal: 8,
        backgroundColor: MD3LightTheme.colors.background,
        borderTopStartRadius: 24,
        borderTopEndRadius: 24,
        elevation: 24,
    },
    contentContainerStyle: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingHorizontal: 12,
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
        padding: 6,
        marginBottom: 12,
        borderRadius: 24,
        backgroundColor: '#80f',
    },
    footerText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default AnimatedModalBottomSheet;
