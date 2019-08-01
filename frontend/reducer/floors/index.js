import {api} from '../../../backend'

import {CHANGE_FLOOR} from './actionList'

initialState = {
    data: api.floors().data,
    currentFloor: api.floors().data[0]
}

function changeFloor(data, payload, currentFloor){
    for(i = 0; i < data.length; i++){
        if(payload.buildingId === data[i].buildingId){
            return data[i];
        }
    }
    return data[currentFloor];
}

export default floorReducer = (state = initialState, action) => {
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
