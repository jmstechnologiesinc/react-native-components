import * as React from 'react';

import { View, Dimensions, ScrollView } from 'react-native';

import {  MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import * as Tabs from './Tabs';

const WindowWidth = Dimensions.get('window').width;
export default class TabsScrollable extends React.PureComponent {

    constructor(props) {
        super(props);
        this.scrollViewRef = React.createRef();
        this._tabContainerMeasurements;
        this._tabsMeasurements = {};
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentIndex !== prevProps.currentIndex) {
            if (this.scrollViewRef.current) {
                this.scrollViewRef.current.scrollTo({
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

        if (!this._tabsMeasurements[position]?.width) {
            return pageOffset;
        }

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

    onTabsContainerLayout = (e) => {
        this._tabContainerMeasurements = e.nativeEvent.layout;
    };

    onTabsItemLayout = (key) => (ev) => {
        const { x, width, height } = ev.nativeEvent.layout;
        this._tabsMeasurements[key] = {
            left: x,
            right: x + width,
            width,
            height,
        };
    };

    render() {
        return (
            <View style={{
                width: WindowWidth, 
                flexDirection: 'row', 
                backgroundColor: MD3LightTheme.colors.background}}>
                <ScrollView ref={this.scrollViewRef} showsHorizontalScrollIndicator={false} horizontal>
                    <View onLayout={this.onTabsContainerLayout}>
                        <Tabs.List style={this.props.tabsListStyle}>
                            {React.Children.toArray(this.props.children).map((child, index) =>
                                <View key={`scrollable-${child.key}`} onLayout={this.onTabsItemLayout(index)}>{child}</View>  
                            )}
                        </Tabs.List>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
