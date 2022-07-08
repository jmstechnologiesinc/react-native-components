import React from 'react';
import {SectionList, StyleSheet, View} from 'react-native';

import {useTheme} from '@jmsstudiosinc/react-native-paper';

import fullFilteredVendors from './mockData.json';
import renderVendorItem from './VendorItem';

const VendorList = () => {
  const {
    colors: {background},
  } = useTheme();

  return (
    <View
      style={[styles.container, {backgroundColor: background}]}
      contentContainerStyle={styles.content}>
      <SectionList
        sections={[{data: fullFilteredVendors}]}
        renderItem={renderVendorItem}
        keyExtractor={item => `${item.id}`}
        stickySectionHeadersEnabled={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 4,
  },
});
export default VendorList;
