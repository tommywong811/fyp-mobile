import React from 'react';
import Floor from './floor';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import floorReducer from '../../reducer/floor';

const store = createStore(floorReducer);

export default class FloorWrapper extends React.Component{
    render(){
        return(
            <Provider store={store}>
                <Floor />
            </Provider>
        )
    }
}