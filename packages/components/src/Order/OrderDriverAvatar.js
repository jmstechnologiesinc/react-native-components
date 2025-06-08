import React from 'react';

import { List as JMSList, imageKitAvatar } from '@jmstechnologiesinc/react-native-components';

import { Avatar} from '@jmstechnologiesinc/react-native-paper';

import { interpunct } from '@jmstechnologiesinc/commons';

const OrderDriverAvatar = ({
    isLoading,
    photo,
    formattedDriverName,
    formattedTripStatus,
    formattedVehicleValue,
    chips=[]
}) => {
    return (
        <JMSList.Item
            title={formattedDriverName}
            description={[formattedVehicleValue, formattedTripStatus]}
            titleNumberOfLines={0}
            descriptionNumberOfLines={0}
            chips={chips}
            left={isLoading ?
                (props) => (
                    <Avatar.Icon 
                        icon='car'    
                        style={props.style} />
                ) : (
                    (props) => <Avatar.Image 
                        source={{ uri: imageKitAvatar(photo) }}
                        style={props.style}  />
            )} /> 
    )
}

export default OrderDriverAvatar;
