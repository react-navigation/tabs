import * as React from 'react';
import { registerRootComponent } from 'expo';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { Themed, createAppContainer } from '@react-navigation/native';
import { ThemeColors, useTheme } from '@react-navigation/core';
import BottomTabs from './src/BottomTabs';
import MaterialTopTabs from './src/MaterialTopTabs';

const Home = props => {
  let theme = useTheme();

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={theme === 'dark' ? styles.itemDark : styles.itemLight}
        onPress={() => props.navigation.push('BottomTabs')}
      >
        <Themed.Text>Bottom tabs</Themed.Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={theme === 'dark' ? styles.itemDark : styles.itemLight}
        onPress={() => props.navigation.push('MaterialTopTabs')}
      >
        <Themed.Text>Material top tabs</Themed.Text>
      </TouchableOpacity>
      <Themed.StatusBar />
    </View>
  );
};

const List = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: { title: 'Examples' },
  },
  BottomTabs: {
    screen: BottomTabs,
    navigationOptions: { title: 'Bottom tabs' },
  },
  MaterialTopTabs: {
    screen: MaterialTopTabs,
    navigationOptions: { title: 'Material top tabs' },
  },
});

const Navigation = createAppContainer(List);

const App = () => {
  return <Navigation theme="dark" />;
};

const styles = {
  itemLight: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  itemDark: {
    padding: 16,
    backgroundColor: ThemeColors.dark.bodyContent,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ThemeColors.dark.bodyBorder,
  },
};

registerRootComponent(App);
