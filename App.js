/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'node-libs-react-native/globals';
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Alert, Button, Animated} from 'react-native';
import DownloadProgress from './frontend/components/progress/progress';
import allReducer from './frontend/reducer/index';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
const store = createStore(allReducer);

/**TEST IMPORT */

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
        <DownloadProgress />
      </Provider>
    )
    /*return (
      <Provider store={store}>
        <TestNavigator>
          <TestMap></TestMap>
        </TestNavigator>
      </Provider>
    )*/
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
