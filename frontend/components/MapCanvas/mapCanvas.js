import React from 'react';
import { View, Image, FlatList, Text, Dimensions } from 'react-native';
import { Button } from 'react-native'
import { connect } from 'react-redux';
import * as mapTilePlugin from '../../plugins/MapTiles'
import Animated from "react-native-reanimated";
import { api } from '../../../backend';

const {width, height} = Dimensions.get('window');
const numOfRow = Math.ceil(height * 3 / width);

class MapCanvas extends React.Component{

    constructor(props){
        super(props);
        //old
        //use
        var mapInfo = mapTilePlugin.getFloorDimension(
            this.props.offSetX,
            this.props.offSetY,
            this.props.width,
            this.props.height
        );
        //may not
        this.state = {
            start_x: mapInfo.left,
            start_y: mapInfo.top,
            mapTiles: []
        }
        const startX = 0;
        const startY = 0;
        
        for(i = 0; i < numOfRow; i++){
            for(j = 0; j < 3; j++){
                this.state.mapTiles.push(
                    {x: this.state.start_x + j * 200,
                     y: this.state.start_y + i * 200,
                     uri: mapTilePlugin.dirToUri(api.mapTiles({
                         floorId: this.props.floor,
                         x: this.state.start_x + j * 200,
                         y: this.state.start_y + i * 200,
                         zoomLevel: 0
                     })) 
                    }
                )

            }
        }   


        //new
        var arr = new Array(mapInfo.height);
        for(i = 0; i < mapInfo.height; i++){
            arr[i] = [];
            for(j = 0; j < mapInfo.width; j++){
                arr[i].push({uri: null});        
            }
        }
        this.props.changeCache(arr);
        console.log(this.props.cacheImage);
    }

    render(){
        return(
            <FlatList
                data={this.state.mapTiles}
                renderItem={({item}) => <Image style={{width:width/3, height:width/3}} source={{uri: item.uri}}/>}
                numColumns={3}
                style={{flex:1}}
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