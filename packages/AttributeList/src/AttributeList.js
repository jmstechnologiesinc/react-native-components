import React from 'react';

import {List, RadioButton, Checkbox} from '@jmsstudiosinc/react-native-paper';
import {FIELD_TYPES} from '@jmsstudiosinc/commons';
import {Metadata, Subheader} from '../../List/src';

const AttributeList = ({
  title,
  data,
  id,
  uuid,
  taxonomyType,
  selection,
  minSelection,
  maxSelection,
  isValid,
  formattedSelection,
}) => {
  const renderForm = ({type, isExpanded, isDisabled}) => {
    if (type === FIELD_TYPES.radio) {
      return (
        <RadioButton.Android
          status={isExpanded ? 'checked' : 'unchecked'}
          disabled={isDisabled}
        />
      );
    } else {
      return (
        <Checkbox.Android
          status={isExpanded ? 'checked' : 'unchecked'}
          disabled={isDisabled}
        />
      );
    }
  };

  return (
    <List.Section>
      <Subheader title={title} description={formattedSelection} />

      {data?.map(data => (
        <List.Accordion
          title={data.title}
          left={props =>
            renderForm({
              isExpanded: props.isExpanded,
              type: data.type,
              isDisabled: data.isDisabled,
            })
          }
          right={() => <Metadata title={data.price} />}
        />
      ))}
    </List.Section>
  );
};

export default AttributeList;
