import * as React from 'react';
import { registerRootComponent } from 'expo';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Assets as StackAssets, createStackNavigator } from 'react-navigation-stack';
import { Themed, createAppContainer } from '@react-navigation/native';
import { ThemeColors, useTheme } from '@react-navigation/core';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';

import BottomTabs from './src/BottomTabs';
import MaterialTopTabs from './src/MaterialTopTabs';

// Load the back button etc
Asset.loadAsync(StackAssets);

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
  let [theme, setTheme] = React.useState('light');

  return (
    <View style={{ flex: 1 }}>
      <Navigation theme={theme} />
      <View style={{ position: 'absolute', bottom: 60, right: 20 }}>
        <TouchableOpacity
          onPress={() => {
            setTheme(theme === 'light' ? 'dark' : 'light');
          }}
        >
          <View
            style={{
              backgroundColor: ThemeColors[theme].bodyContent,
              borderRadius: 25,
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: ThemeColors[theme].bodyBorder,
              borderWidth: 1,
              shadowColor: ThemeColors[theme].label,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.4,
              shadowRadius: 2,

              elevation: 5,
            }}
          >
            <MaterialCommunityIcons
              name="theme-light-dark"
              size={30}
              color={ThemeColors[theme].label}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
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
