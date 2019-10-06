import { combineReducers } from 'redux';
import floorReducer from './floors'
import nodesReducer from './nodes'
export default combineReducers({
    floorReducer,
    nodesReducer,
});
