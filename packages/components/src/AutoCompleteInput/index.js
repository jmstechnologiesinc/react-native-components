import React, { useRef, useEffect } from 'react';
import { GooglePlacesAutocomplete } from '@jmstechnologiesinc/react-native-google-places-autocomplete';
import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';
import { Config } from '../Config';

const AutoCompleteInput = ({ title, locationPermissionStatus, onPress, onFocus, originLocation, dropoffLocation, }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (originLocation) {
      ref.current.setAddressText(originLocation);
    } else if (dropoffLocation) {
      ref.current.setAddressText(dropoffLocation);
    }
  }, [originLocation, dropoffLocation]);

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
            ref.current?.clear();
          },
        }}
        query={{
          key: Config.GOOGLE_GEO_CODER_PLACE_API,
          components: 'country:us|country:pa|country:do',
          types: 'geocode',
        }}
        requestUrl={{
          url: `${Config.CORS_PROXY_DISPATCHER_APP}`,
          useOnPlatform: 'web',
        }}
        listViewDisplayed="true"
        returnKeyType="search"
        fetchDetails={false}
      />
    </ScreenWrapper.Section>
  );
};

export default AutoCompleteInput;
