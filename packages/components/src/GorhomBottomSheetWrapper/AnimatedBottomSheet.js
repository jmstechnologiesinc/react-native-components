import React, { forwardRef, useCallback, useMemo } from 'react';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const screenHeight = Dimensions.get('window').height;
export const MIDDLE_SNAP_POINT = screenHeight * 0.75;

const SNAP_POINTS = ['50%', '75%', '100%'];

export const AnimatedBottomSheet = forwardRef(
    (
        {
            name,
            topInset,
            snapPointIndex = 0,
            snapPoints = SNAP_POINTS,
            enableDynamicSizing = false,
            animatedIndex,
            animatedPosition,
            backdropAppearsOnIndex = 2,
            backdropDisappearsOnIndex = 1,
            isBackDropEnable = false,
            footerComponent,
            onChange,
            children,
        },
        ref
    ) => {
        const insets = useSafeAreaInsets();

        const sheetStyle = useMemo(
            () => ({
                ...styles.sheetContainer,
                ...styles.sheetContainerShadow,
            }),
            []
        );

        const renderBackdrop = useCallback(
            (props) =>
                isBackDropEnable ? (
                    <BottomSheetBackdrop
                        {...props}
                        enableTouchThrough={true}
                        pressBehavior="none"
                        appearsOnIndex={backdropAppearsOnIndex}
                        disappearsOnIndex={backdropDisappearsOnIndex}
                    />
                ) : null,
            [isBackDropEnable]
        );

        return (
            <BottomSheet
                name={name}
                ref={ref}
                enableDismissOnClose={false}
                enablePanDownToClose={false}
                topInset={topInset || insets.top}
                index={snapPointIndex}
                snapPoints={snapPoints}
                enableDynamicSizing={enableDynamicSizing}
                animatedPosition={animatedPosition}
                animatedIndex={animatedIndex}
                footerComponent={footerComponent}
                backdropComponent={renderBackdrop}
                backgroundStyle={styles.backgroundStyle}
                style={sheetStyle}
                onChange={onChange}
            >
                {children}
            </BottomSheet>
        );
    }
);

const styles = StyleSheet.create({
    backgroundStyle: {
        backgroundColor: MD3LightTheme.colors.background,
    },
    sheetContainer: {
        borderTopStartRadius: 24,
        borderTopEndRadius: 24,
    },
    sheetContainerShadow: Platform.select({
        ios: {
            shadowOffset: {
                width: 0,
                height: 12,
            },
            shadowOpacity: 0.75,
            shadowRadius: 16.0,
            shadowColor: '#000',
        },
        android: {
            elevation: 24,
        },
        web: {
            boxShadow: '0px -4px 16px rgba(0,0,0, 0.25)',
        },
    }),
});
