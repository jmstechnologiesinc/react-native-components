import React from 'react';

import {TouchableOpacity, Text} from 'react-native';

import styles from './styles';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  color?: string;
}
const AppButton = ({title, onPress, color}: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.appButtonContainer, {backgroundColor: color}]}
  >
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

export default AppButton;
