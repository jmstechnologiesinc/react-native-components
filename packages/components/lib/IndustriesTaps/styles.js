import { Platform, StyleSheet } from 'react-native';

const platform = Platform.OS === 'web';

const styles = StyleSheet.create({
    icon: {
        marginLeft: platform ? -12 : null,
        marginRight: platform ? 8 : null,
        marginTop: 10,
    },
});

export default styles;
