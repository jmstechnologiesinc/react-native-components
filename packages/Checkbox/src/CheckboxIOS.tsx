import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import TouchableRipple from './TouchableRipple/TouchableRipple';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircle, faCheck} from '@fortawesome/pro-regular-svg-icons';

import type {$RemoveChildren} from './types';
import {getSelectionControlIOSColor} from './utils';

import theme from './LightTheme';

type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Status of checkbox.
   */
  status: 'checked' | 'unchecked' | 'indeterminate';
  /**
   * Whether checkbox is disabled.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Custom color for checkbox.
   */
  color?: string;
  /**
   * @optional
   */

  /**
   * testID to be used on tests.
   */
  testID?: string;
};

/**
 * Checkboxes allow the selection of multiple options from a set.
 * This component follows platform guidelines for iOS, but can be used
 * on any platform.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/checkbox-enabled.ios.png" />
 *     <figcaption>Enabled</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/checkbox-disabled.ios.png" />
 *     <figcaption>Disabled</figcaption>
 *   </figure>
 * </div>
 */
const CheckboxIOS = ({status, disabled, onPress, testID, ...rest}: Props) => {
  const checked = status === 'checked';
  const indeterminate = status === 'indeterminate';

  const {checkedColor, rippleColor} = getSelectionControlIOSColor({
    theme,
    disabled,
    customColor: rest.color,
  });

  const icon = indeterminate ? faCheck : faCircle;

  return (
    <TouchableRipple
      {...rest}
      borderless
      rippleColor={rippleColor}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{disabled, checked}}
      accessibilityLiveRegion="polite"
      style={styles.container}
      testID={testID}
    >
      <View style={{opacity: indeterminate || checked ? 1 : 0}}>
        <FontAwesomeIcon icon={icon} size={24} color={checkedColor} />
      </View>
    </TouchableRipple>
  );
};

CheckboxIOS.displayName = 'Checkbox.IOS';

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 6,
  },
});

export default CheckboxIOS;

export {CheckboxIOS};
