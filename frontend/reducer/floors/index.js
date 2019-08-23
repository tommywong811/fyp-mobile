import {api} from '../../../backend'

import {
    CHANGE_FLOOR,
    CHANGE_BUILDING,
    CHANGE_CURRX,
    CHANGE_CURRY,
    CHANGE_SUMX,
    CHANGE_SUMY
} from './actionList'


initialState = {
    data: api.floors().data,
    currentFloor: api.floors().data[0],
    currX: 0,
    currY: 0,
    sumX: 0,
    sumY: 0,
}

function changeBuilding(data, payload, currentFloor){
    for(i = 0; i < data.length; i++){
        if(payload.buildingId === data[i].buildingId){
            return data[i];
        }
    }
    return currentFloor;
}

function changeFloor(data, payload, currentFloor){
    console.log(`${payload.buildingId} ${payload.floor}`);
    for(i = 0; i < data.length; i++){
        if(payload.buildingId === data[i].buildingId &&
            payload.floor === data[i]._id){
            return data[i];
        }
    }
    return currentFloor;
}

export default floorReducer = (state = initialState, action) => {
    switch(action.type){
        case CHANGE_BUILDING:
            return {
                ...state,
                currentFloor: changeBuilding(state.data, action.payload, state.currentFloor)
            };
        case CHANGE_FLOOR:
            return {
                ...state,
                currentFloor: changeFloor(state.data, action.payload, state.currentFloor)
            };
        case CHANGE_CURRX:
            return {
                ...state,
                currX: action.payload.currX
            };
        case CHANGE_CURRY:
            return {
                ...state,
                currY: action.payload.currY
            };
        case CHANGE_SUMX:
            return {
                ...state,
                sumX: action.payload.sumX
            };
        case CHANGE_SUMY:
            return {
                ...state,
                sumY: action.payload.sumY
            }
        default:
            return state;
    }
}
