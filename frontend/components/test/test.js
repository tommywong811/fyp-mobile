import React from 'react';
import { Button } from 'react-native'
import { connect } from 'react-redux';



function mapStateToProps(state){
    return {
        offSetX: state.floorReducer.currentFloor.startX,
        offSetY: state.floorReducer.currentFloor.startY,
        width: state.floorReducer.currentFloor.mapWidth,
        height: state.floorReducer.currentFloor.mapHeight,
        floor: state.floorReducer.currentFloor._id,
        zoomLevel: 0
    };
}

function mapDispatchToProps(dispatch){
    return {
        changeFloor: () => dispatch({type: 'CHANGE_FLOOR'})
    }
}

class GG extends React.Component{
    render(){
        return(
            <Button title='get' onPress={this.presshandler}></Button>
        );
    }

    presshandler = () => {
        this.props.changeFloor(); console.log(this.props)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GG);