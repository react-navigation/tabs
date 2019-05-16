import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { TabView } from 'react-native-tab-view';
import createTabNavigator, {
  NavigationViewProps,
} from '../utils/createTabNavigator';
import MaterialTopTabBar, { TabBarOptions } from '../views/MaterialTopTabBar';
import { NavigationProp, SceneDescriptor } from '../types';

type Route = {
  key: string;
  routeName: string;
};

type Props = NavigationViewProps & {
  keyboardDismissMode?: 'none' | 'on-drag';
  swipeEnabled?: boolean;
  swipeDistanceThreshold?: number;
  swipeVelocityThreshold?: number;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  initialLayout?: { width?: number; height?: number };
  lazy?: boolean;
  lazyPlaceholderComponent?: React.ComponentType<{ route: Route }>;
  tabBarComponent?: React.ComponentType<any>;
  tabBarOptions?: TabBarOptions;
  tabBarPosition?: 'top' | 'bottom';
  sceneContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  navigation: NavigationProp;
  descriptors: { [key: string]: SceneDescriptor };
  screenProps?: unknown;
};

class MaterialTabView extends React.PureComponent<Props> {
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
        navigationState={navigation.state}
        swipeEnabled={swipeEnabled}
        renderTabBar={this._renderTabBar}
        renderLazyPlaceholder={this._renderLazyPlaceholder}
      />
    );
  }
}

export default createTabNavigator(MaterialTabView);
