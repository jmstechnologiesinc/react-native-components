import React, { useCallback, useMemo, useRef } from "react";
import BottomSheet from "@jmstechnologiesinc/bottom-sheet";
import { MD3LightTheme } from "@jmstechnologiesinc/react-native-paper";
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters'

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";

const GorhomBottomSheetWrapper = ({
    footerComponent,
    withBottomInset = true,
    withTopInset = false,
    snapPointIndex = 0,
    onChange,
    onLayoutHeight,
    children
}) => {
    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(() => ["50", "75", "100"], []);

    const bottomSheetRef = useRef();

    const isInsetsBottom = insets.bottom === 0 ? MD3LightTheme.spacing.x4 : insets.bottom;

    const containerStyle = [
        {
            paddingTop: withTopInset ? insets.top : 0,
            paddingBottom: withBottomInset ? isInsetsBottom : 0,
            paddingLeft: insets.left,
            paddingRight: insets.left,
            marginTop: insets.top,

        },
    ];

    const handleSheetChange = useCallback((index) => {
        if (typeof index !== 'number' || !snapPoints[index]) return;

        const raw = snapPoints[index].replace('%', '');    
        const percent = parseFloat(raw);      
        if (isNaN(percent)) return;  
        onChange?.(percent / 100);
    }, [snapPoints]);

    return (
        <BottomSheet
        onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            onLayoutHeight(height);
        }}
            ref={bottomSheetRef}
            index={snapPointIndex}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            footerComponent={footerComponent}
            containerStyle={containerStyle}
            backgroundStyle={{
                flex: 1,
                backgroundColor: MD3LightTheme.colors.background,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: moderateScale(2),
                },
                shadowOpacity: moderateScale(0.25),
                shadowRadius: moderateScale(3.84),
                elevation: moderateScale(10),
            }}
            handleStyle={{
                backgroundColor: MD3LightTheme.colors.background,
            }}
            onChange={handleSheetChange}>
                <View >
                    {children}
                </View>
        </BottomSheet>
    );
};

export default GorhomBottomSheetWrapper;
