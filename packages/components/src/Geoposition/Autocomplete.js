import React, { useState, useEffect } from 'react';

import { Keyboard } from 'react-native';
import { AppLifecycle } from 'react-native-applifecycle';
import { checkAndAskForPermission, gpsLocation } from '.';
import { Banner, List } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization'
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper'
import AutoCompleteInput from '../AutoCompleteInput'

import {LocationListItem } from '../LocationListItem/LocationListItem';

import RecentLocations from './RecentLocations';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

const Autocomplete = ({
    originAutoCompleteInputTitle,
    dropoffAutoCompleteInputTitle,
    originAutoCompleteInputIcon,
    dropOffAutoCompleteInputIcon,
    currentLocationTitle,
    recentLocationTitle,
    originLocationPlaceHolder,
    destinationLocationPlaceHolder,
    originLocation,
    dropoffLocation,
    currentLocation,
    recentLocations,
    recentLocationVariant,
    currentLocationIconColor,
    currentLocationVariant,
    isCurrentLocationVisible,
    isRecentLocationVisible,
    isDropoffLocationInputVisible,
    onRecentLocationPress,
    onOriginLocationPress,
    onDropoffLocationPress,
    onFailure,
    onAskForPermission,
    removeDropoffLocation,
    removeOriginLocation,
    onMapPicker,
    predefinedPlaces = true,
    isShowMapPicker = false,
}) => {
    const [isLocationPermissionDenied, setPermissions] = useState(false);
    const [isOriginFocused, setIsOriginFocused] = useState(false);
    const [isDestinationFocused, setIsDestinationFocused] = useState(false);

    const isFocused = isOriginFocused === true || isDestinationFocused === true;

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
            onLocationPress(data);
        }
    };

    const onOriginAutoCompleteInputPress = (data) => processAutoCompleteInput(data, onOriginLocationPress);
    const onDropoffAutoCompleteInputPress = (data) => processAutoCompleteInput(data, onDropoffLocationPress);

    const onRecentLocationPressWrapper = (data) => {
        onRecentLocationPress(data)
        Keyboard.dismiss();
    }

    const onCallMapPicker = () => {
        onMapPicker(isOriginFocused ? 'originLocation' : 'dropoffLocation')
        setIsOriginFocused(false);
        Keyboard.dismiss()
    }

    return (
        <>
            <ScreenWrapper withScrollView={true} keyboardShouldPersistTaps={'handled'}>
            {isLocationPermissionDenied === true ? (
               <>
                    <Banner
                        visible={true}
                        icon={MATERIAL_ICONS.location}
                        actions={[
                            {
                                label: localized('goToSettings'),
                                onPress: onAskForPermission,
                            },
                        ]}
                    >
                        {localized('appRequiresGeolocation')}
                    </Banner>
                    <ScreenWrapper.Section />
               </>
            ) : null}
                <ScreenWrapper.Container >
                    <AutoCompleteInput
                        title={originAutoCompleteInputTitle}
                        icon={originAutoCompleteInputIcon}
                        value={originLocation?.formattedAddress}
                        placeholder={originLocationPlaceHolder}
                        locationPermissionStatus={isLocationPermissionDenied}
                        predefinedPlaces={predefinedPlaces}
                        showMapPicker={isShowMapPicker}
                        onClear={removeOriginLocation}
                        onPress={onOriginAutoCompleteInputPress}
                        onCallMapPicker={onCallMapPicker}
                        onFocus={() => {
                            setIsOriginFocused(true);
                        }}
                        onBlur={() => {
                            setIsOriginFocused(false)
                        }} />

                    {isDropoffLocationInputVisible && !isOriginFocused ? (
                        <AutoCompleteInput
                            title={dropoffAutoCompleteInputTitle}
                            icon={dropOffAutoCompleteInputIcon}
                            value={dropoffLocation?.formattedAddress}
                            locationPermissionStatus={isLocationPermissionDenied}
                            placeholder={destinationLocationPlaceHolder}
                            predefinedPlaces={true}
                            showMapPicker={isShowMapPicker}
                            showGps={false}
                            onClear={removeDropoffLocation}
                            onCallMapPicker={onCallMapPicker}
                            onPress={onDropoffAutoCompleteInputPress}
                            onFocus={() => {
                                setIsDestinationFocused(true)
                            }}
                            onBlur={() => {
                                setIsDestinationFocused(false)
                            }} />
                    ) : null}
                </ScreenWrapper.Container>

                {isCurrentLocationVisible && isFocused === false && currentLocation?.id ? (
                    <List.Section title={localized(currentLocationTitle)}>
                        <LocationListItem
                            title={currentLocation?.formattedAddress}
                            description={currentLocation.vicinity}
                            iconColor={currentLocationIconColor}
                            variant={currentLocationVariant}
                        />
                    </List.Section>
                ) : null}

                {isRecentLocationVisible && isFocused === false && recentLocations?.length > 0 ? (
                    <RecentLocations
                        title={recentLocationTitle}
                        locations={recentLocations.filter(recent => recent.id !== currentLocation?.id)}
                        variant={recentLocationVariant}
                        onPress={onRecentLocationPressWrapper} />
                ) : null}
            </ScreenWrapper>
        </>
    );
};

export default Autocomplete;
