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

    // The places library clears its suggestions whenever `predefinedPlaces` changes identity, so the list keeps its
    // identity across renders: a new array on every render erased the suggestions when a screen re-rendered on the
    // input's blur, before a click on the web reached the row (daxir-qa #336).
    const isGpsPlaceShown = !locationPermissionStatus && Boolean(predefinedPlaces);
    const gpsPlaceDescription = localized('useGPSLocation');
    const gpsPlaces = useMemo(
        () => (isGpsPlaceShown ? [{ description: gpsPlaceDescription, isPredefinedPlace: true }] : []),
        [isGpsPlaceShown, gpsPlaceDescription]
    );

    return (
        <ScreenWrapper.Section title={localized(title)}>
            <GooglePlacesAutocomplete
                ref={ref}
                predefinedPlaces={gpsPlaces}
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
                // Places API (New) Autocomplete, on the phone and on the web alike: it answers browsers directly, so no
                // proxy. The host's key (Config: react-native-config on the phone, configureComponents on the web),
                // never one written here: each environment restricts its own.
                query={{
                    key: Config.GOOGLE_GEO_CODER_PLACE_API,
                    components: 'country:us|country:pa|country:do',
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
