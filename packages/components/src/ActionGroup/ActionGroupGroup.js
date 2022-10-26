import * as React from 'react';

import { View, StyleSheet } from 'react-native';

import ButtonGroup from './ActionGroupButtons';

const ActionGroupGroup = ({children, style}) => (
    <View style={[styles.container, style]}>
        {React.Children.toArray(children).map((child) => {
            if(child.type === ButtonGroup && React.Children.count(children) > 1) {
              return (
                <View style={[styles.row, {justifyContent: "flex-end"}]}>
                    {React.cloneElement(child, {compact: true})}
                </View>
              )
            } 

            return child
        })}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: "space-between"
    },
    row: {
        flexDirection: "row",
        flex: 1,
    }
  });

export default ActionGroupGroup;
