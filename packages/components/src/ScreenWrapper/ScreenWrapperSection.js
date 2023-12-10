import * as React from 'react';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { List, Text } from '@jmstechnologiesinc/react-native-paper';

import ScreenWrapperContainer, { containerPaddings } from './ScreenWrapperContainer';
import { moderateScale } from 'react-native-size-matters';

const sectionPaddings = {
    ...containerPaddings,
    top: MD3LightTheme.spacing.x2,
    bottom: MD3LightTheme.spacing.x2,
};

export const ScreenWrapperSection = ({
    withPaddingHorizontal = false,
    title,
    description,
    titleStyle,
    style,
    children,
}) => (
    <ScreenWrapperContainer
        paddingTop={title ? 0 : sectionPaddings.top}
        paddingBottom={sectionPaddings.bottom}
        withPaddingHorizontal={withPaddingHorizontal}
        style={[{ flex: null }, style]}
    >
        {description ? (
            <>
                {title ? (
                    <List.Subheader style={[{ paddingHorizontal: 0, paddingBottom: 0 }, titleStyle]}>
                        {title}
                    </List.Subheader>
                ) : null}
                <Text
                    selectable={false}
                    style={{
                        fontSize: moderateScale(14),
                        color: MD3LightTheme.colors.onSurfaceVariant,
                        paddingBottom: moderateScale(13),
                    }}
                >
                    {description}
                </Text>
            </>
        ) : title ? (
            <List.Subheader style={[{ paddingHorizontal: 0 }, titleStyle]}>{title}</List.Subheader>
        ) : null}
        {children}
    </ScreenWrapperContainer>
);

export { sectionPaddings };

export default ScreenWrapperSection;
