import { View, StyleSheet, Pressable, } from 'react-native'
import React from 'react'
import MapboxGL from '@rnmapbox/maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from '@jmstechnologiesinc/react-native-paper';


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
          {title ? <View style={styles.markerContainer}>
            <Text variant="titleMedium">
              {title?.length > 15
                ? `${title.substring(0, 15)}...`
                : title}
            </Text>

            <MaterialCommunityIcons name="chevron-right" size={24} color="black" />
          </View> : null}
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

});



export default AddressMarker