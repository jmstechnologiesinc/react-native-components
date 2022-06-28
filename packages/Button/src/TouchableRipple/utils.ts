import color from 'color';
import theme from '../LightTheme';

const getUnderlayColor = ({
  calculatedRippleColor,
  underlayColor,
}: {
  calculatedRippleColor: string;
  underlayColor?: string;
}) => {
  if (underlayColor != null) {
    return underlayColor;
  }

  if (theme.isV3) {
    return color(calculatedRippleColor).rgb().string();
  }

  return color(calculatedRippleColor).fade(0.5).rgb().string();
};

const getRippleColor = ({rippleColor}: {rippleColor?: string}) => {
  if (rippleColor) {
    return rippleColor;
  }

  if (theme.isV3) {
    return color(theme.colors.onSurface).alpha(0.12).rgb().string();
  }

  if (theme.dark) {
    return color(theme.colors.text).alpha(0.32).rgb().string();
  }
  return color(theme.colors.text).alpha(0.2).rgb().string();
};

export const getTouchableRippleColors = ({
  rippleColor,
  underlayColor,
}: {
  rippleColor?: string;
  underlayColor?: string;
}) => {
  const calculatedRippleColor = getRippleColor({rippleColor});
  return {
    calculatedRippleColor,
    calculatedUnderlayColor: getUnderlayColor({
      calculatedRippleColor,
      underlayColor,
    }),
  };
};
