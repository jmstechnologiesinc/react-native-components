import TouchableRipple from './TouchableRipple/TouchableRipple';
import type { $RemoveChildren } from './types';
declare type Props = $RemoveChildren<typeof TouchableRipple> & {
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
     * Custom color for unchecked checkbox.
     */
    uncheckedColor?: string;
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
 * This component follows platform guidelines for Android, but can be used
 * on any platform.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/checkbox-enabled.android.png" />
 *     <figcaption>Enabled</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/checkbox-disabled.android.png" />
 *     <figcaption>Disabled</figcaption>
 *   </figure>
 * </div>
 */
declare const CheckboxAndroid: {
    ({ status, disabled, onPress, testID, ...rest }: Props): JSX.Element;
    displayName: string;
};
export default CheckboxAndroid;
export { CheckboxAndroid };
