import * as React from 'react';
import { Image, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { TabBarHeightContext } from 'react-navigation-tabs';

const COVERS = [
  require('../../assets/album-art-1.jpg'),
  require('../../assets/album-art-2.jpg'),
  require('../../assets/album-art-3.jpg'),
  require('../../assets/album-art-4.jpg'),
  require('../../assets/album-art-5.jpg'),
  require('../../assets/album-art-6.jpg'),
  require('../../assets/album-art-7.jpg'),
  require('../../assets/album-art-8.jpg'),
];

export default class Albums extends React.Component {
  render() {
    return (
      <TabBarHeightContext.Consumer>
        {height => (
          <ScrollView
            style={styles.container}
            contentContainerStyle={[
              styles.content,
              { padding: 20, paddingBottom: height + 20 },
            ]}
          >
            {COVERS.map((source, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Image key={i} source={source} style={styles.cover} />
            ))}
          </ScrollView>
        )}
      </TabBarHeightContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cover: {
    width: '50%',
    height: Dimensions.get('window').width / 2,
  },
});
