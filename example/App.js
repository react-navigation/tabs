import * as React from 'react';
import Expo from 'expo';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import BottomTabs from './src/BottomTabs';
import BottomTabsWithMiddleButton from './src/BottomTabsWithMiddleButton';
import MaterialTopTabs from './src/MaterialTopTabs';

class Home extends React.Component {
  render() {
    return (
      <View>
        <TouchableOpacity
          style={styles.item}
          onPress={() => this.props.navigation.push('BottomTabs')}
        >
          <Text>Bottom tabs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            this.props.navigation.push('BottomTabsWithMiddleButton')
          }
        >
          <Text>Bottom tabs with middle button</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => this.props.navigation.push('MaterialTopTabs')}
        >
          <Text>Material top tabs</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const App = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: { title: 'Examples' },
  },
  BottomTabs: {
    screen: BottomTabs,
    navigationOptions: { title: 'Bottom tabs' },
  },
  BottomTabsWithMiddleButton: {
    screen: BottomTabsWithMiddleButton,
    navigationOptions: { title: 'Bottom tabs with middle button' },
  },
  MaterialTopTabs: {
    screen: MaterialTopTabs,
    navigationOptions: { title: 'Material top tabs' },
  },
});

const styles = {
  item: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
};

Expo.registerRootComponent(App);
