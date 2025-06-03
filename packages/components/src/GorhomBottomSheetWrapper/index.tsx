import React, {forwardRef, useImperativeHandle, useRef } from 'react';
import { Dimensions } from 'react-native';
import { useSharedValue, useDerivedValue } from 'react-native-reanimated';

import AnimatedCrosshairsGpsIcon from './AnimatedCrosshairsGpsIcon';
import { AnimatedBottomSheet, MIDDLE_SNAP_POINT } from './AnimatedBottomSheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const GorhomBottomSheetWrapper = forwardRef(({
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
  children
}, ref) => {
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
    expand: animatedBottomSheetRef.current.expand
  }));

  const getAnimatedPositionBeforeMiddleSnapPoint = (callback) => {
    if(SCREEN_HEIGHT - crosshairsGpsIconAnimatedPosition.value < MIDDLE_SNAP_POINT) {
      callback(SCREEN_HEIGHT - crosshairsGpsIconAnimatedPosition.value);
    }
  }

  const onchange = () => {
    if(onAnimatedPositionChange) {
      getAnimatedPositionBeforeMiddleSnapPoint(onAnimatedPositionChange);
    }
  }

  const crosshairsGpsIconPress = () => {
    if(onCrosshairsGpsPress) {
      getAnimatedPositionBeforeMiddleSnapPoint(onCrosshairsGpsPress);
    }
  }

  return (
    <>
     {isCrosshairsGpsIconVisible ? (
        <AnimatedCrosshairsGpsIcon
          animatedIndex={crosshairsGpsIconAnimatedIndex}
          animatedPosition={crosshairsGpsIconAnimatedPosition}
          onPress={crosshairsGpsIconPress} />
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
        onChange={onchange}>
          {children}
      </AnimatedBottomSheet>
    </>
  );
});

export default GorhomBottomSheetWrapper;
