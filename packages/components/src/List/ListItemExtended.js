import React from 'react';

import { StyleSheet, View } from 'react-native';

import { Chip, Avatar, Text, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import * as JMSList from './List';

const ListItemExtended = ({ 
    overline, 
    header, 
    subHeader, 
    avatar, 
    chips, 
    right, 
    contentColor,
    style, 
    ...rest 
}) => (
    <JMSList.Item
        overline={overline}
        title={header}
        left={
            avatar
                ? () => (
                      <Avatar.Image
                          style={{
                              marginHorizontal: MD3LightTheme.spacing.x2,
                              marginTop: MD3LightTheme.spacing.x1,
                          }}
                          source={{ uri: avatar }}
                      />
                  )
                : null
        }
        right={right ? () => right : null}
        description={({ ellipsizeMode, color: descriptionColor }) => (
            <>
                {subHeader && (
                    <Text
                        selectable={false}
                        numberOfLines={2}
                        ellipsizeMode={ellipsizeMode}
                        style={[{ color: descriptionColor }]}
                        variant={'bodyMedium'}
                    >
                        {subHeader}
                    </Text>
                )}
                {chips?.length > 0 && (
                    <View style={[styles.row, styles.additionalPadding]}>
                        {chips.map((chip) => (
                            <Chip mode="outlined" style={[styles.chip]}>
                                {chip}
                            </Chip>
                        ))}
                    </View>
                )}
            </>
        )}
        titleStyle={contentColor}
        overlineStyle={contentColor}
        style={style}
        {...rest}
    />
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    chip: {
        marginRight: MD3LightTheme.spacing.x2,
    },
    additionalPadding: {
        paddingTop: MD3LightTheme.spacing.x1,
    },
});

export default ListItemExtended;
