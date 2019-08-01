import {api} from '../../../backend'

import {
    CHANGE_FLOOR,
    CHANGE_BUILDING
} from './actionList'


initialState = {
    data: api.floors().data,
    currentFloor: api.floors().data[0]
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
                console.log("YES");
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
        case CHANGE_FLOOR:{
            return {
                ...state,
                currentFloor: changeFloor(state.data, action.payload, state.currentFloor)
            };
        }
        default:
            return state;
    }
}
