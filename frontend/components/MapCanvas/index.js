import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import allReducers from '../../reducer';
import MapCanvas from './mapCanvas';
import { Button } from 'react-native';
const store = createStore(allReducers);

export default class MapCanvasWrapper extends React.Component{

    render(){
        return (
            <Provider store={store}>
                <Button title='Test' onPress={()=>{console.log(store.getState())}}/>
                <MapCanvas />
            </Provider>
        );
    }
}

