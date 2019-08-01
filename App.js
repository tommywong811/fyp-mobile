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
import { Drawer } from 'react-native-material-ui';
import PinchCanvas from './frontend/components/PinchCanvas/pinchCanvas';

import allReducer from './frontend/reducer/index';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Navigator from './frontend/components/Navigator/wrapper';
import mapCanvas from './frontend/components/MapCanvas/mapCanvas';
const store = createStore(allReducer);
import Gg from './frontend/components/test/test';




const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);

  }


  render(){
    return (
        <Provider store={store}>
          <Navigator />
        </Provider>
    );
    /*return (
        <View style={styles.container}>
          <TestCase />
        </View>
    );*/
  }

}

function onPressHandler(){
  console.log("Hello");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
