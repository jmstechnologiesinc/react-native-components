import React from 'react';
import {StyleSheet} from 'react-native';
import {Card, useTheme} from '@jmsstudiosinc/react-native-paper';

const renderVendorItem = ({item}) => {
  const {colors} = useTheme();
  return (
    <View
      style={[styles.container, {backgroundColor: colors?.background}]}
      contentContainerStyle={styles.content}>
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
