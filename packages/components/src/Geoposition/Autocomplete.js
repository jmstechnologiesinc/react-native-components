import React, { useState, useEffect } from 'react';

import { Keyboard, Platform, Pressable } from 'react-native';
import { AppLifecycle } from 'react-native-applifecycle';
import { checkAndAskForPermission, gpsLocation } from '.';
import { Banner, List } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization'
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper'
import AutoCompleteInput from '../AutoCompleteInput'

import { LocationListItem, interpunctLocationListItemDescription } from '../LocationListItem/LocationListItem';

import RecentLocations from './RecentLocations';

const Autocomplete = ({
    originAutoCompleteInputTitle,
    dropoffAutoCompleteInputTitle,
    currentLocationTitle,
    recentLocationTitle,
    originLocation,
    dropoffLocation,
    currentLocation,
    recentLocations,
    isCurrentLocationVisible,
    isRecentLocationVisible,
    isDropoffLocationInputVisible,
    onRecentLocationPress,
    onOriginLocationPress,
    onDropoffLocationPress,
    onFailure,
    onAskForPermission,
    isLoading
}) => {

    const [isFocused, setIsFocused] = useState(false);
    const [isLocationPermissionDenied, setPermissions] = useState(false);
    const [isOriginFocused, setIsOriginFocused] = useState(false);
    const [isShowRecentLocation, setIsShowRecentLocation] = useState(isRecentLocationVisible)

    const togglePermisionWarning = () => {
        checkAndAskForPermission()
            .then(() => {
                setPermissions(false);
            })
            .catch(() => {
                setPermissions(true);
            });
    };

    useEffect(() => {
        togglePermisionWarning();
        const listener = AppLifecycle.addEventListener('change', (state) => {
            console.log(state);
            togglePermisionWarning();
        });

        return () => listener.remove();
    }, []);

    const processAutoCompleteInput = async (data, onLocationPress) => {
        if (data.isPredefinedPlace) {
            try {
                await checkAndAskForPermission();
                const {
                    coords: { latitude, longitude },
                } = await gpsLocation();
                onLocationPress({ latitude, longitude });
            } catch (error) {
                onFailure();
            }
        } else {
            onLocationPress(data.description);
        }
    };

    const onOriginAutoCompleteInputPress = (data) => processAutoCompleteInput(data, onOriginLocationPress);

    const onDropoffAutoCompleteInputPress = (data) => processAutoCompleteInput(data, onDropoffLocationPress);



    const onFocus = (value) => {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
            setIsFocused(value);
        }
    };

    const onRecentLocation = (data) => {
        onRecentLocationPress(data)
        Keyboard.dismiss()
    }

    return (
        <>
            {isLocationPermissionDenied === true ? (
                <Banner
                    visible={true}
                    actions={[
                        {
                            label: localized('goToSettings'),
                            onPress: onAskForPermission,
                        },
                    ]}
                >
                    {localized('appRequiresGeolocation')}
                </Banner>
            ) : null}

            <ScreenWrapper withScrollView={true} keyboardShouldPersistTaps={'handled'}>

                <ScreenWrapper.Container style={{ flex: isFocused === true ? 1 : null }} >
                    <Pressable
                        onPress={() => {
                            setIsOriginFocused(false);
                            setIsShowRecentLocation(true)
                            Keyboard.dismiss()

                        }}
                    >
                        <AutoCompleteInput
                            title={originAutoCompleteInputTitle}
                            locationPermissionStatus={isLocationPermissionDenied}
                            onPress={onOriginAutoCompleteInputPress}
                            onFocus={(value) => {
                                onFocus(value)
                                setIsOriginFocused(true);
                                setIsShowRecentLocation(false)
                            }}
                            value={originLocation?.formattedAddress}
                            onBlur={() => {
                                setIsOriginFocused(false)
                                setIsShowRecentLocation(true)
                            }}
                            isFocused={isOriginFocused}
                            isLoading={isLoading}
                            placeholder="Starting point"
                        />
                    </Pressable>

                    {isDropoffLocationInputVisible && !isOriginFocused ? (
                        <AutoCompleteInput
                            title={dropoffAutoCompleteInputTitle}
                            locationPermissionStatus={isLocationPermissionDenied}
                            onPress={onDropoffAutoCompleteInputPress}
                            onFocus={(value) => {
                                onFocus(value)

                            }}
                            onBlur={() => { setIsShowRecentLocation(true) }}
                            value={dropoffLocation?.formattedAddress}
                            isLoading={isLoading}
                            placeholder="Where are you going?"
                        />
                    ) : null}
                </ScreenWrapper.Container>

                {isCurrentLocationVisible && isFocused === false && currentLocation?.id ? (
                    <List.Section title={localized(currentLocationTitle)}>
                        <LocationListItem
                            title={currentLocation?.formattedAddress}
                            description={interpunctLocationListItemDescription(currentLocation)}
                            variant="currentLocation"
                        />
                    </List.Section>
                ) : null}

                {isShowRecentLocation && isFocused === false && recentLocations?.length > 0 ? (
                    <RecentLocations
                        title={recentLocationTitle}
                        locations={recentLocations}
                        onPress={onRecentLocation}
                    />
                ) : null}
            </ScreenWrapper>
        </>
    );
};

export default Autocomplete;
