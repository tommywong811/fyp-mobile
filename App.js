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

export default class App extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <Provider store={store}>
        <Router
          navigationBarStyle={styles.navBar}
          titleStyle={styles.navTitle}
        >
          <Scene key="root">
            <Scene
              key='DownloadProgress'
              component={DownloadProgress}
              hideNavBar={true}
              headerTintColor="white"
              initial />
            <Scene
              key='EventListPage'
              component={EventListPage}
              title='Event List'
              headerTintColor="white"
            />
            <Scene key='FacilityInfoPage'
              component={FacilityInfoPage}
              headerTintColor="white"
              modal='true'>
            </Scene>
          </Scene>
        </Router>
      </Provider>
    )
  }

}


const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#003366'
  },
  navTitle: {
    color: 'white'
  },
  navIcon: {
    tintColor: 'white'
  }
})
