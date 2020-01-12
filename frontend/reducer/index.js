import { combineReducers } from 'redux';
import floorReducer from './floors'
import nodesReducer from './nodes'
import pathReducer from './path'
export default combineReducers({
    floorReducer,
    nodesReducer,
    pathReducer,
});
