import React, { useRef } from 'react';

import { FlatList, Animated } from 'react-native';

const { dinero, toDecimal } = require('dinero.js');
import I18n from 'i18n-js';

import { List, MD3Colors} from '@jmsstudiosinc/react-native-paper';
import { dynamicFormInitializeGroup, dynamicFormToggleCheckRadioValue, dynamicFormValidateGroup} from '@jmsstudiosinc/commons';
import DynamicFormSwitch from './DynamicFormSwitch';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const animatedValue = new Animated.Value(0);

const areAllFormValid = (sections, initialState = {}) => {
    let valid = true;
   for (section of sections) {
        let isValid = initialState[section.id]?.isValid;

        if (isValid === undefined) {
            isValid = section.isValid;
        }

        if (isValid === false) {
            valid = false;
        }
    }

    return valid;
};

const keyExtractor = (item) => item.id;

const DynamicForm = ({
    parentId,
    initialState = {},
    isOutofStock,
    sections,
    listHeaderComponent,
    listFooterComponent,
    onChange,
    onContentOffsetYScroll,
    contentOffsetY
}) => {
    const contentOffsetYRangeRef = useRef(false);
    const scrollY = useRef(animatedValue).current;

    const onCheckRadioPress = (data, item, value) => {
        let alteredForm = dynamicFormInitializeGroup(item, initialState);

        const calculateQuantityByValue = (value) => {
            let quantity = alteredForm[item.id].quantity;

            if (value === true && quantity <= item.maxQuantity) {
                quantity += 1;
            } else if (quantity > 0) {
                quantity -= 1; 
            }

            return {
                ...alteredForm,
                [item.id]: {
                    ...alteredForm[item.id],
                    quantity
                }
            } 
        }

        if (item.maxQuantity === 1) {
            item.data.forEach((thisData) => {
                if (thisData.id === data.id) {
                    alteredForm = dynamicFormToggleCheckRadioValue(thisData, value, alteredForm);
                    alteredForm = calculateQuantityByValue(value);
                
                } else if ((alteredForm[thisData.id] || thisData)?.value === true) {
                    alteredForm = dynamicFormToggleCheckRadioValue(thisData, false, alteredForm);
                    alteredForm = calculateQuantityByValue(false);
                }
            });
        } else {
            alteredForm = dynamicFormToggleCheckRadioValue(data, value, alteredForm);
            alteredForm = calculateQuantityByValue(value); 
        }

        if (!alteredForm[parentId]) {
            alteredForm = {
                ...alteredForm,
                [parentId]: {}
            } 
        }

        alteredForm = dynamicFormValidateGroup(item, alteredForm) 

        alteredForm = {
            ...alteredForm,
            [parentId]: {
                ...alteredForm[parentId],
                isValid: areAllFormValid(sections, alteredForm)
            }
        }  

        onChange?.(alteredForm);
    };

    const getValue = (item) => {
        if (initialState?.[item.id]) {
            return initialState[item.id].value;
        }

        return item.value;
    };

    const validateMaxSelection = (value, quantity, maxQuantity) => {
        if (!value && maxQuantity > 1 && quantity >= maxQuantity) {
            return true;
        }
    
        return false;
    };

    const renderItem = ({item}) => (
        <List.Accordion 
            title={item.title} 
            description={initialState[item.id]?.formattedQuantity || item.formattedQuantity}
            descriptionStyle={{...((initialState[item.id] || item)?.isValid ? null : {color: MD3Colors.error50})}}>
            {item.data?.map((data) => {
                const value = Boolean(getValue(data));
                const isMaxSelection = validateMaxSelection(value, initialState[item.id]?.quantity, item.maxQuantity);
                const isDisabled = data.isDisabled || isOutofStock || isMaxSelection;
               
                return (
                    <DynamicFormSwitch
                        key={`dymamic-form-switch-${data.id}`}
                        type={data.type}
                        title={data.title}
                        description={data.description}
                        metaTitle={I18n.l('currency', toDecimal(dinero(data.price)))}
                        isChecked={value}
                        isDisabled={isDisabled}
                        onPress={(value) => onCheckRadioPress(data, item, value)} />
                )
            })}
        </List.Accordion>
    );

    const listFooterComponentWrapper = () => {
        let isValid = initialState[parentId]?.isValid;

        if (isValid === undefined) {
            isValid = areAllFormValid(sections);
        }

        return listFooterComponent(isValid);
    };

    return (
        <>
            <AnimatedFlatList
                data={sections}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListHeaderComponent={listHeaderComponent} 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false} 
                scrollEventThrottle={16}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                    useNativeDriver: true,
                    listener: onContentOffsetYScroll ? (event) => {
                        if(event.nativeEvent.contentOffset.y > contentOffsetY && contentOffsetYRangeRef.current === false) {
                            onContentOffsetYScroll(event.nativeEvent.contentOffset.y)
                            contentOffsetYRangeRef.current = true;
                        } else if(event.nativeEvent.contentOffset.y < contentOffsetY && contentOffsetYRangeRef.current === true) {
                            onContentOffsetYScroll(event.nativeEvent.contentOffset.y)
                            contentOffsetYRangeRef.current = false;
                        }
                    } : null
                })}/>
            {listFooterComponentWrapper()}
        </>
    );
};

export default DynamicForm;
