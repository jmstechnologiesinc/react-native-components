import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card} from '@jmsstudiosinc/react-native-paper';

const renderVendorItem = ({item}) => {
  return (
    <View style={[styles.container]} contentContainerStyle={styles.content}>
      <Card style={styles.card} mode="elevated">
        <Card.Cover source={{uri: item.photos}} />
        <Card.Title
          title={item.title}
          subtitle={`${item.formattedPub} - ${item.formattedHitDistance}`}
          titleVariant="headlineSmall"
          subtitleVariant="bodyLarge"
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 4,
  },
  card: {
    margin: 4,
    marginHorizontal: 8,
  },
});

export default renderVendorItem;
