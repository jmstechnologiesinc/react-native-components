import React, { useRef, useEffect } from 'react';
import { GooglePlacesAutocomplete } from '@jmstechnologiesinc/react-native-google-places-autocomplete';
import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';
import { Config } from '../Config';
import { Keyboard } from 'react-native';

const AutoCompleteInput = ({ title, locationPermissionStatus, onPress, onFocus, value, onBlur, isFocused }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (value) {
      ref.current.setAddressText(value);
    }
    if (!isFocused) {
      console.log(isFocused)
      Keyboard.dismiss();

      ref.current?.clear();
    }

  }, [value, isFocused]);

  return (
    <ScreenWrapper.Section title={localized(title)}>

      <GooglePlacesAutocomplete
        ref={ref}
        predefinedPlaces={
          locationPermissionStatus
            ? []
            : [
              {
                description: localized('useGPSLocation'),
                isPredefinedPlace: true,
              },
            ]
        }
        predefinedPlacesAlwaysVisible
        onPress={onPress}
        textInputProps={{
          onFocus: () => {
            onFocus(true);
          },
          onBlur: () => {
            onFocus(false);
            onBlur?.(false)
            ref.current?.clear();
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
      />
    </ScreenWrapper.Section>
  );
};

export default AutoCompleteInput;
