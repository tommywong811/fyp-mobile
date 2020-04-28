import React from 'react';
import { connect } from 'react-redux';
import {
    Image,
    Animated,
    View,
    Text,
    Dimensions,
    Platform,
    Keyboard,
    Modal,
    StyleSheet,
    NativeModules,
} from 'react-native';
import NotFoundZoom0 from '../../asset/notFoundZoom0';
import { getFloorDimension, dirToUri, getNodeOffsetForEachFloor, getNodeImageByTagId, getNodeImageByConnectorId } from '../../plugins/MapTiles';
import { mapTileSize, logicTileSize } from './config';
import { api } from '../../../backend';
import store from '../../../store.js';
import {
    UPDATE_MAPTILE_CACHE
} from '../../reducer/floors/actionList.js';
import {
    TouchableOpacity,
} from 'react-native-gesture-handler';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import { findNodeNearCoordinates } from '../../../backend/api/nodes/findNodeNearCoordinates';
import { Actions } from 'react-native-router-flux';
import FacilityInfoPage from '../EventListPage/EventListPage'
import { Button } from "native-base";
import { SliderBox } from "react-native-image-slider-box";
import { TabView, SceneMap } from 'react-native-tab-view';

const NOT_Found = 'NOT FOUND';
const screenSizeX = Dimensions.get('window').width;
const screenSizeY = Dimensions.get('window').height;

class MapTiles extends React.Component {

    constructor(props) {
        super(props);
        this._initialCache = this._initialCache.bind(this);
        this._initialCache();
        this._renderAllMapTile = this._renderAllMapTile.bind(this);
        this._onPanMoveHandler = this._onPanMoveHandler.bind(this)
        this._onPanEndHandler = this._onPanEndHandler.bind(this)
        this._isSearchRoomInProgress = false;
        this.state = {
            pan: new Animated.ValueXY({
                x: -80,
                y: 0,
            }),
            gestureOffset: { x: -80, y: 0 },
            zoom: 1,
            modalVisible: false,
            selectedNode: null,
        };
    }

    componentWillMount() {
        this.setState({
            'nodesInFloor': this.props.nodes.filter((node) => node.floorId === this.props.currFloor),
            'nodeOffset': getNodeOffsetForEachFloor(this.props.currFloor),
            'pathInCurrFloor': [],
        });
    }

    componentDidMount() {
        if (!this.props.currentNode && this.props.currBuilding === 'academicBuilding') {   // the first maptile present in the app
            this.setMapOffset(-440, -300)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentNode != this.props.currentNode && nextProps.currentNode) {
            this._isSearchRoomInProgress = true; // to run setMapOffset after floor change
        }

        if (nextProps.currFloor != this.props.currFloor || this._isSearchRoomInProgress) {
            const nodeOffset = getNodeOffsetForEachFloor(nextProps.currFloor);
            this.setState({
                'nodesInFloor': this.props.nodes.filter((node) => node.floorId === nextProps.currFloor),
                'nodeOffset': nodeOffset,
            })

            if (this._isSearchRoomInProgress) { // for search room
                const {
                    startX,
                    startY,
                } = nextProps.floors.find((floor) => floor._id === nextProps.currFloor);

                let x = (nextProps.currentNode.centerCoordinates[0] - startX) / logicTileSize * 80 + nodeOffset.x - screenSizeX / 2;
                let y = (nextProps.currentNode.centerCoordinates[1] - startY) / logicTileSize * 80 + nodeOffset.y - screenSizeY / 2;
                this.setMapOffset(-x, -y);
                this._isSearchRoomInProgress = false;
            } else { // for switch floor
                this.setMapOffset(-80 - nodeOffset.x, 0);
            }
        }
        if (nextProps.shortestPath.data) {
            this.setState({
                'pathInCurrFloor': nextProps.shortestPath.data.filter((data) => data.floorId === nextProps.currFloor)
            })
        }
    }

    setMapOffset(x, y) {
        this.setState({
            gestureOffset: {
                x: x - (this.state.zoom > 1 ? 105 : 0),
                y: y - (this.state.zoom > 1 ? 170 : 0)
            }
        });

        this.state.pan.setValue({
            x: x - (this.state.zoom > 1 ? 105 : 0),
            y: y - (this.state.zoom > 1 ? 170 : 0),
        });
        this.forceUpdate();
    }

