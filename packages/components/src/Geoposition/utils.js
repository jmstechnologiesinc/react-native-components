import { Platform } from 'react-native';

import { PERMISSIONS, request } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

navigator.geolocation = require('react-native-geolocation-service');


export const checkAndAskForPermission = async () => {
    let permissionStatus;
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
        if (Platform.OS === 'ios') {
            permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        } else {
            permissionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        }

        return new Promise((resolve, reject) => {
            if (permissionStatus === 'granted') {
                resolve(permissionStatus);
            } else {
                reject(permissionStatus);
            }
        });
    } else if (typeof navigator !== 'undefined' && navigator.permissions) {
        return new Promise((resolve, reject) => {
            navigator.permissions
                .query({ name: 'geolocation' })
                .then((result) => {
                    result.onchange = () => {
                        console.log(result.state);
                    };

                    if (result.state === 'prompt') {
                        gpsLocation();
                    }

                    if (result.state === 'granted') {
                        resolve(result.state);
                    } else {
                        reject(result.state);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
};

export const gpsLocation = () =>
    Platform.OS === 'web'
        ? new Promise(async (resolve) => {
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    resolve(location);
                },
                (error) => {
                    resolve(error);
                }
            );
        })
        : new Promise(async (resolve) => {
            Geolocation.getCurrentPosition(
                (location) => {
                    resolve(location);
                },
                (error) => {
                    resolve(error);
                },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            );
        });
