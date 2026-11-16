import React from 'react';
import { StyleSheet, View } from 'react-native';

// The map's box on the web, shared by the map and by the placeholder index.web.js shows while the map's code loads,
// so the page keeps the same layout before and after. A `flex: 1` would beat the consumer's height: in CSS flex the
// 0 flex-basis wins over `height` and the map collapses to 0 (the order detail asks for 300). With an explicit
// height the box needs no flex.
const MapboxGLWrapperContainer = ({ style, children }) => {
    const hasExplicitHeight = StyleSheet.flatten(style)?.height != null;

    return <View style={[hasExplicitHeight ? null : styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default MapboxGLWrapperContainer;
