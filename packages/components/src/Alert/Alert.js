
import React, { useState } from 'react';

import { Button, TextInput, Portal, Dialog, HelperText, Text, MD3LightTheme, ProgressBar, MD3Colors } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization.native'
import { StyleSheet } from 'react-native';

import ScreenWrapper from '../ScreenWrapper';


const CustomAlert = ({
  isVisible,
  onDismiss,
  title,
  description
}) => {
  return (
    <Portal>
      <Dialog
        visible={isVisible}
        dismissable={false}>
        <Dialog.Title>{localized(title)}</Dialog.Title>
        {
          description ? <Dialog.ScrollArea style={styles.container}>
            <Dialog.Content>
              <ScreenWrapper.Section>
                <Text>{description}</Text>
              </ScreenWrapper.Section>
            </Dialog.Content>
          </Dialog.ScrollArea> : null
        }
        <Dialog.Actions>
          <Button
            onPress={onDismiss}
            textColor={MD3Colors.error50}>
            {localized('cancel')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
});

export default CustomAlert