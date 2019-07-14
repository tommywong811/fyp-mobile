/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'node-libs-react-native/globals';
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Alert, Button} from 'react-native';
import MainScreen from './frontend/mainScreen/index';
import TestCase from './frontend/testBack/testBack';
import Floor from './frontend/components/floor/index';
import { db/*, api*/ } from "./backend";
import MapTile from './frontend/mapTile'
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {


  render() {
    return (
        <View style={styles.container}>
          <MapTile floorId='1'
          X={-1412}
          Y={-1386}
          zoomLevel={0} />
        </View>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
