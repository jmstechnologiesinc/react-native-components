import React from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import Portal from '../../ReactNativePaper/components/Portal/PortalHost';
import FAB from './Fab';
import useState from 'storybook-addon-state';

export default {
  title: 'packages/FAB',
  component: FAB,
};

export const Fabs = () => {
  const [visible, setVisible] = useState();
  const [open, setOpen] = useState();

  return (
    <View style={[styles.container, {backgroundColor: '#ffff'}]}>
      <View style={styles.row}>
        <FAB
          small
          icon={visible ? 'eye-off' : 'eye'}
          style={styles.fab}
          onPress={() => setVisible(!visible)}
        />
      </View>

      <View style={styles.row}>
        <FAB
          icon="heart"
          style={styles.fab}
          onPress={() => {}}
          visible={visible}
        />
        <FAB
          icon="check"
          label="Extended FAB"
          style={styles.fab}
          onPress={() => {}}
          visible={visible}
        />
        <FAB
          icon="cancel"
          label="Disabled FAB"
          style={styles.fab}
          onPress={() => {}}
          visible={visible}
          disabled
        />

        <Portal>
          <FAB
            icon="cancel"
            label="Loading FAB"
            style={styles.fab}
            onPress={() => setVisible(!visible)}
            visible={visible}
            loading
          />
        </Portal>
      </View>

      <FAB.Group
        open={open}
        icon={open ? 'calendar-today' : 'plus'}
        actions={[
          {icon: 'plus', onPress: () => {}},
          {icon: 'star', label: 'Star', onPress: () => {}},
          {icon: 'email', label: 'Email', onPress: () => {}},
          {icon: 'bell', label: 'Remind', onPress: () => {}},
        ]}
        onStateChange={({open}) => setOpen(open)}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
        visible={visible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    padding: 4,
  },

  row: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#000',
  },

  fab: {
    margin: 8,
  },
});
