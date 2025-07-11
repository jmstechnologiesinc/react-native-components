import React, { useRef, useEffect } from 'react';
import { GooglePlacesAutocomplete } from '@jmstechnologiesinc/react-native-google-places-autocomplete';
import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';
import { Config } from '../Config';

const AutoCompleteInput = ({
    title,
    placeholder,
    icon,
    value = '',
    predefinedPlaces = true,
    showMapPicker = false,
    showGps = true,
    onPress,
    onFocus,
    onBlur,
    onClear,
    locationPermissionStatus,
    onCallMapPicker,
}) => {
    const ref = useRef(null);

    useEffect(() => {
        ref.current.setAddressText(value);
    }, [value]);

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
                icon={icon}
                placeholder={placeholder}
                onPress={onPress}
                onClear={onClear}
                textInputProps={{
                    onFocus: () => {
                        onFocus?.();
                    },
                    onBlur: () => {
                        onBlur?.();
                    },
                }}
                query={{
                    key: 'AIzaSyB7XFmNF8g4EPEKw7nT1purhTEtv-sJxEs',
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
                showMapPicker={showMapPicker}
                onCallMapPicker={onCallMapPicker}
            />
        </ScreenWrapper.Section>
    );
};

export default AutoCompleteInput;
