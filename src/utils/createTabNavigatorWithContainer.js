/* @flow */

import * as React from 'react';
import {
  createNavigationContainer,
} from 'react-navigation';
import createTabNavigator from './createTabNavigator';

export default function createTabNavigatorWithContainer(TabView: React.ComponentType<*>) {
    const createNavigator = createTabNavigator(TabView);

    return (routes: *, config: * = {}) =>  createNavigationContainer( createNavigator(routes, config));
}
