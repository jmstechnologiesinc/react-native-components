import React from 'react';
import { FlatList, View } from 'react-native';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { useFeedColumns } from '../Layout/Feed';
import { sectionPaddings } from '../ScreenWrapper/ScreenWrapperSection';
import VendorListItem from './VendorListItem';

const keyExtractor = (item) => `vendor-list-${item.id}`;
const Separator = () => <View style={{ marginBottom: MD3LightTheme.spacing.x2 }} />;

/**
 * The vendors as MD3's feed (Layout `Feed`), virtualized: one column of cards on a phone and more where they fit,
 * each card as wide as its column. `sections` is each section's `data`, in order, in one feed. With
 * `withPaddingHorizontal` the cards keep the screen's side margins and the header (`ListHeaderComponent`) spans the
 * whole width.
 */
const VendorList = ({ sections, onPress, withPaddingHorizontal, ...props }) => {
    const { columns, itemWidth, gap, onLayout } = useFeedColumns(
        withPaddingHorizontal ? sectionPaddings.left + sectionPaddings.right : 0
    );
    // A row of several columns keeps the side margins and the gap (FlatList's `columnWrapperStyle`, which a single
    // column does not have); a single column's card keeps the margins itself.
    const rowMargins = withPaddingHorizontal
        ? { paddingLeft: sectionPaddings.left, paddingRight: sectionPaddings.right }
        : null;
    const cardMargins = withPaddingHorizontal
        ? { marginLeft: sectionPaddings.left, marginRight: sectionPaddings.right }
        : null;

    return (
        <FlatList
            {...props}
            // React Native does not change a FlatList's columns once it is mounted: a new count is a new list.
            key={`vendor-list-columns-${columns}`}
            data={sections.flatMap((section) => section.data)}
            numColumns={columns}
            columnWrapperStyle={columns > 1 ? [{ gap }, rowMargins] : undefined}
            onLayout={onLayout}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => (
                <VendorListItem
                    item={item}
                    width={itemWidth}
                    style={columns > 1 ? null : cardMargins}
                    onPress={onPress}
                />
            )}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={Separator}
            ListFooterComponent={Separator}
        />
    );
};

export default VendorList;
