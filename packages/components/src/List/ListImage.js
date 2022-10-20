import React from 'react';

import { StyleSheet, Image } from 'react-native';

import { List, MD3LightTheme, Text } from '@jmsstudiosinc/react-native-paper';

import { moderateScale } from 'react-native-size-matters';

const ListImage = ({ src, title, description, right, ...props }) => {
    const renderImage = src ? () => <Image source={src} style={styles.image} /> : null;
    const renderTitle = ({ selectable, titleEllipsizeMode, color }) => (
        <Text
            selectable={selectable}
            ellipsizeMode={titleEllipsizeMode}
            numberOfLines={1}
            variant={'bodyLarge'}
            style={{ color, paddingLeft: MD3LightTheme.margin / 2 }}
        >
            {title}
        </Text>
    );

    return (
        <List.Item
            {...props}
            title={renderTitle}
            description={description}
            left={renderImage}
            right={right}
            style={{ paddingLeft: 0 }}
            descriptionStyle={{ paddingLeft: MD3LightTheme.margin / 2 }}
            itemStyle={{ marginVertical: 0, justifyContent: true ? 'flex-start' : 'center' }}
        />
    );
};

const styles = StyleSheet.create({
    image: {
        width: moderateScale(100),
        height: moderateScale(56),
    },
});

export default ListImage;