    _initialCache() {
        const left = this.props.dim.left;
        const top = this.props.dim.top;
        const width = this.props.dim.width;
        const height = this.props.dim.height;
        this.cache = new Array(height);
        for (i = 0; i < height; i++) {
            this.cache[i] = new Array(width + 1);
        }
        for (i = 0; i < height; i++) {
            for (j = 0; j < width + 1; j++) {
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

    _renderByDir(item) {
        return (
            <Image
                source={{ uri: dirToUri(item.dir) }}
                style={{
                    width: mapTileSize, height: mapTileSize, top: item.top, left: item.left,
                    position: 'absolute'
                }}
            />
        )
    }

    _renderNotFound() {
        return (
            <NotFoundZoom0 />
        )
    }

    _renderAllMapTile() {
        return (
            this.props.cache.map(
                (row, rowIndex) => (
                    <View style={{ flexDirection: 'row' }} key={rowIndex}>
                        {row.map(
                            (item, index) => <View key={index}>
                                <Image source={{ uri: Platform.OS === 'android' ? `asset:/image/mapTiles/${item.dir}` : `${item.dir}` }}
                                    key={`${rowIndex} ${index}`}
                                    style={{ width: 80, height: 80 }} />
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
                    width: 80 * this.props.cache[0].length,
                    height: 80 * this.props.cache.length,
                    zIndex: 2,
                }]}>
                {this.state.nodesInFloor.map((node, key) => {
                    if (node.centerCoordinates) {
                        nodeName = node.name;
                        if (nodeName.includes('ROOM')) {
                            return (
                                <View
                                    key={key}
                                    style={[{
                                        flex: 1,
                                        position: 'absolute',
                                        top: (node.centerCoordinates[1] - this.props.offSetY) / logicTileSize * 80 + this.state.nodeOffset.y,
                                        left: (node.centerCoordinates[0] - this.props.offSetX) / logicTileSize * 80 + this.state.nodeOffset.x,
                                    }]}>
                                    <Text
                                        style={[{
                                            fontSize: 6,
                                        }]}
                                        onPress={() => NativeModules.Administration.Navigation(node.name)}
                                    >
                                        {node.name.split('ROOM ')[1]}
                                    </Text>
                                </View>
                            )
                        } else if (node.connectorId && getNodeImageByConnectorId(node.connectorId)) {
                            return (
                                <View
                                    key={key}
                                    style={[{
                                        flex: 1,
                                        position: 'absolute',
                                        top: (node.centerCoordinates[1] - this.props.offSetY) / logicTileSize * 80 + this.state.nodeOffset.y,
                                        left: (node.centerCoordinates[0] - this.props.offSetX) / logicTileSize * 80 + this.state.nodeOffset.x + 2,
                                    }]}>
                                    <TouchableOpacity onPress={() => {
                                        // this.setModalVisible(true);
                                        // this.setState({ selectedNode: node.name });
                                        Actions.FacilityInfoPage({ selectedNode: node.name });
                                    }}>
                                        <Image
                                            source={getNodeImageByConnectorId(node.connectorId)}
                                            style={[{ height: 10, width: 10 }]}
                                        >
                                        </Image>
                                    </TouchableOpacity>
                                </View>
                            )
                        } else if (node.tagIds && node.tagIds.length > 0 && getNodeImageByTagId(node.tagIds[0])) {
                            return (
                                <View
                                    key={key}
                                    style={[{
                                        flex: 1,
                                        position: 'absolute',
                                        top: (node.centerCoordinates[1] - this.props.offSetY) / logicTileSize * 80 + this.state.nodeOffset.y,
                                        left: (node.centerCoordinates[0] - this.props.offSetX) / logicTileSize * 80 + this.state.nodeOffset.x + 2,
                                    }]}>
                                    <TouchableOpacity onPress={() => {
                                        // alert(node.name)
                                        Actions.FacilityInfoPage({ selectedNode: node.name });
                                    }
                                    }>
                                        <Image
                                            source={getNodeImageByTagId(node.tagIds[0])}
                                            style={[{ height: 10, width: 10 }]}
                                        >
                                        </Image>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    }
                    return (
                        <View
                            key={key}
                            style={[{
                                flex: 1,
                                position: 'absolute',
                                top: (node.centerCoordinates[1] - this.props.offSetY) / logicTileSize * 80 + this.state.nodeOffset.y,
                                left: (node.centerCoordinates[0] - this.props.offSetX) / logicTileSize * 80 + this.state.nodeOffset.x,
                            }]}>
                            <Text
                                style={[{
                                    fontSize: 6,
                                }]}
                            >
                                {node.name}
                            </Text>
                        </View>
                    )
                })
                }

                {this.props.currentNode &&
                    <Image source={require('../../../res/tags/pin.png')}
                        style={{
                            width: 4, height: 9,
                            flex: 1,
                            position: 'absolute',
                            top: (this.props.currentNode.centerCoordinates[1] - this.props.offSetY) / logicTileSize * 80 + this.state.nodeOffset.y - 10,
                            left: (this.props.currentNode.centerCoordinates[0] - this.props.offSetX) / logicTileSize * 80 + this.state.nodeOffset.x,
                        }}>
                    </Image>
                }
            </View>
        )
    }

    _renderPath() {
        const { pathInCurrFloor } = this.state;
        let x1 = null;
        let x2 = null;
        let y1 = null;
        let y2 = null;
        let length = null;
        let deg = null;
        let translateX = null;
        let translateY = null;

        return (
            <View
                style={[{
                    flex: 1,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 80 * this.props.cache[0].length,
                    height: 80 * this.props.cache.length,
                }]}>
                {pathInCurrFloor.map((node, key) => {
                    if (key === pathInCurrFloor.length - 1) {  // last node can't be the starting point of the line
                        return null
                    }
                    else {
                        x1 = (node.coordinates[0] - this.props.offSetX) / logicTileSize * 80 + this.state.nodeOffset.x;
                        x2 = (pathInCurrFloor[key + 1].coordinates[0] - this.props.offSetX) / logicTileSize * 80 + this.state.nodeOffset.x;
                        y1 = (node.coordinates[1] - this.props.offSetY) / logicTileSize * 80 + this.state.nodeOffset.y;
                        y2 = (pathInCurrFloor[key + 1].coordinates[1] - this.props.offSetY) / logicTileSize * 80 + this.state.nodeOffset.y;
                        length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
                        deg = Math.atan2((y2 - y1), (x2 - x1)) / 2 / Math.PI * 360;
                        translateX = - (length / 2) * (1 - Math.cos(deg * 2 * Math.PI / 360))
                        translateY = length / 2 * Math.sin(deg * 2 * Math.PI / 360)

                        return (
                            <View
                                key={key}
                                style={[{
                                    flex: 1,
                                    position: 'absolute',
                                    top: ((node.coordinates[1] - this.props.offSetY) / logicTileSize * 80 + this.state.nodeOffset.y) + translateY,
                                    left: (node.coordinates[0] - this.props.offSetX) / logicTileSize * 80 + this.state.nodeOffset.x + translateX,
                                    width: length,
                                    transform: [{ rotate: (deg + 'deg') }],
                                    height: 2,
                                    backgroundColor: 'red',
                                    borderRadius: 2,
                                }]}>
                            </View>
                        )
                    }
                })}
            </View>
        );
    }

    _onPanEndHandler(evt, gestureState, zoomableViewEventObject) {
        if (this.props.isSuggestionListOpen) {
            this.props.onCloseSuggestionList();
        }
        if (this.props.isKeyBoardShown) {
            Keyboard.dismiss();
        }
        this.state.gestureOffset.x += (gestureState.dx / zoomableViewEventObject.zoomLevel);
        this.state.gestureOffset.y += (gestureState.dy / zoomableViewEventObject.zoomLevel);
    }

    _onPanMoveHandler(evt, gestureState, zoomableViewEventObject) {
        // console.log('zoomableViewEventObject', zoomableViewEventObject);
        if (gestureState.numberActiveTouches == 1) {
            this.state.pan.setValue({
                x: (this.state.gestureOffset.x + gestureState.dx / zoomableViewEventObject.zoomLevel),
                y: (this.state.gestureOffset.y + gestureState.dy / zoomableViewEventObject.zoomLevel),
            });
        }
    }

    _onZoomAfter(evt, gestureState, zoomableViewEventObject) {
        if (this.props.isSuggestionListOpen) {
            this.props.onCloseSuggestionList();
        }
        if (this.props.isKeyBoardShown) {
            Keyboard.dismiss();
        }
        this.state.zoom = zoomableViewEventObject.zoomLevel
    }

    // _renderModal() {
    //     var selectedNode = this.state.selectedNode;
    //     return (
    //         <Modal
    //             animationType="slide"
    //             transparent={false}
    //             visible={this.state.modalVisible}
    //         >
    //             <Button
    //                 onPress={() => {
    //                     this.setModalVisible(!this.state.modalVisible);
    //                 }}
    //             >
    //                 <Text>X</Text>
    //             </Button>
    //             <SliderBox images={this.state.images} />
    //             <Text>{selectedNode}★★★★★ </Text>


    //         </Modal>
    //     );
    // }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }


    render() {
        let { pan } = this.state;
        let [translateX, translateY] = [pan.x, pan.y];
        let imageStyle = { transform: [{ translateX }, { translateY }], top: 0, left: 0, position: 'absolute' };
        return (
            <ReactNativeZoomableView
                style={{ flex: 1 }}
                maxZoom={1.5}
                minZoom={0.5}
                zoomStep={0.5}
                initialZoom={1}
                bindToBorders={true}
                onPanResponderMove={this._onPanMoveHandler}
                onPanResponderEnd={this._onPanEndHandler}
                onZoomAfter={this._onZoomAfter.bind(this)}
                onDoubleTapAfter={this._onZoomAfter.bind(this)}
            >
                <Animated.View
                    style={imageStyle}
                >
                    {this._renderAllMapTile()}
                    {this._renderAllNodes()}
                    {this.props.shortestPath.data && this._renderPath()}
                    {/* {this._renderModal()} */}
                </Animated.View>
            </ReactNativeZoomableView>
        )
    }
}

function cacheReducer(dim, zoomLevel, currFloor, mapTileCache) {
    if (mapTileCache[currFloor] == undefined) {
        var cache = new Array(height);
        const left = dim.left;  // starting coordinate
        const top = dim.top;    // starting coordinate
        const width = dim.width;    // number of tile in x
        const height = dim.height;  // number of tile in y
        for (i = 0; i < height; i++) {
            cache[i] = new Array(width + 1);
        };
        let mapTiles = api.mapTiles({ floorId: currFloor });
        for (i = 0; i < height; i++) {
            for (j = 0; j < width + 1; j++) {
                cache[i][j] = {
                    logicLeft: logicTileSize * j + left,
                    logicTop: logicTileSize * i + top,
                    left: mapTileSize * j,
                    top: mapTileSize * i,
                    dir: null,
                    zoomLevel: zoomLevel,
                    floorId: currFloor
                }
                try {
                    // cache[i][j].dir = api.mapTiles({
                    //     floorId: cache[i][j].floorId,
                    //     x: cache[i][j].logicLeft,
                    //     y: cache[i][j].logicTop,
                    //     zoomLevel: cache[i][j].zoomLevel
                    // })
                    cache[i][j].dir = mapTiles.find((r) => r.x === cache[i][j].logicLeft && r.y === cache[i][j].logicTop && r.zoomLevel === cache[i][j].zoomLevel).data
                } catch (error) {
                    cache[i][j].dir = NOT_Found;
                }
            }
        }
        store.dispatch({
            type: UPDATE_MAPTILE_CACHE,
            payload: cache,
        })
        return cache;

    } else {
        return mapTileCache[currFloor]
    }
}

function mapStateToProps(state) {
    return ({
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
        currBuilding: state.floorReducer.currentFloor.buildingId,
        nodes: state.nodesReducer.data,
        floors: state.floorReducer.data,
        cache: cacheReducer(getFloorDimension(
            state.floorReducer.currentFloor.startX,
            state.floorReducer.currentFloor.startY,
            state.floorReducer.currentFloor.mapWidth,
            state.floorReducer.currentFloor.mapHeight
        ), 0, state.floorReducer.currentFloor._id, state.floorReducer.mapTileCache),
        currentNode: state.floorReducer.currentNode,
        shortestPath: state.pathReducer,
    });
}

export default connect(mapStateToProps, null)(MapTiles);
