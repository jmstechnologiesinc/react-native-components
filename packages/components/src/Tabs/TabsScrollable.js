import * as React from 'react';

import { View, Dimensions, ScrollView } from 'react-native';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import * as Tabs from './Tabs';

// The width used to be read ONCE, at module load: a resized browser window (or
// a rotated tablet) kept the tabs at the old width, and a tab bar inside a
// narrower pane was as wide as the whole window. The window width now follows
// `Dimensions`, and the scroll maths use the width the bar was actually laid
// out at. `style` lets a host size the bar to its container instead.
// `accessibilityRole` (default `tablist`, `null` for none), `accessibilityLabel` and `testID` go to the
// `Tabs.List` inside, which carries the tab semantics and the web keyboard navigation.
export default class TabsScrollable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.scrollViewRef = React.createRef();
        this._tabContainerMeasurements;
        this._tabsMeasurements = {};
        this._scrollViewWidth = null;
        this.state = { windowWidth: Dimensions.get('window').width };
    }

    componentDidMount() {
        this._dimensionsSubscription = Dimensions.addEventListener('change', ({ window }) =>
            this.setState({ windowWidth: window.width })
        );
    }

    componentWillUnmount() {
        this._dimensionsSubscription?.remove();
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

        const containerWidth = this._scrollViewWidth ?? this.state.windowWidth;
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

    onScrollViewLayout = (e) => {
        this._scrollViewWidth = e.nativeEvent.layout.width;
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
            <ScrollView
                style={[
                    {
                        width: this.state.windowWidth,
                        flexDirection: 'row',
                        backgroundColor: MD3LightTheme.colors.surface,
                    },
                    this.props.style,
                ]}
                onLayout={this.onScrollViewLayout}
                ref={this.scrollViewRef}
                showsHorizontalScrollIndicator={false}
                horizontal
            >
                <View onLayout={this.onTabsContainerLayout}>
                    <Tabs.List
                        style={this.props.tabsListStyle}
                        accessibilityRole={this.props.accessibilityRole}
                        accessibilityLabel={this.props.accessibilityLabel}
                        testID={this.props.testID}
                    >
                        {React.Children.toArray(this.props.children).map((child, index) => (
                            <View key={`scrollable-${child.key}`} onLayout={this.onTabsItemLayout(index)}>
                                {child}
                            </View>
                        ))}
                    </Tabs.List>
                </View>
            </ScrollView>
        );
    }
}
