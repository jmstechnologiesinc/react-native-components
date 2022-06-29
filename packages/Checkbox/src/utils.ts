import color from 'color';
import theme from './LightTheme';

const getAndroidCheckedColor = ({customColor}: {customColor?: string}) => {
  if (customColor) {
    return customColor;
  }

  if (theme.isV3) {
    return theme.colors.primary;
  }

  return theme.colors.accent;
};

const getAndroidUncheckedColor = ({
  customUncheckedColor,
}: {
  customUncheckedColor?: string;
}) => {
  if (customUncheckedColor) {
    return customUncheckedColor;
  }

  if (theme.isV3) {
    return theme.colors.onSurfaceVariant;
  }

  if (theme.dark) {
    return color(theme.colors.text).alpha(0.7).rgb().string();
  }

  return color(theme.colors.text).alpha(0.54).rgb().string();
};

const getAndroidRippleColor = ({
  checkedColor,
  disabled,
}: {
  checkedColor: string;
  disabled?: boolean;
}) => {
  if (disabled) {
    if (theme.isV3) {
      return color(theme.colors.onSurface).alpha(0.16).rgb().string();
    }
    return color(theme.colors.text).alpha(0.16).rgb().string();
  }

  return color(checkedColor).fade(0.32).rgb().string();
};

const getAndroidControlColor = ({
  checked,
  disabled,
  checkedColor,
  uncheckedColor,
}: {
  checked: boolean;
  checkedColor: string;
  uncheckedColor: string;
  disabled?: boolean;
}) => {
  if (disabled) {
    if (theme.isV3) {
      return theme.colors.onSurfaceDisabled;
    }
    return theme.colors.text;
  }

  if (checked) {
    return checkedColor;
  }
  return uncheckedColor;
};

export const getAndroidSelectionControlColor = ({
  disabled,
  checked,
  customColor,
  customUncheckedColor,
}: {
  checked: boolean;
  disabled?: boolean;
  customColor?: string;
  customUncheckedColor?: string;
}) => {
  const checkedColor = getAndroidCheckedColor({customColor});
  const uncheckedColor = getAndroidUncheckedColor({
    customUncheckedColor,
  });
  return {
    rippleColor: getAndroidRippleColor({checkedColor, disabled}),
    selectionControlColor: getAndroidControlColor({
      disabled,
      checked,
      checkedColor,
      uncheckedColor,
    }),
  };
};

const getIOSCheckedColor = ({
  disabled,
  customColor,
}: {
  customColor?: string;
  disabled?: boolean;
}) => {
  if (disabled) {
    if (theme.isV3) {
      return theme.colors.onSurfaceDisabled;
    }
    return theme.colors.disabled;
  }

  if (customColor) {
    return customColor;
  }

  if (theme.isV3) {
    return theme.colors.primary;
  }

  return theme.colors.accent;
};

const getIOSRippleColor = ({
  checkedColor,
  disabled,
}: {
  checkedColor: string;
  disabled?: boolean;
}) => {
  if (disabled) {
    if (theme.isV3) {
      return color(theme.colors.onSurface).alpha(0.16).rgb().string();
    }
    return color(theme.colors.text).alpha(0.16).rgb().string();
  }
  return color(checkedColor).fade(0.32).rgb().string();
};

export const getSelectionControlIOSColor = ({
  disabled,
  customColor,
}: {
  disabled?: boolean;
  customColor?: string;
}) => {
  const checkedColor = getIOSCheckedColor({disabled, customColor});
  return {
    checkedColor,
    rippleColor: getIOSRippleColor({
      checkedColor,
      disabled,
    }),
  };
};
