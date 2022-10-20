import * as React from 'react';
import { ScrollView, StyleSheet, Image, View } from 'react-native';
import { List, Text, Chip, Divider, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import { moderateScale } from 'react-native-size-matters';

const ListSectionExample = () => {
    const image =
        'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?cs=srgb&dl=pexels-dana-tentis-262959.jpg&fm=jpg&_gl=1*7ljoe5*_ga*MTUyNjkzODc0My4xNjY2Mjk2NDcw*_ga_8JE65Q40S6*MTY2NjI5NjQ3My4xLjEuMTY2NjI5NjQ5MS4wLjAuMA..';

    return (
        <ScrollView style={[styles.container, { backgroundColor: MD3LightTheme.colors.background }]}>
            <List.Section>
                <List.Subheader>Single line</List.Subheader>
                <List.Item left={(props) => <List.Icon {...props} icon="calendar" />} title="List item 1" />
                <List.Item left={(props) => <List.Icon {...props} icon="wallet-giftcard" />} title="List item 2" />
                <List.Item
                    title="List item 3"
                    left={(props) => <List.Icon {...props} icon="folder" />}
                    right={(props) => <List.Icon {...props} icon="equal" />}
                />
            </List.Section>
            <Divider />
            <List.Section>
                <List.Subheader>Two line</List.Subheader>
                <List.Item
                    left={() => <Image source={{ uri: image }} style={styles.image} />}
                    title="List item 1"
                    description="Describes item 1"
                />
                <List.Item
                    left={() => <Image source={{ uri: image }} style={styles.image} />}
                    right={(props) => <List.Icon {...props} icon="information" />}
                    title="List item 2"
                    description="Describes item 2"
                />
            </List.Section>
            <Divider />
            <List.Section>
                <List.Subheader>Three line</List.Subheader>
                <List.Item
                    left={() => <Image source={{ uri: image }} style={styles.image} />}
                    title="List item 1"
                    description="Describes item 1. Example of a very very long description."
                />
                <List.Item
                    left={() => <Image source={{ uri: image }} style={styles.image} />}
                    right={(props) => <List.Icon {...props} icon="star-outline" />}
                    title="List item 2"
                    description="Describes item 2. Example of a very very long description."
                />
            </List.Section>
            <Divider />
            <List.Section>
                <List.Subheader>Custom description</List.Subheader>
                <List.Item
                    left={() => <Image source={{ uri: image }} style={styles.image} />}
                    right={(props) => <List.Icon {...props} icon="star-outline" />}
                    title="List Item 1"
                    description={({ ellipsizeMode, color: descriptionColor, fontSize }) => (
                        <View style={[styles.container, styles.column]}>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode={ellipsizeMode}
                                style={{ color: descriptionColor, fontSize }}
                            >
                                React Native Paper is a high-quality, standard-compliant Material Design library that
                                has you covered in all major use-cases.
                            </Text>
                            <View style={[styles.container, styles.row, { paddingTop: 8 }]}>
                                <Chip icon="home" onPress={() => {}}>
                                    DOCS.pdf
                                </Chip>
                            </View>
                        </View>
                    )}
                />
            </List.Section>
        </ScrollView>
    );
};

ListSectionExample.title = 'List.Section';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height: moderateScale(40),
        width: moderateScale(40),
        margin: moderateScale(8),
    },
    row: {
        flexDirection: 'row',
    },
    column: {
        flexDirection: 'column',
    },
});

export default ListSectionExample;
