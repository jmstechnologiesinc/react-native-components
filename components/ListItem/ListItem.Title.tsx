import React from 'react';
import { StyleSheet, Platform, TextProps } from 'react-native';
import { RneFunctionComponent } from '../helpers';
import { TextWrapper } from '../TextWrapper';

const ANDROID_SECONDARY = 'rgba(0, 0, 0, 0.54)';

export interface ListItemTitleProps extends TextProps {
  /**Add right title. */
  right?: boolean;
}

/** This allows adding Title to the ListItem.
 * This, Receives all [TextWrapper](text#props) props. */
export const ListItemTitle: RneFunctionComponent<ListItemTitleProps> = ({
  style,
  right,
  children,
  ...rest
}) => {
  return (
    <TextWrapper
      testID="listItemTitle"
      style={StyleSheet.flatten([
        styles.title,
        right && styles.rightTitle,
        style,
      ])}
      {...rest}
    >
      {children}
    </TextWrapper>
  );
};

/** Allows adding a title to the ListItem.
 * This, Receives all [TextWrapper](text.mdx#props) props. */
const styles = StyleSheet.create({
  title: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        fontSize: 17,
      },
      default: {
        fontSize: 16,
      },
    }),
  },
  rightTitle: {
    color: ANDROID_SECONDARY,
  },
});

ListItemTitle.displayName = 'ListItem.Title';
