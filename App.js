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
import MapCanvas from './frontend/components/MapCanvas';
import TestCase from './frontend/testBack/testBack';
import { db/*, api*/ } from "./backend";
import MapTile from './frontend/mapTile';
import * as plugin from './frontend/plugins/MapTiles'; 
import * as floor from './frontend/reducer/floors';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {


  /*render() {
    return (
        <View style={styles.container}>
          <Button title='GET' onPress={onPressHandler}/>
          <MapTile floorId='1'
          X={0}
          Y={0}
          zoomLevel={1} />
        </View>
    );
  }*/
  render(){
    return (
      <View style={StyleSheet.container}>
        <MapCanvas />
      </View>
    );
  }

}

function onPressHandler(){
  console.log("Pressed");
  /*const data = plugin.generateMapTiles(-1431, -1386, 4516, 3291, '1', 0);
  const gg = plugin.mapTilesRefactor(data);　　　　
  console.log(gg);
  console.log(data);*/

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
