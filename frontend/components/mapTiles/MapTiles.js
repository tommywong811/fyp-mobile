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
import {findNodeNearCoordinates} from '../../../backend/api/nodes/findNodeNearCoordinates';

const MAP_TILE_WIDTH = 200;
const MAP_TILE_HEIGHT = 200;
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
    }

    componentWillMount() {console.log(this.props.nodes)
        this.setState({
            'nodesInFloor': this.props.nodes.filter((node) => node.floorId === this.props.currFloor),
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentNode != this.props.currentNode && nextProps.currentNode) {
            let x = parseInt(nextProps.currentNode.coordinates[0]/MAP_TILE_WIDTH) == -0 ? 0 : parseInt(nextProps.currentNode.coordinates[0]/MAP_TILE_WIDTH)*MAP_TILE_WIDTH
            let y = parseInt(nextProps.currentNode.coordinates[1]/MAP_TILE_HEIGHT) == -0 ? 0 : parseInt(nextProps.currentNode.coordinates[1]/MAP_TILE_HEIGHT)*MAP_TILE_HEIGHT
            // alert(`${x} ${y}`)
            // alert(JSON.stringify(nextProps.currentNode, null, 2))
            this.setMapOffset(-x, -y); //still experimenting with the correct offset
        }

        if(nextProps.currFloor != this.props.currFloor) {
            this.setState({
                'nodesInFloor': this.props.nodes.filter((node) => node.floorId === this.props.currFloor),
            })
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
                            (item, index) => <View>
                                <Image source={{uri: dirToUri(item.dir)}}
                                    key={`${rowIndex} ${index}`}
                                    style={{width:80, height:80}}/>
                                </View>
                        )}
                    </View>
                )
            )
        );
    }

    _renderAllNodes() {
        // console.log(this.state.nodesInFloor.length)
        // console.log(mapTileSize * this.props.cache.length)
        // console.log(this.state.nodesInFloor)
        // console.log(this.props.offSetX)
        return (
            <View
                style={[{
                    flex: 1,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: mapTileSize * this.props.cache.length,
                    height: mapTileSize * this.props.cache[0].length,
            }]}>
                {this.state.nodesInFloor.map((node, key)=>{
                    if (node.centerCoordinates) {
                        return(
                            <View
                                key = {key}
                                style={[{
                                    flex: 1,
                                    position: 'absolute',
                                    top:  (node.centerCoordinates[1] - this.props.offSetY) /  logicTileSize * 80,
                                    left: (node.centerCoordinates[0] - this.props.offSetX) / logicTileSize * 80 + 70,
                                }]}>
                                <Text
                                    style={[{
                                        fontSize: 3,
                                    }]}
                                >
                                    {node.name}
                                </Text>
                            </View>
                        )
                    }
                    return (<View></View>)
                })
                }
            </View>
        )
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
                                ],
                                position: 'relative'
                                },
                        ]}>
                            {this._renderAllMapTile()}
                            {this._renderAllNodes()}
                        </Animated.View>
                    </ReactNativeZoomableView>
                </Animated.View>
            </PanGestureHandler>
        )
    }
}  

function cacheReducer(dim, zoomLevel, currFloor){
    var cache = new Array(height);
    const left = dim.left;  // starting coordinate
    const top = dim.top;    // starting coordinate
    const width = dim.width;    // number of tile in x
    const height = dim.height;  // number of tile in y
    for(i = 0; i < height; i++){
        cache[i] = new Array(width + 1);
    };
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
    ), 0, state.floorReducer.currentFloor._id),
    currentNode: state.floorReducer.currentNode
 });
}

export default connect(mapStateToProps, null)(MapTiles);