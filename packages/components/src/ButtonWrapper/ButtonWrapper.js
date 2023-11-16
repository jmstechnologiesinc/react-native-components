const { MATERIAL_ICONS } = require("@jmstechnologiesinc/commons");
const { Button, MD3LightTheme } = require("@jmstechnologiesinc/react-native-paper");

const ButtonWrapper = ({
    title,
    isDisabled,
    style,
    onPress
}) => (
    <Button
        disabled={isDisabled}
        icon={MATERIAL_ICONS.increment}
        onPress={onPress}                    
        style={[styles, style]}>
        {title}
    </Button>
);

const styles = {
    flexDirection: 'row',
    marginLeft: MD3LightTheme.spacing.x4,
}

export default ButtonWrapper