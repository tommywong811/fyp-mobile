import React from 'react';
import { connect } from 'react-redux'; 
import {
    Image,
    Animated,
    View,
    Text,
    Dimensions,
} from 'react-native';
import NotFoundZoom0 from '../../asset/notFoundZoom0';
import { getFloorDimension, dirToUri, getNodeOffsetForEachFloor, getNodeImageByTagId, getNodeImageByConnectorId } from '../../plugins/MapTiles';
import {mapTileSize, logicTileSize} from './config';
import { api } from '../../../backend';
import { 
    PanGestureHandler, 
    PinchGestureHandler,
    State,
    TouchableOpacity,
} from 'react-native-gesture-handler';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {findNodeNearCoordinates} from '../../../backend/api/nodes/findNodeNearCoordinates';

const MAP_TILE_WIDTH = 200;
const MAP_TILE_HEIGHT = 200;
const NOT_Found = 'NOT FOUND'; 
const screenSizeX = Dimensions.get('window').width;
const screenSizeY = Dimensions.get('window').height;

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

    componentWillMount() {
        this.setState({
            'nodesInFloor': this.props.nodes.filter((node) => node.floorId === this.props.currFloor),
            'nodeOffset': getNodeOffsetForEachFloor(this.props.currFloor),
        });

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentNode != this.props.currentNode && nextProps.currentNode) {
            // console.log(this.props.floors)
            const nodeOffset = getNodeOffsetForEachFloor(nextProps.currentNode.floorId);

            const {
                startX,
                startY,
            } = nextProps.floors.find((floor) => floor._id === nextProps.currentNode.floorId);

            let x = (nextProps.currentNode.centerCoordinates[0] - startX) /  logicTileSize * 80 + nodeOffset.x - screenSizeX / 2;
            let y = (nextProps.currentNode.centerCoordinates[1] - startY) /  logicTileSize * 80 + nodeOffset.y - screenSizeY / 2;
            this.setMapOffset(-x, -y); //still experimenting with the correct offset
        }

        if(nextProps.currFloor != this.props.currFloor) {
            this.setState({
                'nodesInFloor': this.props.nodes.filter((node) => node.floorId === nextProps.currFloor),
                'nodeOffset': getNodeOffsetForEachFloor(nextProps.currFloor),
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
        let nodeName = null;

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
                        nodeName = node.name;
                        if (nodeName.includes('ROOM')) {
                            return(
                                <View
                                    key = {key}
                                    style={[{
                                        flex: 1,
                                        position: 'absolute',
                                        top:  (node.centerCoordinates[1] - this.props.offSetY) /  logicTileSize * 80 + this.state.nodeOffset.y,
                                        left: (node.centerCoordinates[0] - this.props.offSetX) / logicTileSize * 80 + this.state.nodeOffset.x,
                                    }]}>
                                    <Text
                                        style={[{
                                            fontSize: 3,
                                        }]}
                                    >
                                        {node.name.split('ROOM ')[1]}
                                    </Text>
                                </View>
                            )
                        } else if (node.connectorId && getNodeImageByConnectorId(node.connectorId)) {
                            return(
                                <View
                                    key = {key}
                                    style={[{
                                        flex: 1,
                                        position: 'absolute',
                                        top:  (node.centerCoordinates[1] - this.props.offSetY) /  logicTileSize * 80 + this.state.nodeOffset.y,
                                        left: (node.centerCoordinates[0] - this.props.offSetX) / logicTileSize * 80 + this.state.nodeOffset.x + 2,
                                    }]}>
                                    <TouchableOpacity onPress={()=>{
                                        alert(node.name)
                                    }
                                    }>
                                        <Image
                                            source={getNodeImageByConnectorId(node.connectorId)}
                                            style={[{height: 5, width: 5}]}
                                        >
                                        </Image>
                                    </TouchableOpacity>
                                </View>
                            )
                        } else if (node.tagIds && node.tagIds.length > 0 && getNodeImageByTagId(node.tagIds[0])) {
                            return(
                                <View
                                    key = {key}
                                    style={[{
                                        flex: 1,
                                        position: 'absolute',
                                        top:  (node.centerCoordinates[1] - this.props.offSetY) /  logicTileSize * 80 + this.state.nodeOffset.y,
                                        left: (node.centerCoordinates[0] - this.props.offSetX) / logicTileSize * 80 + this.state.nodeOffset.x + 2,
                                    }]}>
                                    <TouchableOpacity onPress={()=>{
                                        alert(node.name)
                                    }
                                    }>
                                        <Image
                                            source={getNodeImageByTagId(node.tagIds[0])}
                                            style={[{height: 5, width: 5}]}
                                        >
                                        </Image>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    }
                    return (<View key={key}></View>)
                })
                }

                {this.props.currentNode &&
                    <View
                        style={[{
                            flex: 1,
                            position: 'absolute',
                            top:  (this.props.currentNode.centerCoordinates[1] - this.props.offSetY) /  logicTileSize * 80 + this.state.nodeOffset.y,
                            left: (this.props.currentNode.centerCoordinates[0] - this.props.offSetX) / logicTileSize * 80 + this.state.nodeOffset.x,
                            backgroundColor: 'red',
                            borderBottomColor: 'red',
                            borderRadius: 1,
                            width: 2,
                            height: 2,
                        }]}>
                    </View>
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
                                position: 'relative',
                                flex: 1,
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
    floors: state.floorReducer.data,
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