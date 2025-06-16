    import React from 'react';
import { View } from 'react-native';
import { IconButton, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import {LOCATION_LIST_ITEM, LOCATION_LIST_ITEM_MAPPING} from '../LocationListItem/LocationListItem'
const MapboxGLWrapperLocationSelectorPin = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -41 }, { translateY: -56 }],
        zIndex: 0,
      }}
    >
      <IconButton
        icon={LOCATION_LIST_ITEM_MAPPING[LOCATION_LIST_ITEM.mapMarkerCheckOutline]}
        size={MD3LightTheme.spacing.x12}
        iconColor={MD3LightTheme.colors.primary}
      />
    </View>
  );
};

export default MapboxGLWrapperLocationSelectorPin;
