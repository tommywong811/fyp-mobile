import {api} from '../../backend';

const initialState = api.floors();


floorReducer = (state=initialState, action) => {
    switch(action.type){
        case "CHANGE_DATA":
            return {
                state : api.floors()
            };
        default:
            return state
    }
}

export default floorReducer;