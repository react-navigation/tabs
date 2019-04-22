/* @flow */

import * as React from 'react';
import { TabView } from 'react-native-tab-view';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import createTabNavigator, {
  type InjectedProps,
} from '../utils/createTabNavigator';
import MaterialTopTabBar, {
  type TabBarOptions,
} from '../views/MaterialTopTabBar';

type Route = {
  key: string,
  routeName: string,
};

type Props = {|
  ...InjectedProps,
  keyboardDismissMode?: 'none' | 'on-drag',
  swipeEnabled?: boolean,
  swipeDistanceThreshold?: number,
  swipeVelocityThreshold?: number,
  onSwipeStart?: () => mixed,
  onSwipeEnd?: () => mixed,
  initialLayout?: { width?: number, height?: number },
  lazy?: boolean,
  lazyPlaceholderComponent?: React.ComponentType<{ route: Route }>,
  tabBarComponent?: React.ComponentType<*>,
  tabBarOptions?: TabBarOptions,
  tabBarPosition?: 'top' | 'bottom',
  sceneContainerStyle?: ViewStyleProp,
  style?: ViewStyleProp,
|};

type State = {|
  index: number,
|};

class MaterialTabView extends React.PureComponent<Props, State> {
  state = {
    index: this.props.navigation.state.index,
  };

  componentDidMount() {
    this.props.navigation.addListener('didFocus', this._handleFocus);
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('didFocus', this._handleFocus);
  }

  // The index change event fires after swipe animation
  // If you quickly navigate to a new screen in stack before animation finishes,
  // the index change event will fire after the previous navigation event
  // By this time, the tab navigator is not focused anymore
  // React Navigation fails to handle the action properly if the navigator is not focused
  // So we keep the index in local state and synchronise when the navigator comes to focus
  // It's pretty hacky, but there doesn't seem to be a better way :(
  _handleFocus = () => {
    const { navigation, onIndexChange } = this.props;
    const { index } = this.state;

    if (navigation.state.index !== index) {
      // Synchornize the index on focus if it's not in sync
      onIndexChange(index);
    }
  };

  _handleIndexChange = index => {
    const { navigation, onIndexChange } = this.props;

    if (navigation.isFocused()) {
      // Only synchornize the index when we're focused
      onIndexChange(index);
    }

    this.setState({ index });
  };

  _renderLazyPlaceholder = props => {
    const { lazyPlaceholderComponent: LazyPlaceholder } = this.props;

    if (LazyPlaceholder != null) {
      return <LazyPlaceholder {...props} />;
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
      navigation,
      getLabelText,
      getAccessibilityLabel,
      getTestID,
      renderIcon,
      onTabPress,
      onTabLongPress,
      tabBarComponent: TabBarComponent = MaterialTopTabBar,
      tabBarPosition,
      tabBarOptions,
      screenProps,
    } = this.props;

    if (TabBarComponent === null || !tabBarVisible) {
      return null;
    }

    return (
      <TabBarComponent
        {...tabBarOptions}
        {...props}
        tabBarPosition={tabBarPosition}
        screenProps={screenProps}
        navigation={navigation}
        getLabelText={getLabelText}
        getAccessibilityLabel={getAccessibilityLabel}
        getTestID={getTestID}
        renderIcon={renderIcon}
        onTabPress={onTabPress}
        onTabLongPress={onTabLongPress}
      />
    );
  };

  render() {
    const {
      /* eslint-disable no-unused-vars */
      getLabelText,
      getAccessibilityLabel,
      getTestID,
      renderIcon,
      onTabPress,
      onTabLongPress,
      screenProps,
      lazyPlaceholderComponent,
      tabBarComponent,
      tabBarOptions,
      /* eslint-enable no-unused-vars */
      navigation,
      descriptors,
      ...rest
    } = this.props;

    const { state } = navigation;
    const route = state.routes[state.index];

    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    let swipeEnabled =
      options.swipeEnabled == null
        ? this.props.swipeEnabled
        : options.swipeEnabled;

    if (typeof swipeEnabled === 'function') {
      swipeEnabled = swipeEnabled(state);
    }

    return (
      <TabView
        {...rest}
        navigationState={{
          routes: navigation.state.routes,
          index: this.state.index,
        }}
        onIndexChange={this._handleIndexChange}
        swipeEnabled={swipeEnabled}
        renderTabBar={this._renderTabBar}
        renderLazyPlaceholder={this._renderLazyPlaceholder}
      />
    );
  }
}

export default createTabNavigator(MaterialTabView);
