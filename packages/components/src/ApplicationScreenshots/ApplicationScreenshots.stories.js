import React from 'react';
import { ScrollView, View, Image, Text, StyleSheet, Dimensions } from 'react-native';

export default {
    title: 'Screens/Application Screenshots',
};
const screenshots = [
    require('./assets/1.png'),
    require('./assets/2.png'),
    require('./assets/3.png'),
    require('./assets/4.png'),
    require('./assets/5.png'),
    require('./assets/6.png'),
    require('./assets/7.png'),
    require('./assets/8.png'),
    require('./assets/9.png'),
    require('./assets/10.png'),
    //   require('./assets/11.png'),
    require('./assets/12.png'),
    require('./assets/13.png'),
    require('./assets/14.png'),
    require('./assets/15.png'),
    require('./assets/16.png'),
    require('./assets/17.png'),
    require('./assets/18.png'),
    require('./assets/19.png'),
    require('./assets/20.png'),
];

const captions = screenshots.map((_, i) => `Screenshot ${i + 1}`);

export const Screenshot = () => {
    const { width } = Dimensions.get('window');
    const isMobile = width < 600;

    const imageWidth = isMobile ? width * 1 : width * 0.44;
    const imageHeight = (imageWidth * 16) / 9;

    return (
        <ScrollView contentContainerStyle={isMobile ? styles.mobileContainer : styles.gridContainer}>
            {screenshots.map((source, index) => (
                <View
                    key={index}
                    style={
                        isMobile ? [styles.mobileItem, { width: imageWidth }] : [styles.gridItem, { width: imageWidth }]
                    }
                >
                    <Image
                        source={source}
                        style={{ width: imageWidth, height: imageHeight, borderRadius: 8 }}
                        resizeMode="contain"
                        accessibilityLabel={captions[index]}
                    />
                    <Text style={styles.caption}>{captions[index]}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    mobileContainer: {
        paddingVertical: 20,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingVertical: 20,
        backgroundColor: '#fff',
    },
    mobileItem: {
        marginVertical: 12,
        alignItems: 'center',
    },
    gridItem: {
        marginHorizontal: 8,
        marginVertical: 16,
        alignItems: 'center',
    },
    caption: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        fontStyle: 'italic',
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
});
