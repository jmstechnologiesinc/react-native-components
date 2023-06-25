import React from 'react';

import { moderateScale } from 'react-native-size-matters';
import color from 'color';

import { MD3LightTheme, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';

const TouchableRippleWrapper = ({ 
    isSelected,
    children,
    ...props
 }) => { 
       
    const borderRadius = moderateScale(MD3LightTheme.roundness);
    let backgroundColor;
    let underlayColor;

    if(isSelected) {
        backgroundColor = MD3LightTheme.colors.secondaryContainer;
        underlayColor = color(backgroundColor)
            .mix(color(MD3LightTheme.colors.onSecondaryContainer), 0.16)
            .rgb()
            .toString();
    }

    return (
        <TouchableRipple
          borderless
          delayPressIn={0}
          underlayColor={underlayColor}
          style={[{backgroundColor, borderRadius}]}
          {...props}>
          {children}
        </TouchableRipple>  
    );
};


export default TouchableRippleWrapper;
