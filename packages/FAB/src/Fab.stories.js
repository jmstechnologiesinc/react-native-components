import React from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import Portal from '../../ReactNativePaper/components/Portal/PortalHost';
import {FAB} from '@jmsstudiosinc/react-native-paper';
import useState from 'storybook-addon-state';

import {
  faEyeDropper,
  faEye,
  faCheck,
  faUserPlus,
  faCalendar,
  faPlus,
  faHourglassStart,
  faVoicemail,
  faHeart,
} from '@fortawesome/pro-regular-svg-icons';

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
          icon={visible ? faEye : faEyeDropper}
          style={styles.fab}
          onPress={() => setVisible(!visible)}
        />
      </View>

      <View style={styles.row}>
        <FAB
          icon={faHeart}
          style={styles.fab}
          onPress={() => {}}
          visible={visible}
        />
        <FAB
          icon={faCheck}
          label="Extended FAB"
          style={styles.fab}
          onPress={() => {}}
          visible={visible}
        />
        <FAB
          icon={faUserPlus}
          label="Disabled FAB"
          style={styles.fab}
          onPress={() => {}}
          visible={visible}
          disabled
        />

        <Portal>
          <FAB
            icon={faUserPlus}
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
        icon={open ? faCalendar : faPlus}
        actions={[
          {icon: faPlus, onPress: () => {}},
          {icon: faHourglassStart, label: 'Star', onPress: () => {}},
          {icon: faVoicemail, label: 'Email', onPress: () => {}},
          {icon: faVoicemail, label: 'Remind', onPress: () => {}},
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
