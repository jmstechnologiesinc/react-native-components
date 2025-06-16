import React, { useRef, useMemo, useCallback } from "react";

import BottomSheet, { BottomSheetFooter } from "@jmstechnologiesinc/bottom-sheet";
import { localized, LocationListItem, LOCATION_LIST_ITEM, } from '@jmstechnologiesinc/react-native-components';

import { MD3LightTheme, ProgressBar, Button } from "@jmstechnologiesinc/react-native-paper";
import { moderateScale } from "@jmstechnologiesinc/react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  styles as JMSStyles
} from '@jmstechnologiesinc/react-native-components';


const AddressSelectionSheet = ({
  currentMapAdress,
  onSaveLocation,
  isLoading,
  buttonWithBottomInset = true
}) => {

  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%"], []);
  const insets = useSafeAreaInsets();
  const isInsetsBottom = insets.bottom === 0 ? MD3LightTheme.spacing.x4 : insets.bottom;
  const isDisabled = currentMapAdress?.formattedAddress === undefined || isLoading === true



  const containerStyle = [
    {
      paddingTop: insets.top,
      paddingBottom: isInsetsBottom,
      paddingLeft: insets.left,
      paddingRight: insets.left,
      marginTop: insets.top,
    },
  ];

  const renderFooter = useCallback(
    props => (
      <BottomSheetFooter {...props} bottomInset={24}>
        <Button
          loading={isLoading}
          disabled={isDisabled}
          mode="contained"
          onPress={onSaveLocation}
          style={[JMSStyles.button, buttonWithBottomInset ? JMSStyles.buttonWithInset : null]}
        >
          {localized('confirmYourLocation')}
        </Button>
      </BottomSheetFooter>
    ),
    [isLoading, isDisabled, currentMapAdress]
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
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
      footerComponent={renderFooter}

    >
      {isLoading ? (

        <>

          <ProgressBar
            indeterminate
            style={{
              position: 'absolute',
              left: MD3LightTheme.spacing.x4,
              right: MD3LightTheme.spacing.x4,
              top: MD3LightTheme.spacing.x10
            }}
          />
        </>

      ) :
        <LocationListItem
          title={currentMapAdress?.formattedAddress || localized("markYourCurrentLocation")}
          variant={LOCATION_LIST_ITEM.currentLocation}
          isShowRightIcon={false}
        />
      }
    </BottomSheet>

  );
};



export default AddressSelectionSheet;