import * as React from 'react';

import { View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';

import * as Tabs from '../Tabs/Tabs';

const DynamicAppStyles = {
    lightColorSet: {
        mainThemeBackgroundColor: '#ffffff',
        mainTextColor: '#555555',
        mainSubtextColor: '#7e7e7e',
        mainThemeForegroundColor: '#281a62',
        mainSubBtnTheme: '#7e7e7e',
        mainBtnTheme: '#281a62',
        hairlineColor: '#e0e0e0',
        grey: 'grey',
        grey0: '#eaeaea',
        grey3: '#e6e6f2',
        grey2: '#f2f2f2',
        grey6: '#d6d6d6',
        grey9: '#939393',
        whiteSmoke: '#f5f5f5',
        grey: '#808080',
        red: '#FF0000',
        cream: '#eeeeee',
        placeholderTextColor: '#aaaaaa',
        black: '#000',
        fillColor: '#007aff',
        unfillColor: 'transparent',
    },
};

const WindowWidth = Dimensions.get('window').width - 50;

export default class StickySectionTabsList extends React.PureComponent {
    private scrollView = React.createRef();
    private _tabContainerMeasurements;
    private _tabsMeasurements = {};

    componentDidUpdate(prevProps) {
        if (this.props.currentIndex !== prevProps.currentIndex) {
            if (this.scrollView.current) {
                this.scrollView.current.scrollTo({
                    x: this.getScrollAmount(),
                    animated: true,
                });
            }
        }
    }

    getScrollAmount = () => {
        const { currentIndex } = this.props;
        const position = currentIndex;
        const pageOffset = 0;

        const containerWidth = WindowWidth;
        const tabWidth = this._tabsMeasurements[position].width;
        const nextTabMeasurements = this._tabsMeasurements[position + 1];
        const nextTabWidth = (nextTabMeasurements && nextTabMeasurements.width) || 0;
        const tabOffset = this._tabsMeasurements[position].left;
        const absolutePageOffset = pageOffset * tabWidth;
        let newScrollX = tabOffset + absolutePageOffset;

        newScrollX -= (containerWidth - (1 - pageOffset) * tabWidth - pageOffset * nextTabWidth) / 2;
        newScrollX = newScrollX >= 0 ? newScrollX : 0;

        const rightBoundScroll = Math.max(this._tabContainerMeasurements.width - containerWidth, 0);

        newScrollX = newScrollX > rightBoundScroll ? rightBoundScroll : newScrollX;
        return newScrollX;
    };

    onTabContainerLayout = (e) => {
        this._tabContainerMeasurements = e.nativeEvent.layout;
    };

    onTabLayout = (key) => (ev) => {
        const { x, width, height } = ev.nativeEvent.layout;
        this._tabsMeasurements[key] = {
            left: x,
            right: x + width,
            width,
            height,
        };
    };

    render() {
        const { sections } = this.props;

        if (!sections.length) {
            return null;
        }

        return (
            <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                <View style={[{ width: WindowWidth }]}>
                    <ScrollView ref={this.scrollView} showsHorizontalScrollIndicator={false} horizontal>
                        <View onLayout={this.onTabContainerLayout}>
                            <Tabs.List>
                                {sections.map((item, index) => (
                                    <Tabs.Item
                                        key={'sticky-list-' + item.id}
                                        title={item.title}
                                        isSelected={this.props.currentIndex === index}
                                        onPress={() => onPress(index)}
                                        onLayout={this.onTabLayout(index)}
                                    />
                                ))}
                            </Tabs.List>
                        </View>
                    </ScrollView>
                </View>
                <TouchableOpacity
                    onPress={this.props?.onExpand}
                    style={{
                        flex: 1,
                        borderBottomWidth: 1,
                        backgroundColor: DynamicAppStyles.lightColorSet.whiteSmoke,
                        borderColor: DynamicAppStyles.lightColorSet.grey3,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                ></TouchableOpacity>
            </View>
        );
    }
}
