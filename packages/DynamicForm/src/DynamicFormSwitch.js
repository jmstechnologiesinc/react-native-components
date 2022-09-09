import React from 'react';

import {FIELD_TYPES} from '@jmsstudiosinc/commons';
import * as JMSList from '../../List/src';

const DynamicFormSwitch = ({form, onChange}) => {
  switch (form.type) {
    case FIELD_TYPES.radio:
      return  <JMSList.Radio
        title={form.title} 
        description={form.description} 
        isDisabled={form.isDisabled}
        metadata={form.price}
        isChecked={form.value} 
        onPress={onChange}/> 
      break;
    case FIELD_TYPES.checkbox:
      return <JMSList.Checkbox
        title={form.title} 
        description={form.description} 
        isDisabled={form.isDisabled}
        metadata={form.price}
        isChecked={form.value}
        onPress={onChange}/> 
      break;
    default:
      return `Unsupported field type - ${form.type}`
      break;
  }
}

export default DynamicFormSwitch;
