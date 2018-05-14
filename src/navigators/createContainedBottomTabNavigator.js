
import createBottomTabNavigator from './createBottomTabNavigator';

import {
  createNavigationContainer,
} from 'react-navigation';

export default function createContainedBottomTabNavigator(routes: *, config: * = {}) {
  return createNavigationContainer( createBottomTabNavigator(routes, config));
}