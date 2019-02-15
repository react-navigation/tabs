/* @flow */

import * as React from "react";
import { View, StyleSheet } from "react-native";
import { polyfill } from "react-lifecycles-compat";

// eslint-disable-next-line import/no-unresolved
import { ScreenContainer } from "react-native-screens";

import createTabNavigator, { type InjectedProps } from "../utils/createTabNavigator";
import BottomTabBar, { type TabBarOptions } from "../views/BottomTabBar";
import ResourceSavingScene from "../views/ResourceSavingScene";

type Props = InjectedProps & {
  lazy?: boolean,
  tabBarComponent?: React.ComponentType<*>,
  tabBarOptions?: TabBarOptions
};

type State = {
  loaded: number[]
};

class TabNavigationView extends React.PureComponent<Props, State> {
  static defaultProps = {
    lazy: true
  };

  constructor(props) {
    super(props);
    this.renderScreens = this.renderScreens.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { index } = nextProps.navigation.state;

    return {
      // Set the current tab to be loaded if it was not loaded before
      loaded: prevState.loaded.includes(index) ? prevState.loaded : [...prevState.loaded, index]
    };
  }

  state = {
    loaded: [this.props.navigation.state.index]
  };

  _renderTabBar = () =>
    this.props.descriptors[this.props.navigation.state.routes[this.props.navigation.state.index].key].options
      .tabBarVisible === false ? null : (
      <BottomTabBar {...this.props.tabBarOptions} {...this.props} />
    );

  _jumpTo = (key: string) => {
    const { navigation, onIndexChange } = this.props;

    const index = navigation.state.routes.findIndex(route => route.key === key);

    onIndexChange(index);
  };

  renderScreens = (route, index) =>
    this.props.navigation.state.index === index &&
    (!this.props.lazy || this.state.loaded.includes(index)) && (
      <ResourceSavingScene
        key={route.key}
        style={StyleSheet.absoluteFill}
        isVisible={this.props.navigation.state.index === index}
      >
        {this.props.renderScene({ route })}
      </ResourceSavingScene>
    );

  render = () => (
    <View style={styles.container}>
      <ScreenContainer style={styles.pages}>
        {this.props.navigation.state.routes.map((route, index) => this.renderScreens(route, index))}
      </ScreenContainer>
      {this._renderTabBar()}
    </View>
  );
}

// polyfill(TabNavigationView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden"
  },
  pages: {
    flex: 1
  }
});

export default createTabNavigator(TabNavigationView);
