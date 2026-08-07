import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Dimensions } from 'react-native';
import { useSharedValue, useDerivedValue } from 'react-native-reanimated';

import AnimatedCrosshairsGpsIcon from './AnimatedCrosshairsGpsIcon';
import { AnimatedBottomSheet, MIDDLE_SNAP_POINT } from './AnimatedBottomSheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const GorhomBottomSheetWrapper = forwardRef(
    (
        {
            name,
            topInset,
            snapPointIndex,
            snapPoints,
            isCrosshairsGpsIconVisible = true,
            backdropAppearsOnIndex,
            backdropDisappearsOnIndex,
            isBackDropEnable,
            footerComponent,
            enableDynamicSizing,
            onCrosshairsGpsPress,
            onAnimatedPositionChange,
            children,
        },
        ref
    ) => {
        const animatedBottomSheetRef = useRef();

        const animatedBottomSheetIndex = useSharedValue(0);
        const animatedBottomSheetPosition = useSharedValue(SCREEN_HEIGHT);

        const crosshairsGpsIconAnimatedIndex = useDerivedValue(() => animatedBottomSheetIndex.value);
        const crosshairsGpsIconAnimatedPosition = useDerivedValue(() => animatedBottomSheetPosition.value);

        useImperativeHandle(ref, () => ({
            getAnimatedPositionBeforeMiddleSnapPoint,
            snapToIndex: animatedBottomSheetRef.current.snapToIndex,
            close: animatedBottomSheetRef.current.close,
            collapse: animatedBottomSheetRef.current.collapse,
            expand: animatedBottomSheetRef.current.expand,
            getCurrentSnapIndex: () => animatedBottomSheetIndex.value,
        }));

        // How much of the screen the sheet covers from the bottom.
        //
        // The value is CLAMPED, not dropped. The previous guard returned
        // without invoking the callback at all once the sheet passed the
        // middle snap point (75% of the screen on iOS, and the snap points are
        // 50/75/100%). Two consequences, both reported as bugs:
        //   - the camera kept whatever padding it had from the last update
        //     below the boundary, so expanding the sheet left the map framed
        //     for the old, shorter sheet and content ended up hidden;
        //   - the crosshairs/reset button was completely dead while expanded,
        //     because its press runs through this same helper.
        // Callers open this sheet at index 1 (= 75%), i.e. exactly ON the old
        // boundary, so the dead state was the normal state.
        // Clamping keeps every consumer in sync at every snap point while
        // still never reporting a padding larger than the map can usefully
        // fit content into.
        const getAnimatedPositionBeforeMiddleSnapPoint = (callback) => {
            const position = SCREEN_HEIGHT - crosshairsGpsIconAnimatedPosition.value;
            callback(Math.min(Math.max(position, 0), MIDDLE_SNAP_POINT));
        };

        const onchange = () => {
            if (onAnimatedPositionChange) {
                getAnimatedPositionBeforeMiddleSnapPoint(onAnimatedPositionChange);
            }
        };

        const crosshairsGpsIconPress = () => {
            if (onCrosshairsGpsPress) {
                getAnimatedPositionBeforeMiddleSnapPoint(onCrosshairsGpsPress);
            }
        };

        return (
            <>
                {isCrosshairsGpsIconVisible ? (
                    <AnimatedCrosshairsGpsIcon
                        animatedIndex={crosshairsGpsIconAnimatedIndex}
                        animatedPosition={crosshairsGpsIconAnimatedPosition}
                        onPress={crosshairsGpsIconPress}
                    />
                ) : null}

                <AnimatedBottomSheet
                    name={name}
                    topInset={topInset}
                    ref={animatedBottomSheetRef}
                    snapPointIndex={snapPointIndex}
                    snapPoints={snapPoints}
                    enableDynamicSizing={enableDynamicSizing}
                    backdropAppearsOnIndex={backdropAppearsOnIndex}
                    isBackDropEnable={isBackDropEnable}
                    backdropDisappearsOnIndex={backdropDisappearsOnIndex}
                    animatedIndex={animatedBottomSheetIndex}
                    animatedPosition={animatedBottomSheetPosition}
                    enablePanDownToClose={true}
                    footerComponent={footerComponent}
                    onChange={onchange}
                >
                    {children}
                </AnimatedBottomSheet>
            </>
        );
    }
);

export default GorhomBottomSheetWrapper;
