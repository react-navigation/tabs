import * as React from 'react';
import {
  createBottomTabNavigator,
  TabBarHeightContext,
} from 'react-navigation-tabs';
import { MaterialIcons } from '@expo/vector-icons';

// @ts-ignore
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import { ScrollView, Image } from 'react-native';
import { COVERS } from './Shared/Albums';

const tabBarIcon = (name: string) => ({
  tintColor,
  horizontal,
}: {
  tintColor: string;
  horizontal: boolean;
}) => (
  <MaterialIcons name={name} color={tintColor} size={horizontal ? 17 : 24} />
);

const AltAlbumsScreen = () => (
  <TabBarHeightContext.Consumer>
    {height => (
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: height + 20 }}
        style={{ backgroundColor: 'whitesmoke' }}
      >
        {COVERS.map((source, i) => (
          <Image
            // eslint-disable-next-line react/no-array-index-key
            key={`photo_${i}`}
            source={source}
            style={{
              width: '100%',
              height: 230,
              marginTop: i !== 0 ? 20 : 0,
              borderRadius: 10,
            }}
          />
        ))}
      </ScrollView>
    )}
  </TabBarHeightContext.Consumer>
);

AltAlbumsScreen.navigationOptions = {
  tabBarLabel: 'Albums',
  tabBarIcon: tabBarIcon('photo-album'),
  tabBarButtonComponent: TouchableBounce,
};

export default createBottomTabNavigator(
  { AltAlbumsScreen },
  {
    initialRouteName: 'AltAlbumsScreen',
    tabBarOptions: {
      style: {
        backgroundColor: 'rgba(220, 220, 220, 0.7)',
        position: 'absolute',
        bottom: 0,
      },
    },
  }
);
