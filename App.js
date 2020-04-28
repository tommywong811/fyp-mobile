/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'node-libs-react-native/globals';
import React, { Component } from 'react';
import DownloadProgress from './frontend/components/progress/progress';
import store from './store.js';
import { Provider } from 'react-redux';
import EventListPage from './frontend/components/EventListPage/EventListPage';

import { Router, Scene } from 'react-native-router-flux';
import { StyleSheet } from 'react-native';
import FacilityInfoPage from './frontend/components/FacilityInfoPage/FacilityInfoPage';
import SettingsPage from './frontend/components/SettingsPage/SettingsPage';
import navigator from './frontend/components/Navigator/navigator';
import { api } from './backend';
import AsyncStorage from '@react-native-community/async-storage';
import autoUpdateHandler from './backend/utils/autoUpdate'

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    AsyncStorage.getItem('autoUpdate', (err, result) => {
      if(JSON.parse(result)) {
        console.log("autoUpdate switched on")
        autoUpdateHandler.configure()
      } else {
        console.log("autoUpdate switched off")
      }
    })
  }

  render() {
    return (
      <Provider store={store}>
        <Router
          navigationBarStyle={styles.navBar}
          titleStyle={styles.navTitle}
          headerTintColor="#003366"
        >
          <Scene key="root">
            <Scene
              key='DownloadProgress'
              component={DownloadProgress}
              hideNavBar={true}
              initial />
            <Scene
              key='NavigatorPage'
              component={navigator}
              hideNavBar={true}
            />
            <Scene
              key='EventListPage'
              component={EventListPage}
              title='Event List'
            />
            <Scene key='FacilityInfoPage'
              component={FacilityInfoPage}
              modal='true'>
            </Scene>
            <Scene key='SettingsPage'
              component={SettingsPage}
              title='Settings'>
            </Scene>
          </Scene>
        </Router>
      </Provider>
    )
  }

}


const styles = StyleSheet.create({
  navBar: {
    backgroundColor: 'white'
  },
  navTitle: {
    color: '#003366'
  },
  navIcon: {
    tintColor: '#003366'
  }
})
