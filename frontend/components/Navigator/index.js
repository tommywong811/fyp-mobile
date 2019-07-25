import React from 'react';
import { Button, Text, View } from 'react-native';
import { connect } from 'react-redux';

class Navigator extends React.Component{

    constructor(props){
        super(props);
        this.onPressHandler = this.onPressHandler.bind(this);
        console.log(this.props);

    }

    onPressHandler(){
        
        this.props.change_floor();
        console.log(this.props);
    }

    render(){
        return(
            <View>
                <Button title="Floor" onPress={this.onPressHandler}/>
                <Text>{this.props.floor}</Text>
            </View>
        );
    }
}


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
        change_floor: () => dispatch({type: 'CHANGE_FLOOR'})
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);