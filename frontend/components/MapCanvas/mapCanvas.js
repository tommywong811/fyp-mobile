import React from 'react';
import { View, Image } from 'react-native';
import { Button } from 'react-native'
import { connect } from 'react-redux';
import * as mapTilePlugin from '../../plugins/MapTiles'

class MapCanvas extends React.Component{

    constructor(props){
        super(props);
        this._displayMapTiles = this._displayMapTiles.bind(this);
        this.state = {
            allMapTiles: mapTilePlugin.generateMapTiles(
                this.props.offSetX,
                this.props.offSetY,
                this.props.width,
                this.props.height,
                this.props.floor,
                this.props.zoomLevel
            )
        }
    }

    _displayMapTiles(){
        console.log(this.props);
        console.log(this.state);
    }

    render(){
        return(
            <View>
                <Button title='canvas' onPress={this._displayMapTiles} />
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

export default connect(mapStateToProps)(MapCanvas);