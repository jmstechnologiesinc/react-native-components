import * as React from 'react';

import { View, Dimensions } from 'react-native';

import * as Tabs from '../Tabs/Tabs';

const WindowWidth = Dimensions.get('window').width;

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
        const { sections } = this.props;

        if (!sections.length) {
            return null;
        }

        return (
            <View
                style={{
                    width: WindowWidth,
                    flexDirection: 'row',
                }}
            >
                <Tabs.Scrollable
                    title={this.props.title}
                    data={sections}
                    ref={this.scrollView}
                    selectedIndex={this.props.currentIndex}
                    onPress={this.props.onPress}
                    onTabsContainerLayout={this.onTabsContainerLayout}
                    onTabsItemLayout={this.onTabsItemLayout}
                />
                {/*     <TouchableOpacity
                    onPress={this.props?.onExpand}
                    style={{
                        flex: 1,
                        borderBottomWidth: 1,
                        backgroundColor: DynamicAppStyles.lightColorSet.whiteSmoke,
                        borderColor: DynamicAppStyles.lightColorSet.grey3,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                </TouchableOpacity> */}
            </View>
        );
    }
}
