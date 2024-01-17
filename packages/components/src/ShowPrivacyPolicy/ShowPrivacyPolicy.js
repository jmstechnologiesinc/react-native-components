import * as React from 'react';
import { Button, Dialog, Portal, Text,  } from '@jmstechnologiesinc/react-native-paper';
import { localized } from '@jmstechnologiesinc/react-native-components';

const ShowPrivacyPolicy = ({ value, onCallPermissionGps }) => {
    const [visible, setVisible] = React.useState(value);
    const hideDialog = () => setVisible(false);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Icon icon="information" />
                <Dialog.Title style={{textAlign: 'center'}}>{localized('useYourLocation')}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">{localized('locationServicesInfo')}</Text>
                </Dialog.Content>
                <Dialog.Content>
                <Text variant="bodyMedium">{localized('additionalInfo')}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>{localized('cancel')}</Button>
                    <Button onPress={onCallPermissionGps}>{localized('agree')}</Button>
                </Dialog.Actions>
                
            </Dialog>
        </Portal>
    );
};

export default ShowPrivacyPolicy;
