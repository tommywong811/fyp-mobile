import {createStore} from 'redux';
import allReducer from './frontend/reducer/index';
const store = createStore(allReducer)
export default store;
