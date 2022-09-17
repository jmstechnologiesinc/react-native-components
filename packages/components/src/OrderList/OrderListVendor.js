import React from 'react';

import { Card,  Button,  Text } from '@jmsstudiosinc/react-native-paper';

import OrderListfulfillmentStatus from './OrderListfulfillmentStatus';
import { Image, StyleSheet, View } from 'react-native';


export const ORDER_ACTIONS = {
    print: 'print',
    call: 'call',
};


const OrderListVendor = ({
    role,
    status,
    fulfilmentStatus,
    title,
    photo,
    description,
    pudMethod,
    formattedOrderId,
    formattedStatusTime,
    avatar,
    eta,
    onPress,
    onButtonPress,
    orderID,
    
}) => {
    const renderImage = photo
        ? () => (
              <Image
                  source={{uri: photo}}
                  style={{
                      width: 100,
                      height: 56,
                  }}
              />
          )
        : null;

    return (
        <>
            <Card.Title
                title={title}
                subtitle={`${formattedOrderId} ${description}`}
                left={renderImage}
                right={() => (
                    <Text  style={{ marginRight: 16 }}>
                        {status}
                    </Text>
                )}
                leftStyle={{
                    width: 100,
                    height: 56,
                }}
            />

            {fulfilmentStatus.cooking && (
                <Card.Content style={{ marginTop: 8 }}><Text>{fulfilmentStatus.cooking}</Text></Card.Content>
            )}

            {(fulfilmentStatus.overline ||
                fulfilmentStatus.header ||
                fulfilmentStatus.subHeader ||
                fulfilmentStatus.chips.length > 0) && (
                <OrderListfulfillmentStatus
                    role={role}
                    overline={fulfilmentStatus.overline}
                    header={fulfilmentStatus.header}
                    subHeader={fulfilmentStatus.subHeader}
                    chips={fulfilmentStatus.chips}
                    avatar={avatar}
                    eta={eta}
                />
            )}

            {fulfilmentStatus.buttons?.length > 0 && (
                <View style={[styles.container, { justifyContent: 'flex-end' }]}>
                    {fulfilmentStatus.buttons.map((button, i) => (
                        <Button
                            mode={
                                button.value === ORDER_ACTIONS.print
                                    ? null
                                    : fulfilmentStatus.buttons.length - 1 === i
                                    ? 'contained'
                                    : 'outlined'
                            }
                            style={styles.button}
                        onPress={() => onButtonPress(button, orderID)}
                            {...(button.value === ORDER_ACTIONS.print && { icon: 'printer' })}
                        >
                            {button.label}
                        </Button>
                    ))}
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    button: {
        marginLeft: 8,
    },
});

export default OrderListVendor;
