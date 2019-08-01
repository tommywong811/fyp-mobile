import { Provider } from 'react-redux';
import allReducer from '../../reducer/index';
import React from 'react' 
import { createStore } from 'redux';
import Navigator from './navigator';

const store = createStore(allReducer);

export default class NavigatorWrapper extends React.Component{
    render(){
        return(
            <Provider store={store}>
                <Navigator />
            </Provider>
        )
    }
}