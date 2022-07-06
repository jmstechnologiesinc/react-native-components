import React from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';

import useState from 'storybook-addon-state';

import {Caption, Searchbar} from '@jmsstudiosinc/react-native-paper';

import {faArrowLeft, faSearch} from '@fortawesome/pro-regular-svg-icons';

export default {
  title: 'Component/Search',
  component: Searchbar,
};

export const Searchs = () => {
  const [firstQuery, setFirstQuery] = useState();
  const [secondQuery, setSecondQuery] = useState();
  const [thirdQuery, setThirdQuery] = useState();

  return (
    <View style={[styles.container, {backgroundColor: '#fff'}]}>
      <Searchbar
        icon={faSearch}
        placeholder="Search"
        onChangeText={query => setFirstQuery(query)}
        value={firstQuery}
        style={styles.searchbar}
      />
      <Caption style={styles.caption}>Clickable icon</Caption>
      <Searchbar
        placeholder="Search"
        onChangeText={query => setSecondQuery(query)}
        value={secondQuery}
        onIconPress={() => navigation.goBack()}
        icon={faArrowLeft}
        style={styles.searchbar}
      />
      <Searchbar
        placeholder="Search"
        onChangeText={query => setThirdQuery(query)}
        value={thirdQuery}
        onIconPress={/* In real code, this will open the drawer */ () => {}}
        icon={faSearch}
        style={styles.searchbar}
      />
    </View>
  );
};

SearchExample.title = 'Searchbar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bbb',
  },
  caption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchbar: {
    margin: 4,
  },
});
