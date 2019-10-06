import {api} from '../../../backend'

import {
    CHANGE_FLOOR
} from './actionList'


initialState = {
    data: api.nodes().data,
    currentFloor: api.floorsconnectorsconnectors().data[0],
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

export default nodesReducer = (state = initialState, action) => {
    switch(action.type){
        case CHANGE_FLOOR:
            return {
                ...state,
                currentFloor: changeFloor(state.data, action.payload, state.currentFloor)
            };
        default:
            return state;
    }
}
