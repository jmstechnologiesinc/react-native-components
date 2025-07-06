import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import { Config } from '../Config';
import GeoPositionTracker from '.';
import products from '../GorhomBottomSheetWrapper/GorhomBottomSheetWrapper.stories';

MapboxGL.setAccessToken(
    'pk.eyJ1Ijoiam1zdGVjaG5vbG9naWVzaW5jIiwiYSI6ImNsZWtrd2JqdDBpdXkzcnA1YzZ6amNwOGIifQ.1GwSU5_aWllbCNmP9M23aw'
);

const getVehiclePositions = (products) => {
    return products?.reduce((acc, item) => {
        const positions = item.data.map((dataItem) => {
            const { formattedValue } = dataItem.eta;
            const { position } = dataItem.driver;
            return {
                longitud: position[0],
                latitud: position[1],
                formattedValue: formattedValue,
                driverId: dataItem.driver.id,
            };
        });
        return acc.concat(positions);
    }, []);
};

const nearbyVehicleLocations = getVehiclePositions(products);

console.log(nearbyVehicleLocations);

export default {
    title: 'Mapbox/BasicMap',
    component: MapboxGL.MapView,
};

export const BasicMap = () => (
    <MapboxGL.MapView style={{ flex: 1, height: 400 }}>
        <MapboxGL.Camera zoomLevel={12} centerCoordinate={[-73.935242, 40.73061]} />
    </MapboxGL.MapView>
);

const originLocation = {
    latitude: 42.707564063918513,
    longitude: -71.16235187906001,
    formattedAddress: '155 Boxford St, Lawrence MA 01843',
};
const dropoffLocation = {
    latitude: 42.71074176591852,
    longitude: -71.16283362348541,
    formattedAddress: '2 Railroad St, Lawrence MA 01841',
};

export const SelectDriver = () => (
    <GeoPositionTracker
        customerPosition={originLocation}
        currentDriverPosition={dropoffLocation}
        vendorPosition={dropoffLocation}
        currentSnapPoint={0}
        selectedItemId={'5EUeUDxSXcsid5EbmgRAbxB5ILoB'}
        nearbyVehicleLocations={nearbyVehicleLocations}
    />
);

export const SelectOriginDestination = () => (
    <GeoPositionTracker
        customerPosition={originLocation}
        dropoffLocation={dropoffLocation}
        currentDriverPosition={dropoffLocation}
        currentSnapPoint={0}
        selectedItemId={'5EUeUDxSXcsid5EbmgRAbxB5ILoB'}
        nearbyVehicleLocations={nearbyVehicleLocations}
    />
);
