import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';

import {AvatarImage, AvatarText} from './Avatar';

export default {
  title: 'packages/Avatar',
  component: AvatarImage,
};

export const Avatar = () => {
  return (
    <ScrollView
      style={[styles.container, {backgroundColor: '#fff'}]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.row}>
        <AvatarImage
          style={styles.avatar}
          source={require('../../../images/forest.jpg')}
        />
        <AvatarImage
          style={styles.avatar}
          source={require('../../../images/forest.jpg')}
          size={80}
        />
      </View>
      <View style={styles.row}>
        <AvatarText style={[styles.avatar]} label="XD" color={'#000'} />
        <AvatarText style={styles.avatar} label="XD" />
        <AvatarText style={styles.avatar} label="XD" size={80} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    margin: 8,
  },
  avatar: {
    margin: 8,
  },
});
