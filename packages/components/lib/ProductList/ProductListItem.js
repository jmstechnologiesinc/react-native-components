import React from 'react';

import { View } from 'react-native';

import { List as RNPList, Badge } from '@jmsstudiosinc/react-native-paper';
import * as JMSList from '../List';

const ProductListItem = ({
    id,
    uuid,
    photo,
    title,
    description,
    price,
    quantity,
    cartQuantity,
    isOutofStock,
    onPress,
}) => (
    <RNPList.Section>
        {photo ? (
            <JMSList.Image
                src={require('./wrecked-ship.jpg')}
                title={title}
                description={description}
                right={() => (
                    <View style={{ justifyContent: 'flex-start', marginLeft: 16 }}>
                        {price && <JMSList.Metadata title={price} style={{ marginTop: -6 }} />}
                        {cartQuantity && <Badge>{cartQuantity}</Badge>}
                    </View>
                )}
                onPress={onPress}
            />
        ) : (
            <RNPList.Item
                title={title}
                description={description}
                right={() => (
                    <View style={{ justifyContent: 'center', marginLeft: 16 }}>
                        {price && <JMSList.Metadata title={price} />}
                        {cartQuantity && <Badge>{cartQuantity}</Badge>}
                    </View>
                )}
                onPress={onPress}
                itemStyle={{ marginVertical: 0, paddingLeft: 0 }}
            />
        )}
    </RNPList.Section>
);

export default ProductListItem;
