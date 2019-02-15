/* @flow */

import * as React from "react";
import { TabRouter, StackActions, SceneView, createNavigator, NavigationActions } from "@react-navigation/core";

export type InjectedProps = {
  getLabelText: (props: { route: any }) => any,
  getAccessibilityLabel: (props: { route: any }) => string,
  getTestID: (props: { route: any }) => string,
  getButtonComponent: (props: { route: any }) => ?React.Component<*>,
  renderIcon: (props: {
    route: any,
    focused: boolean,
    tintColor: string,
    horizontal: boolean
  }) => React.Node,
  renderScene: (props: { route: any }) => ?React.Node,
  onIndexChange: (index: number) => any,
  onTabPress: (props: { route: any }) => mixed,
  onTabLongPress: (props: { route: any }) => mixed,
  navigation: any,
  descriptors: any,
  screenProps?: any
};

export default function createTabNavigator(TabView: React.ComponentType<*>) {
  class NavigationView extends React.Component<*, *> {
    _renderScene = ({ route }) => (
      <SceneView
        screenProps={this.props.screenProps}
        navigation={this.props.descriptors[route.key].navigation}
        component={this.props.descriptors[route.key].getComponent()}
      />
    );

    _renderIcon = ({ route, focused = true, tintColor, horizontal = false }) =>
      this.props.descriptors[route.key].options.tabBarIcon &&
      typeof this.props.descriptors[route.key].options.tabBarIcon === "function"
        ? this.props.descriptors[route.key].options.tabBarIcon({ focused, tintColor, horizontal })
        : this.props.descriptors[route.key].options.tabBarIcon;

    _getButtonComponent = ({ route }) => this.props.descriptors[route.key].options.tabBarButtonComponent || null;

    _getLabelText = ({ route }) =>
      this.props.descriptors[route.key].options.tabBarLabel
        ? this.props.descriptors[route.key].options.tabBarLabel
        : typeof this.props.descriptors[route.key].options.title === "string"
          ? this.props.descriptors[route.key].options.title
          : route.routeName;

    _tryGetLabel = (label, route) =>
      typeof label === "string" &&
      `${label}, tab, ${this.props.navigation.state.routes.indexOf(route) + 1} of ${
        this.props.navigation.state.routes.length
      }`;

    _getAccessibilityLabel = ({ route }) =>
      typeof this.props.descriptors[route.key].options.tabBarAccessibilityLabel !== "undefined"
        ? this.props.descriptors[route.key].options.tabBarAccessibilityLabel
        : this._tryGetLabel(this._getLabelText({ route }), route);

    _getTestID = ({ route }) => this.props.descriptors[route.key].options.tabBarTestID;

    _makeDefaultHandler = ({ route, navigation }) => () => {
      if (navigation.isFocused()) {
        if (route.hasOwnProperty("index") && route.index > 0) {
          // If current tab has a nested navigator, pop to top
          navigation.dispatch(StackActions.popToTop({ key: route.key }));
        } else {
          navigation.emit("refocus");
        }
      } else {
        this._jumpTo(route.routeName);
      }
    };

    _handleTabPress = ({ route }) => {
      this._isTabPress = true;

      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const { navigation, options } = descriptor;

      const defaultHandler = this._makeDefaultHandler({ route, navigation });

      if (options.tabBarOnPress) {
        options.tabBarOnPress({ navigation, defaultHandler });
      } else {
        defaultHandler();
      }
    };

    _handleTabLongPress = ({ route }) => {
      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const { navigation, options } = descriptor;

      const defaultHandler = this._makeDefaultHandler({ route, navigation });

      if (options.tabBarOnLongPress) {
        options.tabBarOnLongPress({ navigation, defaultHandler });
      } else {
        defaultHandler();
      }
    };

    _handleIndexChange = index => {
      if (this._isTabPress) {
        this._isTabPress = false;
        return;
      }

      this._jumpTo(this.props.navigation.state.routes[index].routeName);
    };

    _handleSwipeStart = () => {
      this.setState({ isSwiping: true });
    };

    _handleSwipeEnd = () => {
      this.setState({ isSwiping: false });
    };

    _jumpTo = routeName => this.props.navigation.dispatch(NavigationActions.navigate({ routeName }));

    _isTabPress: boolean = false;

    render = () => (
      <TabView
        {...this.props.navigationConfig}
        {...this.props.descriptors[this.props.navigation.state.routes[this.props.navigation.state.index].key].options}
        getLabelText={this._getLabelText}
        getButtonComponent={this._getButtonComponent}
        getAccessibilityLabel={this._getAccessibilityLabel}
        getTestID={this._getTestID}
        renderIcon={this._renderIcon}
        renderScene={this._renderScene}
        onIndexChange={this._handleIndexChange}
        onTabPress={this._handleTabPress}
        onTabLongPress={this._handleTabLongPress}
        navigation={this.props.navigation}
        descriptors={this.props.descriptors}
        screenProps={this.props.screenProps}
      />
    );
  }

  return (routes: *, config: * = {}) => {
    const router = TabRouter(routes, config);
    return createNavigator(NavigationView, router, config);
  };
}
