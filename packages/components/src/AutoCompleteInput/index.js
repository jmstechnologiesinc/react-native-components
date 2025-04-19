import React, { useRef, useEffect } from 'react';
import { GooglePlacesAutocomplete } from '@jmstechnologiesinc/react-native-google-places-autocomplete';
import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';
import { Config } from '../Config';

const AutoCompleteInput = ({ title, locationPermissionStatus, onPress, onFocus, value = "", onBlur, isLoading, placeholder, onClear, onCallMapPicker, predefinedPlaces = true, showMapPicker = false, showGps = true }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current || isLoading) {
      ref.current.setAddressText(value);
    }

  }, [value, isLoading]);



  return (
    <ScreenWrapper.Section title={localized(title)}>
      <GooglePlacesAutocomplete
        ref={ref}
        predefinedPlaces={
          locationPermissionStatus || !predefinedPlaces
            ? []
            : [
              {
                description: localized('useGPSLocation'),
                isPredefinedPlace: true,
              },
            ]
        }
        predefinedPlacesAlwaysVisible
        showMapPicker={showMapPicker}
        onCallMapPicker={onCallMapPicker}
        placeholder={placeholder}
        onPress={onPress}
        onClear={onClear}
        textInputProps={{
          onFocus: () => {
            onFocus(false);
          },
          onBlur: () => {
            onFocus(false);
            onBlur?.(false);
          },
        }}
        query={{
          key: Config.GOOGLE_GEO_CODER_PLACE_API,
          components: 'country:us|country:pa|country:do',
          types: 'geocode|establishment',
        }}
        requestUrl={{
          url: `${Config.CORS_PROXY_DISPATCHER_APP}`,
          useOnPlatform: 'web',
        }}
        listViewDisplayed="true"
        returnKeyType="search"
        fetchDetails={false}
        autoFillOnNotFound={true}
        showGps={showGps}
      />
    </ScreenWrapper.Section>
  );
};

export default AutoCompleteInput;
