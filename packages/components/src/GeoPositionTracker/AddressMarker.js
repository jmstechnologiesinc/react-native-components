import { View, Text, StyleSheet, TouchableOpacity, Pressable, } from 'react-native'
import React from 'react'
import MapboxGL from '@rnmapbox/maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const AddressMarker = ({ coordinate, title, onPress }) => {

  return (
    coordinate &&
      coordinate[0] !== undefined &&
      coordinate[1] !== undefined ?

      <MapboxGL.MarkerView
        id="marker"
        coordinate={coordinate}
        anchor={{ x: 0.5, y: 1.2 }}
      >
        <Pressable
          style={({ pressed }) => [
            styles.pressableContainer,
            pressed && styles.pressed
          ]}
          onPress={onPress}
        >
          <View style={styles.markerContainer}>
            <Text style={styles.markerText}>
              {title?.length > 20
                ? `${title.substring(0, 20)}...`
                : title}
            </Text>

            <MaterialCommunityIcons name="chevron-right" size={24} color="black" />
          </View>
        </Pressable>
      </MapboxGL.MarkerView>
      : null
  )
}

const styles = StyleSheet.create({
  pressableContainer: {
    padding: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  markerContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    color: '#000',
    fontSize: 14,
    marginRight: 5,
  },
});



export default AddressMarker