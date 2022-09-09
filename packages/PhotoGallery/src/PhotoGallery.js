import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { View, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
//import FastImage from 'react-native-fast-image';

//import { getMainPhoto } from '@jmsstudiosinc/commons';
//import Fast2ImageKit from '../Fast2ImageKit';

//import DynamicAppStyles from '../../DynamicAppStyles';
//import styles from '../../ShoppingApp/screens/SingleProduct/styles';

const renderSeparator = () => (
    <View
        style={{
            width: 8,
            height: '100%',
        }}
    />
);

const PhotoGallery = ({ photos }) => {
    const [uri, setUri] = useState(photos[0]);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => setUri(item)}>
            <Image
                style={styles.photo}
                placeholderColor={'red'}
                source={require('./wrecked-ship.jpg')}
            />
        </TouchableOpacity>
    );

    return (
        <>
            {uri && <Image source={require('./wrecked-ship.jpg')} style={styles.mainPhoto} />}
            {photos.length > 1 && (
                <FlatList
                    style={styles.itemContainer}
                    data={photos}
                    horizontal
                    ItemSeparatorComponent={renderSeparator}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => `${item}`}
                />
            )}
        </>
    );
};

PhotoGallery.defaultProps = {
    photos: [],
};

PhotoGallery.propTypes = {
    photos: PropTypes.arrayOf(PropTypes.string),
};

const styles = StyleSheet.create({
    itemContainer: {
        marginTop: 16,
        marginHorizontal: 16
    },
    photo: {
        height: 65,
        width: 65,
    },
    mainPhoto: {
        width: '100%',
        height: 200,
    }
});

export default PhotoGallery;
