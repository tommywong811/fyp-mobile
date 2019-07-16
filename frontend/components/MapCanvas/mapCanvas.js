import React from 'react';
import { View, Image, FlatList, Text } from 'react-native';
import { Button } from 'react-native'
import { connect } from 'react-redux';
import * as mapTilePlugin from '../../plugins/MapTiles'
import Animated from "react-native-reanimated";

class MapCanvas extends React.Component{

    constructor(props){
        super(props);
        this._displayMapTiles = this._displayMapTiles.bind(this);
        var mapTiles = mapTilePlugin.generateMapTiles(
            this.props.offSetX,
            this.props.offSetY,
            this.props.width,
            this.props.height,
            this.props.floor,
            this.props.zoomLevel);
        this.state = {
            allMapTiles: mapTiles.result,
            dimension: mapTiles.dimension
        }
    }

    _displayMapTiles(){
        //console.log(this.props);
        console.log(this.state);
        //console.log(this.state.allMapTiles[0].uri);
    }

    render(){
        /*return(
            <View>
                <Button title='canvas' onPress={this._displayMapTiles} />
            </View>
        );*/
        return(
            <FlatList
                data={this.state.allMapTiles}
                renderItem={({item}) => <Image style={{width:30, height:30}} source={{uri: item.uri}}/>}
                numColumns={this.state.dimension.height}
            />
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