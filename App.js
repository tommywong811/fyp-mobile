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
import { StyleSheet, Alert, View, ActivityIndicator, SafeAreaView, Text} from 'react-native';
import FacilityInfoPage from './frontend/components/FacilityInfoPage/FacilityInfoPage';
import SettingsPage from './frontend/components/SettingsPage/SettingsPage';
import navigator from './frontend/components/Navigator/navigator';
import { api } from './backend';
import AsyncStorage from '@react-native-community/async-storage';
import autoUpdateHandler from './backend/utils/autoUpdate'
import { update } from './backend/utils/autoUpdate'
import { UPDATE_FLOOR_DATA, UPDATE_CURRENT_FLOOR } from './frontend/reducer/floors/actionList';
import { UPDATE_NODE_DATA } from './frontend/reducer/nodes/actionList'

import buildGraph from "./backend/api/graph/build";
import graphCache from "./backend/api/graph/cache";
import Store from 'react-native-fs-store';

import PanoramaViewPage from './frontend/components/PanoramaViewPage/PanoramaViewPage';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      isUpdating: false,
    });
  }

  componentDidMount() {
    fetch("https://pathadvisor.ust.hk/api/meta", {
      headers: {
        Accept: 'application/json'
      }
    }).then((response) => response.json())
    .then((json) => {
      console.log("newest map version: " + JSON.stringify(json.data))
      console.log("current map version: " + JSON.stringify(api.meta()))
      if(json.data.version !== api.meta().data.version) {
        console.log("map version outdated")
        Alert.alert("Map version outdated", "Update can be done", [
          {
            text: "Later",
            onPress: () => console.log("later update"),
          },
          {
            text: "Update Now",
            onPress: async () => {
              this.setState({'isUpdating': true}); 
              await update()
              console.log(UPDATE_FLOOR_DATA,UPDATE_CURRENT_FLOOR,UPDATE_NODE_DATA)
              store.dispatch({type: UPDATE_FLOOR_DATA, payload: {data: api.floors().data}})                
              store.dispatch({type: UPDATE_CURRENT_FLOOR, payload: {currentFloor: api.floors().data[0]}})                
              store.dispatch({type: UPDATE_NODE_DATA, payload: {data:api.nodes().data}})    

              try {
                const AsyncStorage = new Store('graphStore');
                let cachedGraphCache = await AsyncStorage.getItem('cachedGraphCache');
                if (!cachedGraphCache) { // prebuild graph for searching path
                    graphCache.data = buildGraph()
                    await AsyncStorage.setItem('cachedGraphCache', JSON.stringify(graphCache));
                } else {
                    graphCache.data = JSON.parse(cachedGraphCache).data ;
                }
              } catch (error) {
                  console.log('GraphDataGraph Error', error)
              }
              this.setState({'isUpdating': false});           
            },
          }
        ])
      } else {
        console.log("map is latest version")
      }
    })
    AsyncStorage.getItem('autoUpdate', (err, result) => {
      if(JSON.parse(result)) {
        console.log("autoUpdate switched on")
        autoUpdateHandler.configure()
      } else {
        console.log("autoUpdate switched off")
      }
    })
  }

  _renderProgress(){
    return( 
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 6, zIndex:1, flexDirection: 'column', backgroundColor: '#003366', justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large" color="#c9e6ff"></ActivityIndicator>
            <Text style={{color: 'white', fontSize: 14, marginTop: 10}}>{'Please wait, Updating the Database...'}</Text>
        </View> 
      </SafeAreaView>
    );
  }

  render() {
    if (this.state.isUpdating) {
      return this._renderProgress();
    }

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
            <Scene
              key='PanoramaViewPage'
              component={PanoramaViewPage}
              title='Panorama View'
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
