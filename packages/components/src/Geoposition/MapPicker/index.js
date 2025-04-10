// import React, { useState, useEffect } from 'react';

// import { Alert, View, Dimensions, StyleSheet, Platform } from 'react-native';

// import { useNavigation } from '@react-navigation/native';
// import { useSelector, useDispatch } from 'react-redux';

// import { geofirexToJSON } from '@jmstechnologiesinc/commons';

// import { localized, TNActivityIndicator } from '@jmstechnologiesinc/react-native-components';

// import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';
// import FormInputsScreenWrapper from '../../formInputs/FormInputsScreenWrapper';

// const MapPicker = () => {
//     const navigation = useNavigation();
//     const dispatch = useDispatch();

//     const user = useSelector((state) => state.auth.user);
//     const userGeoLocation = geofirexToJSON(user.location);

//     const [newLocation, setLocation] = useState();

//     const { width, height } = Dimensions.get('window');

//     const isHeight = Platform.OS === 'ios' ? height - moderateScale(210) : height;

//     useEffect(() => {
//         navigation.setOptions({
//             headerBackTitleVisible: false,
//         });

//         if (userGeoLocation === null) {
//             try {
//             } catch (errorMessage) {
//                 Alert.alert(localized('pleaseTryagain'), errorMessage, { cancelable: true });
//             }
//         }
//     }, [dispatch, navigation, user?.id, userGeoLocation]);

//     /*   const initial = {
//         latitudeDelta: 0.0012262609183853357,
//         longitudeDelta: 0.0008153915405273438,
//         latitude: userGeoLocation?.latitude,
//         longitude: userGeoLocation?.longitude,
//     };
//  */
//     const onPress = async () => {
//         try {
//             navigation.navigate('VendorList');
//         } catch (errorMessage) {
//             Alert.alert(localized('pleaseTryagain'), errorMessage, { cancelable: true });
//         }
//     };

//     const onRegionChangeComplete = (event) => {
//         setLocation(event);
//     };

//     if (userGeoLocation === null || !user?.id) {
//         return <TNActivityIndicator />;
//     }

//     return (
//         <FormInputsScreenWrapper onPress={onPress}>
//             <View style={[{ height: isHeight, width: width }]}>
//                 {/*   <MapView
//                     showsUserLocation
//                     showsMyLocationButton
//                     style={[styles.map]}
//                     initialRegion={initial}
//                     onRegionChangeComplete={onRegionChangeComplete}
//                     provider={PROVIDER_GOOGLE}
//                 /> */}
//                 <View style={styles.iconLocation}></View>
//             </View>
//         </FormInputsScreenWrapper>
//     );
// };

// const styles = StyleSheet.create({
//     map: {
//         flex: 1,
//     },
//     iconLocation: {
//         top: '50%',
//         left: '50%',
//         marginLeft: -35,
//         marginTop: -50,
//         position: 'absolute',
//     },
// });
// export default MapPicker;
