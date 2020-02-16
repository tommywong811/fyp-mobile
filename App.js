/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'node-libs-react-native/globals';
import React, {Component} from 'react';
import DownloadProgress from './frontend/components/progress/progress';
import store from './store.js';
import { Provider } from 'react-redux';
import EventListPage from './frontend/components/EventListPage/EventListPage';

import { Router, Scene } from 'react-native-router-flux';

export default class App extends Component {
  constructor(props){
    super(props);
  }


  render(){
    return (
      <Provider store={store}>
        <Router>
          <Scene key="root">
            <Scene 
              key='DownloadProgress'
              component={DownloadProgress}
              hideNavBar={true}
              initial/>
            <Scene
              key='EventListPage'
              component={EventListPage}
              title='Event List'
            />
          </Scene>
        </Router>
      </Provider>
    )
  }

}