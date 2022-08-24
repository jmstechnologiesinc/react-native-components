import { StyleSheet } from 'react-native';
import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

const styles = StyleSheet.create({
    deleteBox: {
        flex: 1,
        backgroundColor: MD3LightTheme.colors.error,
        justifyContent: 'center',
        width: 90,
        flexDirection: 'row',
        alignItems: 'center',
    },

    title: {
        fontSize: 20,
        color: MD3LightTheme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default styles;
