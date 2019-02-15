/* @flow */

import React from "react";
import { Animated, View, StyleSheet } from "react-native";

type Props = {
  route: any,
  horizontal?: boolean,
  activeOpacity: any,
  inactiveOpacity: any,
  activeTintColor: any,
  inactiveTintColor: any,
  renderIcon: any,
  style: any
};

export default class TabBarIcon extends React.Component<Props> {
  render = () => (
    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them.
    <View style={this.props.style}>
      <Animated.View style={[styles.icon, { opacity: this.props.activeOpacity }]}>
        {this.props.renderIcon({
          route: this.props.route,
          focused: true,
          horizontal: this.props.horizontal,
          tintColor: this.props.activeTintColor
        })}
      </Animated.View>
      <Animated.View style={[styles.icon, { opacity: this.props.inactiveOpacity }]}>
        {this.props.renderIcon({
          route: this.props.route,
          focused: false,
          horizontal: this.props.horizontal,
          tintColor: this.props.inactiveTintColor
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them:
    // Cover the whole iconContainer:
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    // Workaround for react-native >= 0.54 layout bug
    minWidth: 25
  }
});
