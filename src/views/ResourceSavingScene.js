/* @flow */

import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";

// eslint-disable-next-line import/no-unresolved
import { Screen, screensEnabled } from "react-native-screens";

type Props = {
  isVisible: boolean,
  children: React.Node,
  style?: any
};

const FAR_FAR_AWAY = 3000; // this should be big enough to move the whole view out of its container

export default class ResourceSavingScene extends React.PureComponent<Props> {
  render = () =>
    screensEnabled && screensEnabled() ? (
      <Screen active={this.props.isVisible ? 1 : 0} {...this.props} />
    ) : (
      <View
        style={[styles.container, this.props.style, { opacity: this.props.isVisible ? 1 : 0 }]}
        collapsable={false}
        removeClippedSubviews={
          // On iOS, set removeClippedSubviews to true only when not focused
          // This is an workaround for a bug where the clipped view never re-appears
          Platform.OS === "ios" ? !this.props.isVisible : true
        }
        pointerEvents={this.props.isVisible ? "auto" : "none"}
        {...this.props}
      >
        <View style={this.props.isVisible ? styles.attached : styles.detached}>{this.props.children}</View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden"
  },
  attached: {
    flex: 1
  },
  detached: {
    flex: 1,
    top: FAR_FAR_AWAY
  }
});
