import React, { forwardRef } from 'react';
import { Dimensions, Platform, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

import ActionSheet, { useScrollHandlers } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { List } from '@jmstechnologiesinc/react-native-paper';

const WINDOW_HEIGHT = Dimensions.get('window').height;

const CountryPicker = forwardRef(({ data, onSelect }, ref) => {
    const insets = useSafeAreaInsets();
    const scrollHandlers = useScrollHandlers('scrollview-1', ref);
    const HEADER_HEIGHT = useHeaderHeight();
    const actionSheetHeight = Platform.OS === 'ios' ? WINDOW_HEIGHT - HEADER_HEIGHT : null;

    return (
        <ActionSheet
            ref={ref}
            statusBarTranslucent={true}
            drawUnderStatusBar={false}
            springOffset={50}
            defaultOverlayOpacity={0.3}
            gestureEnabled
            containerStyle={{
                paddingBottom: insets.bottom,
                height: actionSheetHeight,
            }}
        >
            <ScrollView {...scrollHandlers}>
                {data?.map((item) => (
                    <List.Item
                        key={item.key}
                        title={item.label}
                        description={item.dialCode}
                        onPress={() => onSelect(item)}
                        left={(props) => <List.Image {...props} variant="flag" source={item.image} defaultImageComponent={true} />}
                    />
                ))}
            </ScrollView>
        </ActionSheet>
    );
});

export default CountryPicker;
