import React from 'react';
import { connect } from 'react-redux'; 
import {
    Image,
    Animated,
    View,
    Text
} from 'react-native';
import NotFoundZoom0 from '../../asset/notFoundZoom0';
import { getFloorDimension, dirToUri } from '../../plugins/MapTiles';
import {mapTileSize, logicTileSize} from './config';
import { api } from '../../../backend';
import { 
    PanGestureHandler, 
    PinchGestureHandler,
    State 
} from 'react-native-gesture-handler';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

const NOT_Found = 'NOT FOUND'; 
class MapTiles extends React.Component{

    constructor(props){
        super(props);
        this._initialCache = this._initialCache.bind(this);
        this._initialCache();
        this._renderAllMapTile = this._renderAllMapTile.bind(this);
        this._initialPanHandler = this._initialPanHandler.bind(this);
        this._initialPanHandler();
        this._initialPinchHandler = this._initialPinchHandler.bind(this);
        this._initialPinchHandler();
        this._onPanHandlerStateChange = this._onPanHandlerStateChange.bind(this);
        this._onPinchHandlerStateChange = this._onPinchHandlerStateChange.bind(this);
        console.log(this.props.nodes)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchKeyword != this.props.searchKeyword && nextProps.searchKeyword) {
            this.setMapOffset(-100, -100); // sample, TO DO : search the maptile and change the map offset
        }

    }

    setMapOffset(x, y) {
        this._lastOffset.x = x;
        this._lastOffset.y = y;
        this._translateX.setOffset(this._lastOffset.x);
        this._translateX.setValue(0);
        this._translateY.setOffset(this._lastOffset.y);
        this._translateY.setValue(0);
    }

    _initialCache(){
        const left = this.props.dim.left;
        const top = this.props.dim.top;
        const width = this.props.dim.width;
        const height = this.props.dim.height;
        this.cache = new Array(height);
        for(i = 0; i < height; i++){
            this.cache[i] = new Array(width + 1);
        } 
        for(i = 0; i < height; i++){
            for(j = 0; j < width + 1; j++){
                this.cache[i][j] = {
                    logicLeft: logicTileSize * j + left,
                    logicTop: logicTileSize * i + top,
                    left: mapTileSize * j,
                    top: mapTileSize * i,
                    dir: null,
                    zoomLevel: this.props.zoomLevel,
                    floorId: this.props.currFloor
                } 
            }
        }
    }

    _initialPanHandler(){
        this._translateX = new Animated.Value(0);
        this._translateY = new Animated.Value(0);
        this._lastOffset = { x: 0, y: 0 };
        this._onGestureEvent = Animated.event(
            [ { nativeEvent: {
                  translationX: this._translateX,
                  translationY: this._translateY,
                } } ], 
                { useNativeDriver: { USE_NATIVE_DRIVER: true } }
        );
    }

    _initialPinchHandler(){
        this._baseScale = new Animated.Value(1);
        this._pinchScale = new Animated.Value(1);
        this._scale = Animated.multiply(this._baseScale, this._pinchScale);
        this._lastScale = 1;
        this._onPinchGestrueEvent = Animated.event(
            [{nativeEvent: {scale: this._pinchScale}}],
            { useNativeDriver: { USE_NATIVE_DRIVER: true }}
        )
    }

    _onPinchHandlerStateChange(event){
        if(event.nativeEvent.oldState === State.ACTIVE){
            this._lastScale *= event.nativeEvent.scale;
            this._baseScale.setValue(this._lastScale);
            this._pinchScale.setValue(1);
        }
    }

    _onPanHandlerStateChange(event){
        if (event.nativeEvent.oldState === State.ACTIVE) {
            this._lastOffset.x += event.nativeEvent.translationX;
            this._lastOffset.y += event.nativeEvent.translationY;
            this.setMapOffset(this._lastOffset.x, this._lastOffset.y)
            this.props.resetCurrentSearchKeyword(); // only change the navigator currentSearchKeyword but not searchInput in searchBar
        }
    }

    _renderByDir(item){
        return(
            <Image 
                source={{uri: dirToUri(item.dir)}}
                style={{width: mapTileSize, height: mapTileSize, top: item.top, left: item.left,
                position:'absolute'}}
            />
        )
    }

    _renderNotFound(){
        return(
            <NotFoundZoom0 />
        )
    }

    _renderAllMapTile(){
        return (
            this.props.cache.map(
                (row, rowIndex) => (
                    <View style={{flexDirection: 'row'}} key={rowIndex}>
                        {row.map(
                            (item, index) => <Image source={{uri: dirToUri(item.dir)}}
                            key={`${rowIndex} ${index}`}
                            style={{width:80, height:80}}/>
                        )}
                    </View>
                )
            )
        );
    }

    render(){
        return(
            <PanGestureHandler
            ref={this.panRef}
            maxPointers={1}
            onGestureEvent={this._onGestureEvent}
            onHandlerStateChange={this._onPanHandlerStateChange}>
                <Animated.View style={{flex:1}}>
                    <ReactNativeZoomableView
                    maxZoom={1.5}
                    minZoom={0.5}
                    zoomStep={0.5}
                    initialZoom={1}
                    bindToBorders={true}
                    onZoomAfter={this.logOutZoomState}
                    >
                        <Animated.View
                            style={[{
                                transform:[
                                    {translateX: this._translateX},
                                    {translateY: this._translateY},
                                ]
                        }, ]}>
                            {this._renderAllMapTile()}
                        </Animated.View>
                    </ReactNativeZoomableView>
                </Animated.View>
            </PanGestureHandler>
        )
    }
}  

function cacheReducer(dim, zoomLevel, currFloor){
    var cache = new Array(height);
    const left = dim.left;
    const top = dim.top;
    const width = dim.width;
    const height = dim.height;
    for(i = 0; i < height; i++){
        cache[i] = new Array(width + 1);
    } 
    for(i = 0; i < height; i++){
        for(j = 0; j < width + 1; j++){
            cache[i][j] = {
                logicLeft: logicTileSize * j + left,
                logicTop: logicTileSize * i + top,
                left: mapTileSize * j,
                top: mapTileSize * i,
                dir: null,
                zoomLevel: zoomLevel,
                floorId: currFloor
            } 

            try{
                cache[i][j].dir = api.mapTiles({
                    floorId: cache[i][j].floorId,
                    x: cache[i][j].logicLeft,
                    y: cache[i][j].logicTop,
                    zoomLevel: cache[i][j].zoomLevel
                })
            }catch(error){
                cache[i][j].dir = NOT_Found;
            }
        }
    }
    return cache;
}

function mapStateToProps(state){
 return({
    offSetX: state.floorReducer.currentFloor.startX,
    offSetY: state.floorReducer.currentFloor.startY,
    width: state.floorReducer.currentFloor.mapWidth,
    height: state.floorReducer.currentFloor.mapHeight,
    dim: getFloorDimension(
        state.floorReducer.currentFloor.startX,
        state.floorReducer.currentFloor.startY,
        state.floorReducer.currentFloor.mapWidth,
        state.floorReducer.currentFloor.mapHeight
    ),
    currFloor: state.floorReducer.currentFloor._id,
    zoomLevel: 0,
    nodes: state.nodesReducer.data,
    cache: cacheReducer(getFloorDimension(
        state.floorReducer.currentFloor.startX,
        state.floorReducer.currentFloor.startY,
        state.floorReducer.currentFloor.mapWidth,
        state.floorReducer.currentFloor.mapHeight
    ), 0, state.floorReducer.currentFloor._id)
 });
}

export default connect(mapStateToProps, null)(MapTiles);