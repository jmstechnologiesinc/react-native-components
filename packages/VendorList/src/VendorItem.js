import React from 'react';
import {StyleSheet} from 'react-native';
import {Card} from '@jmsstudiosinc/react-native-paper';

const renderVendorItem = ({item}) => {
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Cover source={{uri: item.photos}} />
      <Card.Title
        title={item.title}
        subtitle={`${item.formattedPub} - ${item.formattedHitDistance}`}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 4,
  },
});

export default renderVendorItem;
