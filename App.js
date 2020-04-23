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
import BarnHeatMapPage from './frontend/components/BarnHeatMapPage/BarnHeatMapPage';

import { Router, Scene } from 'react-native-router-flux';
import { StyleSheet } from 'react-native';
import FacilityInfoPage from './frontend/components/FacilityInfoPage/FacilityInfoPage';
import SettingsPage from './frontend/components/SettingsPage/SettingsPage';
import navigator from './frontend/components/Navigator/navigator';

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
            <Scene
              key='BarnHeatMapPage'
              component={BarnHeatMapPage}
              title='Barn Heatmap'
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
