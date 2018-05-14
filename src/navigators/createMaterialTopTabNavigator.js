/* @flow */

import * as React from 'react';
import { Platform } from 'react-native';
import { TabView, PagerPan } from 'react-native-tab-view';
import createTabNavigator, {
  type InjectedProps,
} from '../utils/createTabNavigator';
import MaterialTopTabBar, {
  type TabBarOptions,
} from '../views/MaterialTopTabBar';
import ResourceSavingScene from '../views/ResourceSavingScene';

type Props = InjectedProps & {
  animationEnabled?: boolean,
  swipeEnabled?: boolean,
  tabBarPosition?: 'top' | 'bottom',
  tabBarComponent?: React.ComponentType<*>,
  tabBarOptions?: TabBarOptions,
};

type State = {
  index: number,
  isSwiping: boolean,
  loaded: Array<number>,
  transitioningFromIndex: ?number,
};

class MaterialTabView extends React.PureComponent<Props> {
  static defaultProps = {
    // fix for https://github.com/react-native-community/react-native-tab-view/issues/312
    initialLayout: Platform.select({
      android: { width: 1, height: 0 },
    }),
    animationEnabled: true,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { index } = nextProps.navigation.state;

    if (prevState.index === index) {
      return null;
    }

    return {
      loaded: prevState.loaded.includes(index)
        ? prevState.loaded
        : [...prevState.loaded, index],
      index,
    };
  }

  state = {
    index: 0,
    isSwiping: false,
    loaded: [this.props.navigation.state.index],
    transitioningFromIndex: null,
  };

  _getLabel = ({ route, tintColor, focused }) => {
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    if (options.tabBarLabel) {
      return typeof options.tabBarLabel === 'function'
        ? options.tabBarLabel({ tintColor, focused })
        : options.tabBarLabel;
    }

    if (typeof options.title === 'string') {
      return options.title;
    }

    return route.routeName;
  };

  _renderIcon = ({ focused, route, tintColor }) => {
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    if (options.tabBarIcon) {
      return typeof options.tabBarIcon === 'function'
        ? options.tabBarIcon({ tintColor, focused })
        : options.tabBarIcon;
    }

    return null;
  };

  _renderTabBar = props => {
    const { state } = this.props.navigation;
    const route = state.routes[state.index];
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    const tabBarVisible =
      options.tabBarVisible == null ? true : options.tabBarVisible;

    const {
      tabBarComponent: TabBarComponent = MaterialTopTabBar,
      tabBarPosition,
      tabBarOptions,
    } = this.props;

    if (TabBarComponent === null || !tabBarVisible) {
      return null;
    }

    return (
      /* $FlowFixMe */
      <TabBarComponent
        {...tabBarOptions}
        {...props}
        tabBarPosition={tabBarPosition}
        screenProps={this.props.screenProps}
        navigation={this.props.navigation}
        getLabelText={this.props.getLabelText}
        getAccessibilityLabel={this.props.getAccessibilityLabel}
        getTestID={this.props.getTestID}
        renderIcon={this._renderIcon}
        onTabPress={this.props.onTabPress}
      />
    );
  };

  _renderPanPager = props => <PagerPan {...props} />;

  _handleAnimationEnd = () => {
    this.setState({
      transitioningFromIndex: null,
      isSwiping: false,
    });
  };

  _handleSwipeStart = () => {
    const { navigation } = this.props;

    this.setState({
      isSwiping: true,
      loaded: [
        ...new Set([
          ...this.state.loaded,
          Math.max(navigation.state.index - 1, 0),
          Math.min(
            navigation.state.index + 1,
            navigation.state.routes.length - 1
          ),
        ]),
      ],
    });
  };

  _handleIndexChange = index => {
    const { navigation, onIndexChange } = this.props;

    this.setState({
      transitioningFromIndex: navigation.state.index || 0,
    });

    onIndexChange(index);
  };

  _mustBeVisible = ({ index, focused }) => {
    const { animationEnabled, navigation } = this.props;
    const { isSwiping, transitioningFromIndex } = this.state;

    if (isSwiping) {
      const isSibling =
        navigation.state.index === index - 1 ||
        navigation.state.index === index + 1;

      if (isSibling) {
        return true;
      }
    }

    // The previous tab should remain visible while transitioning
    if (animationEnabled && transitioningFromIndex === index) {
      return true;
    }

    return focused;
  };

  _renderScene = props => {
    const { index, route } = props;
    const { renderScene } = this.props;
    const { loaded } = this.state;

    const mustBeVisible = this._mustBeVisible(props);

    if (!loaded.includes(index) && !mustBeVisible) {
      return null;
    }

    return (
      <ResourceSavingScene isVisible={mustBeVisible}>
        {renderScene({ route })}
      </ResourceSavingScene>
    );
  };

  render() {
    const {
      navigation,
      animationEnabled,
      // eslint-disable-next-line no-unused-vars
      renderScene,
      // eslint-disable-next-line no-unused-vars
      onIndexChange,
      ...rest
    } = this.props;

    let renderPager;

    const { state } = this.props.navigation;
    const route = state.routes[state.index];
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    let swipeEnabled =
      options.swipeEnabled == null
        ? this.props.swipeEnabled
        : options.swipeEnabled;

    if (typeof swipeEnabled === 'function') {
      swipeEnabled = swipeEnabled(state);
    }

    if (animationEnabled === false && swipeEnabled === false) {
      renderPager = this._renderPanPager;
    }

    return (
      <TabView
        {...rest}
        navigationState={navigation.state}
        animationEnabled={animationEnabled}
        swipeEnabled={swipeEnabled}
        onAnimationEnd={this._handleAnimationEnd}
        onIndexChange={this._handleIndexChange}
        onSwipeStart={this._handleSwipeStart}
        renderPager={renderPager}
        renderTabBar={this._renderTabBar}
        renderScene={
          /* $FlowFixMe */
          this._renderScene
        }
      />
    );
  }
}

export default createTabNavigator(MaterialTabView);
