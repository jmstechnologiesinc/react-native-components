import * as React from 'react';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { List } from '@jmstechnologiesinc/react-native-paper';

import MutedText from '../MutedText/MutedText';
import ScreenWrapperContainer, { containerPaddings } from './ScreenWrapperContainer';

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
                {/* MD3 supporting text, on the 4 dp spacing grid. */}
                <MutedText style={{ paddingBottom: MD3LightTheme.spacing.x3 }}>{description}</MutedText>
            </>
        ) : title ? (
            <List.Subheader style={[{ paddingHorizontal: 0 }, titleStyle]}>{title}</List.Subheader>
        ) : null}
        {children}
    </ScreenWrapperContainer>
);

export { sectionPaddings };

export default ScreenWrapperSection;
