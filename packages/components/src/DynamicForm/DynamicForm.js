import React, { useCallback, useRef } from 'react';

import { FlatList, Animated } from 'react-native';

import { List, MD3Colors} from '@jmsstudiosinc/react-native-paper';
import { formattedSelection, validateSelection } from '@jmsstudiosinc/commons';
import DynamicFormSwitch from './DynamicFormSwitch';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const nextAttributeGroup = (value, attributeGroup) => {
    return value === true && attributeGroup.length ? attributeGroup : null;
};

const validateAttributeGroup = (sections, initialState = {}) => {
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
    initialValues = {},
    isOutofStock,
    sections,
    listHeaderComponent,
    listFooterComponent,
    onFormChange,
    onContentOffsetYScroll,
    contentOffsetY
}) => {
    const contentOffsetYRangeRef = useRef(false);
    const scrollY = useRef(new Animated.Value(0)).current;

    const onCheckboxRadioChange = (item, section, value) => {
        let alteredForm = initialValues;

        if (!alteredForm[section.id]) {
            alteredForm = {
                ...alteredForm,
                [section.id]: {
                    ...alteredForm[section.id],
                    taxonomyType: section.taxonomyType,
                    id: section.id,
                    title: section.title,
                    parentId: section.parentId,
                    selection: section.selection,
                    formattedSelection: section.formattedSelection,
                }
            }
        }

        const updateAttributeGroup = (item, value) => {
            if(value === true) {
                alteredForm = {
                    ...alteredForm,
                    [item.id]: {
                        ...alteredForm[item.id],
                        parentId: item.parentId,
                        title: item.title,
                        price: item.price,
                        value,
                    }
                }
            } else {
                alteredForm = {
                    ...alteredForm,
                    [item.id]: {}
                }
            }

            if (value === true && alteredForm[section.id].selection <= section.maxSelection) {
                alteredForm = {
                    ...alteredForm,
                    [section.id]: {
                        ...alteredForm[section.id],
                        selection: alteredForm[section.id].selection += 1
                    }
                }       
            } else if (alteredForm[section.id].selection > 0) {
                alteredForm = {
                    ...alteredForm,
                    [section.id]: {
                        ...alteredForm[section.id],
                        selection: alteredForm[section.id].selection -= 1
                    }
                }   
            }
        };

        if (section?.maxSelection === 1) {
            section.data.forEach((data) => {
                if (data.id === item.id) {
                    updateAttributeGroup(data, value);
                } else if (alteredForm[data.id]?.value === true) {
                    updateAttributeGroup(data, false);
                }
            });
        } else {
            updateAttributeGroup(item, value);
        }

        if (!alteredForm[parentId]) {
            alteredForm[parentId] = {};
        }

        alteredForm = {
            ...alteredForm,
            [section.id]: {
                ...alteredForm[section.id],
                isValid: validateSelection(alteredForm[section.id].selection, section.minSelection)
            }
        }   

        alteredForm = {
            ...alteredForm,
            [section.id]: {
                ...alteredForm[section.id],
                formattedSelection: formattedSelection(
                    alteredForm[section.id].selection,
                    section.minSelection,
                    section.maxSelection
                )
            }
        }   

        alteredForm = {
            ...alteredForm,
            [parentId]: {
                ...alteredForm[parentId],
                isValid: validateAttributeGroup(sections, alteredForm)
            }
        }  

        onFormChange?.(alteredForm, nextAttributeGroup(value, item.attributeGroup), item.id);
    };

    const getValue = (item) => {
        if (initialValues?.[item.id]) {
            return initialValues[item.id].value;
        }

        return item.value;
    };

    const validateMaxSelection = (value, selection, maxSelection) => {
        if (!value && maxSelection > 1 && selection >= maxSelection) {
            return true;
        }
    
        return false;
    };

    const renderItem = ({item}) => (
        <List.Accordion 
            title={item.title} 
            description={initialValues[item.id]?.formattedSelection || item.formattedSelection}
            descriptionStyle={{...((initialValues[item.id])?.isValid ? null : {color: MD3Colors.error50})}}>
            {item.data?.map((attr) => {
                const value = Boolean(getValue(attr));
                const isMaxSelection = validateMaxSelection(value, item, item.maxSelection);
                const isDisabled = attr.isDisabled || isOutofStock || isMaxSelection;
                const form = {
                    ...attr,
                    value,
                    isDisabled
                }

                return <DynamicFormSwitch
                    key={`dymamic-form-switch-${attr.id}`}
                    form={form}
                    onChange={(value) => onCheckboxRadioChange(attr, item, value)} />
            })}
        </List.Accordion>
    );

    const listFooterComponentWrapper = () => {
        let isValid = initialValues[parentId]?.isValid;

        if (isValid === undefined) {
            isValid = validateAttributeGroup(sections);
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
