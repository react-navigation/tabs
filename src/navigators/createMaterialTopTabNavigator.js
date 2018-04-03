/* @flow */

import * as React from 'react';

import { Platform, InteractionManager } from 'react-native';
import { TabView, PagerPan } from 'react-native-tab-view';
import { NavigationActions } from 'react-navigation';
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
  lazyOnSwipe: boolean,
  sceneAlwaysVisible: boolean,
};

class MaterialTabView extends React.PureComponent<Props> {
  static defaultProps = {
    // fix for https://github.com/react-native-community/react-native-tab-view/issues/312
    initialLayout: Platform.select({
      android: { width: 1, height: 0 },
    }),
    lazyOnSwipe: true,
    sceneAlwaysVisible: true,
  };

  state = {
    loaded: [this.props.navigation.state.index],
    transitioningFromIndex: null,
  };

  transitionTimeout = null;

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.navigation.state.index !== this.props.navigation.state.index
    ) {
      const { index } = nextProps.navigation.state;

      this.setState(state => ({
        loaded: state.loaded.includes(index)
          ? state.loaded
          : [...state.loaded, index],
      }));
    }
  }

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

  componentWillMount() {
    const { animationEnabled } = this.props;

    // We rely on action listener to animate from the current index to the next one, no need to listen without animation
    if (animationEnabled) {
      this._actionListener = this.props.navigation.addListener(
        'action',
        this._onAction
      );
    }
  }

  componentWillUnmount() {
    if (this._actionListener) {
      this._actionListener.remove();
    }

    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
    }
  }

  _onAction = payload => {
    if (payload.action.type === NavigationActions.NAVIGATE) {
      this.setState({ transitioningFromIndex: payload.lastState && payload.lastState.index || 0 });
    } else if (payload.action.type === 'Navigation/COMPLETE_TRANSITION') {
      InteractionManager.runAfterInteractions(() => {
        // Prevent white screen flickering
        this.transitionTimeout = setTimeout(() =>
          this.setState({ transitioningFromIndex: null }),
          100,
        );
      });
    }
  };

  _mustBeVisible = ({ index, route, focused }) => {
    const { animationEnabled, navigation, isSwiping, lazyOnSwipe, sceneAlwaysVisible } = this.props;
    const { transitioningFromIndex, loaded } = this.state;
    const { routes } = navigation.state;

    const isLoaded = loaded.includes(index);

    if (isSwiping && (lazyOnSwipe || isLoaded)) {
      const isSibling = navigation.state.index === index - 1 || navigation.state.index === index + 1;

      if (isSibling) {
        return true;
      }
    }

    // The previous tab should remain visible while transitioning
    if (animationEnabled && ((isLoaded && sceneAlwaysVisible && transitioningFromIndex != null) || transitioningFromIndex === index)) {
      return true;
    }

    return focused;
  };

  _renderScene = (props) => {
    const { index, route } = props;
    const { renderScene, isSwiping, lazyOnSwipe } = this.props;
    const { loaded } = this.state;

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
