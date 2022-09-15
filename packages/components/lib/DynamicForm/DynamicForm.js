import React, { useCallback } from 'react';

import { FlatList } from 'react-native';

import { formattedSelection, validateSelection } from '@jmsstudiosinc/commons';
import { List } from '@jmsstudiosinc/react-native-paper';
import DynamicFormSwitch from './DynamicFormSwitch';

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

const DynamicForm = ({
    parentId,
    initialValues = {},
    isOutofStock,
    sections,
    ListHeaderComponent,
    listFooterComponent,
    onFormChange,
}) => {
    const onCheckboxRadioChange = (item, section, value) => {
        const alteredForm = { ...initialValues };

        if (!alteredForm[section.id]) {
            alteredForm[section.id] = {
                taxonomyType: section.taxonomyType,
                id: section.id,
                title: section.title,
                parentId: section.parentId,
                selection: section.selection,
                formattedSelection: section.formattedSelection,
            };
        }

        const updateAttributeGroup = (item, value) => {
            alteredForm[item.id] = {
                parentId: item.parentId,
                title: item.title,
                price: item.price,
                value,
            };

            if (value === true && alteredForm[section.id].selection <= section.maxSelection) {
                alteredForm[section.id].selection += 1;
            } else if (alteredForm[section.id].selection > 0) {
                alteredForm[section.id].selection -= 1;
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

        alteredForm[section.id].isValid = validateSelection(alteredForm[section.id].selection, section.minSelection);

        alteredForm[section.id].formattedSelection = formattedSelection(
            alteredForm[section.id].selection,
            section.minSelection,
            section.maxSelection
        );

        alteredForm[parentId].isValid = validateAttributeGroup(sections, alteredForm);

        onFormChange?.({ ...alteredForm }, nextAttributeGroup(value, item.attributeGroup), item.id);
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

    const renderItem = ({ item }) => {
        return (
            <List.Section>
                <List.Accordion
                    title={item.title}
                    description={initialValues[item.id]?.formattedSelection || item.formattedSelection}
                >
                    {item.data?.map((attr) => {
                        const value = Boolean(getValue(attr));
                        const isMaxSelection = validateMaxSelection(value, item, item.maxSelection);
                        const isDisabled = attr.isDisabled || isOutofStock || isMaxSelection;
                        const form = {
                            ...attr,
                            value,
                            isDisabled,
                        };

                        return (
                            <DynamicFormSwitch
                                form={form}
                                onChange={(value) => onCheckboxRadioChange(attr, item, value)}
                            />
                        );
                    })}
                </List.Accordion>
            </List.Section>
        );
    };

    const listFooterComponentWrapper = () => {
        let isValid = initialValues[parentId]?.isValid;

        if (isValid === undefined) {
            isValid = validateAttributeGroup(sections);
        }

        return listFooterComponent(isValid);
    };

    const keyExtractor = useCallback((item) => item.uuid.toString(), []);

    return (
        <FlatList
            data={sections}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={listFooterComponentWrapper}
        />
    );
};

export default DynamicForm;
