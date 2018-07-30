import * as React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import PhotoGrid from './shared/PhotoGrid';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';

const tabBarIcon = name => ({ tintColor }) => (
  <MaterialIcons name={name} color={tintColor} size={24} />
);

class Album extends React.Component {
  static navigationOptions = {
    tabBarIcon: tabBarIcon('photo-album'),
    tabBarButtonComponent: TouchableBounce,
  };

  render() {
    return <PhotoGrid id="album" />;
  }
}

class History extends React.Component {
  static navigationOptions = {
    tabBarIcon: tabBarIcon('history'),
    tabBarButtonComponent: TouchableBounce,
  };

  render() {
    return <PhotoGrid id="history" />;
  }
}

class Cart extends React.Component {
  static navigationOptions = {
    tabBarIcon: tabBarIcon('shopping-cart'),
    tabBarButtonComponent: TouchableBounce,
  };

  render() {
    return <PhotoGrid id="cart" />;
  }
}

export default createBottomTabNavigator(
  {
    Album,
    History: {
      screen: History,
      navigationOptions: {
        tabBarIcon: tabBarIcon('history'),
        tabBarLabel: ' ',
      },
    },
    Cart,
  },
  {
    tabBarOptions: {
      tabStyle: {
        backgroundColor: '#ffe',
      },
      hasMiddleItem: true,
      middleItemStyle: {
        flex: 0,
        width: 40,
        backgroundColor: 'lightblue',
      },
    },
  }
);
