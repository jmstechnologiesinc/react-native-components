import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  optionTopTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 8,
  },

  tabItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchContainer: {
    alignItems: 'center',
    paddingVertical: 2,
    margin: 5,
    flex: 1,
    justifyContent: 'center',
    borderRadius: 10,
  },

  tabContainer: {
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
  },
});

export default styles;
