import React from 'react';
import { StyleSheet, Platform, TextProps } from 'react-native';
import { RneFunctionComponent } from '../helpers';
import { TextWrapper } from '../TextWrapper';

const ANDROID_SECONDARY = 'rgba(0, 0, 0, 0.54)';

export interface ListItemSubtitleProps extends TextProps {
  right?: boolean;
}

/** This allows adding SubTitle to the ListItem.
 * This, Receives all [TextWrapper](text#props) props. */
export const ListItemSubtitle: RneFunctionComponent<ListItemSubtitleProps> = ({
  style,
  right,
  children,
  ...props
}) => {
  return (
    <TextWrapper
      testID="listItemTitle"
      style={StyleSheet.flatten([
        styles.subtitle,
        right && styles.rightSubtitle,
        style,
      ])}
      {...props}
    >
      {children}
    </TextWrapper>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        fontSize: 15,
      },
      default: {
        fontSize: 14,
      },
    }),
  },
  rightSubtitle: {
    color: ANDROID_SECONDARY,
  },
});

ListItemSubtitle.displayName = 'ListItem.Subtitle';
