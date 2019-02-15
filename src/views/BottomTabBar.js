/* @flow */

import React from "react";
import { Animated, TouchableWithoutFeedback, StyleSheet, View, Platform } from "react-native";
import { SafeAreaView } from "@react-navigation/native";

import CrossFadeIcon from "./CrossFadeIcon";
import withDimensions from "../utils/withDimensions";

export type TabBarOptions = {
  activeTintColor?: string,
  inactiveTintColor?: string,
  activeBackgroundColor?: string,
  inactiveBackgroundColor?: string,
  allowFontScaling: boolean,
  showLabel: boolean,
  showIcon: boolean,
  labelStyle: any,
  tabStyle: any,
  adaptive?: boolean,
  style: any
};

type Props = TabBarOptions & {
  navigation: any,
  descriptors: any,
  jumpTo: any,
  onTabPress: any,
  onTabLongPress: any,
  getAccessibilityLabel: (props: { route: any }) => string,
  getButtonComponent: ({ route: any }) => any,
  getLabelText: ({ route: any }) => any,
  getTestID: (props: { route: any }) => string,
  renderIcon: any,
  dimensions: { width: number, height: number },
  isLandscape: boolean,
  safeAreaInset: { top: string, right: string, bottom: string, left: string }
};

const majorVersion = parseInt(Platform.Version, 10);
const isIos = Platform.OS === "ios";
const isIOS11 = majorVersion >= 11 && isIos;

const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;

class TouchableWithoutFeedbackWrapper extends React.Component<*> {
  render = () => (
    <TouchableWithoutFeedback
      onPress={this.props.onPress}
      onLongPress={this.props.onLongPress}
      testID={this.props.testID}
      hitSlop={{ left: 15, right: 15, top: 5, bottom: 5 }}
      accessibilityLabel={this.props.accessibilityLabel}
    >
      <View {...this.props} />
    </TouchableWithoutFeedback>
  );
}

class TabBarBottom extends React.Component<Props> {
  static defaultProps = {
    activeTintColor: "#007AFF",
    activeBackgroundColor: "transparent",
    inactiveTintColor: "#8E8E93",
    inactiveBackgroundColor: "transparent",
    showLabel: true,
    showIcon: true,
    allowFontScaling: true,
    adaptive: isIOS11,
    safeAreaInset: { bottom: "always", top: "never" }
  };

  _renderLabel = ({ route, focused }) => {
    const { activeTintColor, inactiveTintColor, labelStyle, showLabel, showIcon, allowFontScaling } = this.props;

    if (showLabel === false) {
      return null;
    }

    const label = this.props.getLabelText({ route });
    const tintColor = focused ? activeTintColor : inactiveTintColor;

    if (typeof label === "string") {
      return (
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            { color: tintColor },
            showIcon && this._shouldUseHorizontalLabels() ? styles.labelBeside : styles.labelBeneath,
            labelStyle
          ]}
          allowFontScaling={allowFontScaling}
        >
          {label}
        </Animated.Text>
      );
    }

    if (typeof label === "function") {
      return label({ route, focused, tintColor });
    }

    return label;
  };

  _renderIcon = ({ route, focused }, horizontal) =>
    this.props.showIcon && (
      <CrossFadeIcon
        route={route}
        horizontal={horizontal}
        navigation={this.props.navigation}
        activeOpacity={focused ? 1 : 0}
        inactiveOpacity={focused ? 0 : 1}
        activeTintColor={this.props.activeTintColor}
        inactiveTintColor={this.props.inactiveTintColor}
        renderIcon={this.props.renderIcon}
        style={[
          styles.iconWithExplicitHeight,
          this.props.showLabel === false && !horizontal && styles.iconWithoutLabel,
          this.props.showLabel !== false && !horizontal && styles.iconWithLabel
        ]}
      />
    );

  _shouldUseHorizontalLabels = () => {
    const { routes } = this.props.navigation.state;
    const { isLandscape, dimensions, adaptive, tabStyle } = this.props;

    if (!adaptive) {
      return false;
    }

    if (Platform.isPad) {
      let maxTabItemWidth = DEFAULT_MAX_TAB_ITEM_WIDTH;

      const flattenedStyle = StyleSheet.flatten(tabStyle);

      if (flattenedStyle) {
        if (typeof flattenedStyle.width === "number") {
          maxTabItemWidth = flattenedStyle.width;
        } else if (typeof flattenedStyle.maxWidth === "number") {
          maxTabItemWidth = flattenedStyle.maxWidth;
        }
      }

      return routes.length * maxTabItemWidth <= dimensions.width;
    } else {
      return isLandscape;
    }
  };

  renderButtonComponent = (route, index, ButtonComponent, scene) => (
    <ButtonComponent
      key={route.key}
      onPress={() => this.props.onTabPress({ route })}
      onLongPress={() => this.props.onTabLongPress({ route })}
      testID={this.props.getTestID({ route })}
      accessibilityLabel={this.props.getAccessibilityLabel({
        route
      })}
      style={[
        styles.tab,
        {
          backgroundColor: scene.focused ? this.props.activeBackgroundColor : this.props.inactiveBackgroundColor
        },
        this._shouldUseHorizontalLabels() ? styles.tabLandscape : styles.tabPortrait,
        this.props.tabStyle
      ]}
    >
      {this._renderIcon(scene, this._shouldUseHorizontalLabels())}
      {this._renderLabel(scene)}
    </ButtonComponent>
  );

  render = () => (
    <SafeAreaView
      style={[
        styles.tabBar,
        this._shouldUseHorizontalLabels() && !Platform.isPad ? styles.tabBarCompact : styles.tabBarRegular,
        this.props.style
      ]}
      forceInset={this.props.safeAreaInset}
    >
      {this.props.navigation.state.routes.map((route, index) =>
        this.renderButtonComponent(
          route,
          index,
          this.props.getButtonComponent({ route }) || TouchableWithoutFeedbackWrapper,
          { route, focused: index === this.props.navigation.state.index }
        )
      )}
    </SafeAreaView>
  );
}

const DEFAULT_HEIGHT = 49;
const COMPACT_HEIGHT = 29;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0, 0, 0, .3)",
    flexDirection: "row"
  },
  tabBarCompact: {
    height: COMPACT_HEIGHT
  },
  tabBarRegular: {
    height: DEFAULT_HEIGHT
  },
  tab: {
    flex: 1,
    alignItems: isIos ? "center" : "stretch"
  },
  tabPortrait: {
    justifyContent: "flex-end",
    flexDirection: "column"
  },
  tabLandscape: {
    justifyContent: "center",
    flexDirection: "row"
  },
  iconWithoutLabel: {
    flex: 1
  },
  iconWithLabel: {
    flex: 1
  },
  iconWithExplicitHeight: {
    height: Platform.isPad ? DEFAULT_HEIGHT : COMPACT_HEIGHT
  },
  label: {
    textAlign: "center",
    backgroundColor: "transparent"
  },
  labelBeneath: {
    fontSize: 11,
    marginBottom: 1.5
  },
  labelBeside: {
    fontSize: 12,
    marginLeft: 15
  }
});

export default withDimensions(TabBarBottom);
