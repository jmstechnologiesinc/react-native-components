import React, { useState } from 'react';

import { View, FlatList, StyleSheet, Image} from 'react-native';

import { Card, List ,TouchableRipple} from '@jmsstudiosinc/react-native-paper';

const renderSeparator = () => (
    <View
        style={{
            width: 8,
            height: '100%',
        }}
    />
);

const PhotoGallery = ({ photos, hideMenu=false }) => { 
    const [uri, setUri] = useState(photos?.[0]);

    if(!Array.isArray(photos)) {
        return null;
    }

    const renderItem = ({ item }) => (
        <TouchableRipple onPress={() => setUri(item)}>
            <Image
                style={styles.photo}
                placeholderColor={'red'}
                source={{uri: item}}
            />
        </TouchableRipple>
    );

    return (
        <>
            {uri && <Card.Cover source={{ uri: uri }} />}
            
            {photos.length > 1 && (
                <List.Section>
                    <FlatList
                        style={styles.itemContainer}
                        data={photos}
                        horizontal
                        ItemSeparatorComponent={renderSeparator}
                        renderItem={renderItem}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => `${item}`}/>
                </List.Section>
            )}
        </>
    );
};



const styles = StyleSheet.create({
    itemContainer: {
        marginHorizontal: 16,
    },
    photo: {
        height: 65,
        width: 65,
    }
});

export default PhotoGallery;
