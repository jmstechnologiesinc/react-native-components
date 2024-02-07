import React from 'react';

import { formattedETATime, milliseconsExtractor } from '@jmstechnologiesinc/commons';

import usePubNubETA from '../Order/usePubNubETA';
import { Avatar, Divider, List, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { imagekitUrl } from '@jmstechnologiesinc/react-native-components/lib/utils';
import SettingsListItems from '../../../../../src/Core/settings/SettingsListItems';

const DriverStatus = ({
    role,
    orderID,
    status,
    deliveryMethod,

    header,
    description,
    vehicle,
    chips,
    avatar,

    showOverline,
    showTitle = true,
    showDescription,
    showAvatar = true,

    titleStyle,
    overlineStyle,
}) => {
    const milliseconds = usePubNubETA({
        role,
        orderID,
        deliveryMethod,
        status,
    });

    let eta;
    if (milliseconds) {
        const { hrs, mins } = milliseconsExtractor(milliseconds);
        eta = {
            title: formattedETATime(hrs, mins),
            description: "Estime Time Arrival",
            icon: "car-clock",
        };
    }

    const renderAvatar =
    showAvatar && avatar
        ? (props) => <Avatar.Image style={props.style} source={{ uri: imagekitUrl(avatar) }} />
        : null;

    return (
        <>
            <Divider style={{ marginTop: MD3LightTheme.spacing.x3 }} />
      
            <List.Section title="Driver">
                <List.Item
                        title={showTitle ? header : null}
                        description={vehicle}
                        left={renderAvatar}
                    />

                {eta ? (
                    <List.Item
                            title={eta.title}
                            description="Estimate Time of Arrival"
                            left={(props) => <List.Icon {...props} icon={eta.icon} />}
                        />
                ) : null}
        
                <List.Item
                    title={description}
                    left={(props) => <List.Icon {...props} icon='message-text-clock-outline' />}
                />

                <SettingsListItems menuItems={chips} />
            </List.Section>
        </>
    );
};

export default DriverStatus;
