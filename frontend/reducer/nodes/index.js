import {api} from '../../../backend'


let initialState = {
    data: api.nodes().data,
}

// function changeFloor(data, payload, currentFloor){
//     console.log(`${payload.buildingId} ${payload.floor}`);
//     for(i = 0; i < data.length; i++){
//         if(payload.buildingId === data[i].buildingId &&
//             payload.floor === data[i]._id){
//             return data[i];
//         }
//     }
//     return currentFloor;
// }

export default nodesReducer = (state = initialState, action) => {
    switch(action.type){
        default:
            return state;
    }
}
