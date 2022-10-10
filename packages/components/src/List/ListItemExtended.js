import React from 'react';

import { StyleSheet, View } from 'react-native';

import { Chip, Avatar, Text, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import * as JMSList from './List';

import { Linking, Platform } from 'react-native';
export const makeLinkingCall = (phone) => {
    if (Platform.OS === 'android') {
        Linking.openURL(`tel: +${phone}`);
    } else {
        console.log('Call');
        Linking.openURL(`telprompt:: +${phone}`);
    }
};

const ListItemExtended = ({ 
    overline, 
    header, 
    subHeader, 
    avatar, 
    chips, 
    right,
    ...rest
 }) => (
    <JMSList.Item
        overline={overline}
        title={header}
        left={avatar ? () => <Avatar.Image style={{marginHorizontal: MD3LightTheme.margin / 2}} source={{uri: avatar}} /> : null}
        right={right ? () => right : null}
        description={({ ellipsizeMode, color: descriptionColor, fontSize }) => (
            <View style={[styles.column, styles.column]}>
                <Text 
                    numberOfLines={2} 
                    ellipsizeMode={ellipsizeMode} 
                    style={{ color: descriptionColor, fontSize }}>
                    {subHeader} 
                </Text>
                {chips?.length > 0 && (
                    <View style={[ styles.container, styles.row, styles.additionalPadding]}>
                        {chips.map((chip) => (
                            <Chip mode="outlined" style={[styles.chip]}>
                                {chip}
                            </Chip>
                        ))}
                    </View>
                )}
            </View>
        )}
        {...rest}
    />
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
    row: {
        flexDirection: 'row',
    },
    column: {
        flexDirection: 'column',
    },
    chip: {
        marginRight: 8
    },
    additionalPadding: {
        paddingTop: 8,
      },
});

export default ListItemExtended;
