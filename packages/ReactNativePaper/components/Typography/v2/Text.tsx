import * as React from 'react';
import {
  Text as NativeText,
  TextStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';

import theme from '../../../styles/themes/v3/LightTheme';

type Props = React.ComponentProps<typeof NativeText> & {
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
};

// @component-group Typography

/**
 * Text component which follows styles from the theme.
 *
 * @extends Text props https://reactnative.dev/docs/text#props
 */
const Text: React.ForwardRefRenderFunction<{}, Props> = (
  {style, ...rest}: Props,
  ref,
) => {
  const root = React.useRef<NativeText | null>(null);

  React.useImperativeHandle(ref, () => ({
    setNativeProps: (args: Object) => root.current?.setNativeProps(args),
  }));

  return (
    <NativeText
      {...rest}
      ref={root}
      style={[
        {
          ...(!theme.isV3 && theme.fonts?.regular),
          color: theme.isV3 ? theme.colors?.onSurface : theme.colors.text,
        },
        styles.text,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

export default React.forwardRef(Text);
