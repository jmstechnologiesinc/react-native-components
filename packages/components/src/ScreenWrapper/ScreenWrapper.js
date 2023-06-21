import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MD3LightTheme } from '@/react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScreenWrapper({
    children,
    withScrollView = true,
    withBottomInset = true,
    withTopInset = false,
    style,
    contentContainerStyle,
    ...rest
}) {
    const insets = useSafeAreaInsets();
    const isInsetsBottom = insets.bottom === 0 ? MD3LightTheme.spacing.x4 : insets.bottom;

    const containerStyle = [
        styles.container,
        {
            backgroundColor: MD3LightTheme.colors.background,
            paddingTop: withTopInset ? insets.top : 0,
            paddingBottom: withBottomInset ? isInsetsBottom : 0,
            paddingLeft: insets.left,
            paddingRight: insets.left,
        },
    ];

    return (
        <>
            {withScrollView ? (
                <View style={containerStyle}>
                    <ScrollView
                        {...rest}
                        contentContainerStyle={contentContainerStyle}
                        alwaysBounceVertical={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                    </ScrollView>
                </View>
            ) : (
                <View style={[containerStyle, style]}>{children}</View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
