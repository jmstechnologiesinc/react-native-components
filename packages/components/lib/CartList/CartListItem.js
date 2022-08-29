import React from 'react';

import { View, StyleSheet } from 'react-native';

import { Text, List, Button, Badge, Divider } from '@jmsstudiosinc/react-native-paper';
import { CART_ITEM_TYPE } from '@jmsstudiosinc/cart';
import { Metadata, Subheader } from '../List';
import SwipeToDelete from '../SwipeToDelete';

const vendorPhoto = 'https://d1ralsognjng37.cloudfront.net/21abd571-1fa3-4214-ae02-2e828864dea3.jpeg';

const recursiveAttributeGroup = ({ parentId, attributeGroup }) => {
    const results = [];

    if (!parentId) return null;

    for (selection in attributeGroup) {
        if (attributeGroup[selection].parentId === parentId) {
            results.push({
                ...attributeGroup[selection],
                ...recursiveAttributeGroup({ parentId: selection, attributeGroup }),
            });
        }
    }

    return results;
};

const renderRecursiveAttributeGroup = (attributeGroup) => {
    const results = [];
    for (index in attributeGroup) {
        if (attributeGroup[index].parentId === null) {
            results.push(...recursiveAttributeGroup({ parentId: attributeGroup[index].id, attributeGroup }));
        }
    }

    return results;
};

const CartListItem = ({ item, onDelete, onEdit, onCheckout, onTips  }) => {
    const { id, title, type, total, description, data, cartIndustryId } = item;


    if (type === CART_ITEM_TYPE.emptyItem) {
        return null;
    } else if (type === CART_ITEM_TYPE.checkout) {
        return (
           <Button mode="contained" onPress={() => onCheckout(item.vendorIds) } style={styles.button}>
                CHECKOUT
            </Button>
            
        );
    } else if (type === 'industryWarning') {
        return (
            <View style={{ marginTop: 40, marginBottom: 20 }}>
                <Text variant={'headlineMedium'}>{title}</Text>
                <Text variant={'bodyMedium'}>{description}</Text>
            </View>
        );
    } else if (type === CART_ITEM_TYPE.industryTitle) {
        return null;
        return <List.Section title={title} style={{ margin: 0 }}></List.Section>;
    }



    return (
        <List.Section>
            <Subheader title={title} avatar={vendorPhoto} metadata={1234} />
            {data?.map((data) => {
                const attributeGroup = renderRecursiveAttributeGroup(data.attributeGroup);
                return (
                    <>
                    <SwipeToDelete onDelete={() => onDelete(id, data.cartId, cartIndustryId)}>
                        <List.Accordion
                            onPress={() => onEdit({data, item})}
                            title={data.title}
                            left={() => (
                                <List.Icon icon={() => <Badge style={{ alignSelf: 'auto' }}>{data.quantity}</Badge>} />
                            )}
                            right={() => (data.price ? <Metadata title={data.price} /> : null)}
                            expanded={attributeGroup.length > 0}
                        >
                            {attributeGroup.map((item) => (
                                <List.Item title={item.title} />
                            ))}
                        </List.Accordion>
                        <Divider />
                        </SwipeToDelete>

                        {onTips(item)}
                        
                        </>
                );
            })}
         
        </List.Section>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height: 40,
        width: 40,
        margin: 8,
    },
    image1: {
        width: 100,
        height: 56,
        padding: 0,
    },
    row: {
        flexDirection: 'row',
    },
    column: {
        flexDirection: 'column',
    },
    button: {
        margin: 16,
    },
});

export default CartListItem;
