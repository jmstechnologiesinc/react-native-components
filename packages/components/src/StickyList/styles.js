import { StyleSheet } from 'react-native';
import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

const DynamicAppStyles = {
    lightColorSet: {
        mainThemeBackgroundColor: '#ffffff',
        mainTextColor: '#555555',
        mainSubtextColor: '#7e7e7e',
        mainThemeForegroundColor: '#281a62',
        mainSubBtnTheme: '#7e7e7e',
        mainBtnTheme: '#281a62',
        hairlineColor: '#e0e0e0',
        grey: 'grey',
        grey0: '#eaeaea',
        grey3: '#e6e6f2',
        grey2: '#f2f2f2',
        grey6: '#d6d6d6',
        grey9: '#939393',
        whiteSmoke: '#f5f5f5',
        grey: '#808080',
        red: '#FF0000',
        cream: '#eeeeee',
        placeholderTextColor: '#aaaaaa',
        black: '#000',
        fillColor: '#007aff',
        unfillColor: 'transparent',
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MD3LightTheme.colors.background,
    },
    image: {
        height: 250,
    },

    coverPhotoContainer: {
        maxHeight: 200,
    },

    subHeaderContainer: {
        flex: 1,
        backgroundColor: DynamicAppStyles.lightColorSet.mainThemeBackgroundColor,
        marginTop: 20,
    },
    animatedTab: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerAnaimeted: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    breadcrumb: {
        backgroundColor: DynamicAppStyles.lightColorSet.whiteSmoke,
        borderBottomColor: DynamicAppStyles.lightColorSet.grey3,
        borderBottomWidth: 1,
        height: 50,
    },
});

export default styles;
