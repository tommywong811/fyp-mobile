import {api} from '../../../backend'

const CHANGE_FLOOR = 'CHANGE_FLOOR';

initialState = {
    data: api.floors().data,
    currentFloor: api.floors().data[0]
}



export default floorReducer = (state = initialState, action) => {
    switch(action.type){
        case CHANGE_FLOOR:
            return {
                data: state.data,
                currentFloor: state.data[1]
            };
        default:
            return state;
    }
}
