import React, { useRef, useEffect, useMemo } from 'react';
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

    // Must keep a stable identity: GooglePlacesAutocomplete wipes its result rows in an effect
    // keyed on this prop. A new array literal per render made every parent re-render clear the
    // suggestions -- on web the blur that a row's mousedown causes re-renders the parent before
    // mouseup, so the row unmounted mid-click and the address could never be selected.
    const memoizedPredefinedPlaces = useMemo(
        () =>
            locationPermissionStatus || !predefinedPlaces
                ? []
                : [
                      {
                          description: localized('useGPSLocation'),
                          isPredefinedPlace: true,
                      },
                  ],
        [locationPermissionStatus, predefinedPlaces]
    );

    return (
        <ScreenWrapper.Section title={localized(title)}>
            <GooglePlacesAutocomplete
                ref={ref}
                predefinedPlaces={memoizedPredefinedPlaces}
                predefinedPlacesAlwaysVisible
                icon={icon}
                placeholder={placeholder}
                onPress={onPress}
                onClear={onClear}
                textInputProps={{
                    autoCapitalize: 'none',
                    autoCorrect: false,
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
