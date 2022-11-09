import * as React from 'react';

import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import { List } from '@jmsstudiosinc/react-native-paper';

import ScreenWrapperContainer, { containerPaddings } from './ScreenWrapperContainer';

const sectionPaddings = {
    ...containerPaddings,
    bottom: MD3LightTheme.spacing.x2,
};

export const ScreenWrapperSection = ({ withPaddingHorizontal = false, title, titleStyle, style, children }) => (
    <ScreenWrapperContainer
        paddingTop={sectionPaddings.top}
        paddingBottom={sectionPaddings.bottom}
        withPaddingHorizontal={withPaddingHorizontal}
        style={[{flex: null}, style]}
    >
        {title ? <List.Subheader style={[{ paddingHorizontal: 0 }, titleStyle]}>{title}</List.Subheader> : null}
        {children}
    </ScreenWrapperContainer>
);

export { sectionPaddings };

export default ScreenWrapperSection;
