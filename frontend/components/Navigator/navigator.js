import React from 'react';
import { connect } from 'react-redux';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import LoadingPage from '../LoadingPage/LoadingPage';
import AsyncStorage from '@react-native-community/async-storage';
import {  
    Text, 
    View, 
    StyleSheet,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Keyboard,
} from 'react-native';
import { 
    CHANGE_FLOOR, 
    CHANGE_BUILDING,
    CHANGE_NODE,
    RENDER_LOADING_PAGE,
} from '../../reducer/floors/actionList';
import { Button } from 'native-base';
import SearchBar from '../searchBar/searchBar';
import MapTiles from '../mapTiles/MapTiles'
const {width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/AntDesign';
import * as Base from 'native-base';
import { api } from '../../../backend'
import realm from '../../../backend/Realm/realm';
import { searchShortestPath } from '../../../backend/api/search/searchShortestPath';
import _ from 'lodash'

/**
 * childrenView: 
 */


class Navigator extends React.Component{

    constructor(props){
        super(props);
        this._renderDrawer = this._renderDrawer.bind(this);
        this._allBuildings = this._getUniqueBuildingId(this.props.allFloors);
        this._getAllFloors = this._getAllFloors.bind(this);
        this.isInputting = false;
        this.delay_execution = null;
        this.state = {
            allFloorIds : this._getAllFloors(),
        }
    }

    componentWillMount() {
        this.setState({
            searchInput: '',
            currentSearchKeyword: '',
            currentLocation: '',
            isLoading: false,
            suggestionList: [],
            currentNode: null
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentNode != this.props.currentNode) {  // for _searchRoom function after find_node
            this.props.change_floor(nextProps.currFloor, nextProps.currentBuilding);
            this.setState({
                isLoading: false,
            });
        }
    }

    async setCacheToSuggestionList() {
        let suggestionCache = await AsyncStorage.getItem('suggestions')
        if (suggestionCache) {
            let suggestionCacheData = JSON.parse(suggestionCache).data
            this.setState({
                suggestionList: suggestionCacheData,
            });
        }
    }

    _onFocusSearchBar(text) {
        if (!text) {
            this.setCacheToSuggestionList();
        }
    }

    _onChangeSearchText(text) {
        this.isInputting = true;
        this.setState({
            searchInput: text,
        });
        if(text !== '' && text !== ' ') {
            var nodes = api.nodes({name: text}).data;
            this.isInputting = false;
            nodes.forEach(e=>{
                e.buildingName = this._buildingnameToString(this.props.allFloors.find(floor=>floor._id == e.floorId)['buildingId'])
            })
            this.setState({
                suggestionList: nodes
            })
        } else {
            this.setCacheToSuggestionList();
        }
    }

    _onChangeCurrentLocationText(text) {
        this.setState({
            currentLocation: text
        })
    }

    _onPressSuggestion(node) {
        this.setState({
            searchInput: node.name, 
            suggestionList: []
        }, this._searchRoom(node))
    }

    _searchRoom(currentNode = null) {
        this.setState({
            isLoading: true,
            suggestionList: [], // suggestion dropdown dismiss after search button press
        })
        Keyboard.dismiss();
        setTimeout(()=>{  // only setTimeout can make the Keyboard dismiss before the change node finished
            this.props.change_node(this.state.searchInput, currentNode);
        }, 100);
    }

    _resetCurrentSearchKeyword() {
        this.setState({
            currentSearchKeyword: '',
            currentLocation: ''
        });
    }

    //get all unique building name
    _getUniqueBuildingId(data){
        let tempData = data.map(item => item.buildingId);
        let result = []
        for(i = 0; i < tempData.length; i++){
            if(!result.includes(tempData[i])){
                result.push(tempData[i]);
            }
        }
        return result;
    }
    //Get all floor names in one building
    _getAllFloors(){
        return this.props.allFloors.filter((item) => item.buildingId === this.props.currBuilding)
    }
    _buildingnameToString(name){
        switch(name){
            case 'academicBuilding': return 'Academic Building';
            case 'cyt': return 'CYT';
            case 'ias': return 'IAS'; 
            case 'lsk': return 'LSK';
            case 'campusMap': return 'Campus Map';
            case 'universityCenter': return 'University Center'; 
        }
    }

    _renderDrawer(){
        return(
            <View>
                <ScrollView scrollEventThrottle={16}>
                <Text style={styles.drawerSubSection}>Buildings</Text>
                <View style={styles.lineStyle} />
                {this._allBuildings.map(item => 
                    <Button transparent
                        style={styles.drawerItems}
                        key={item}
                        type='clear'
                        onPress={()=>{
                            if(item !== this.props.currBuilding){
                                this.props.render_loading_page();
                                this.props.change_building(item);
                            }
                            this.drawer.closeDrawer();
                        }}
                    >
                        <Text>{this._buildingnameToString(item)}</Text>
                    </Button>)}
                <View style={styles.lineStyle} />
                <Text style={styles.drawerSubSection}>Floors</Text>
                {this._getAllFloors().map(item => 
                    <Button transparent
                        style={styles.drawerItems}
                        key={item._id}
                        type='clear'
                        onPress={()=>{
                            if(item._id !== this.props.currFloor){
                                setTimeout(()=>{ // to let the menu close
                                    this.props.render_loading_page();
                                    this.props.change_floor(item._id, item.buildingId);
                                }, 100)
                            }
                            this.drawer.closeDrawer();
                        }}    
                    >
                        <Text>{item._id}</Text>
                    </Button>)
                }
                </ScrollView>
            </View>
        );
    }
    
    _renderRightBar = () => {
        return (
        <View style={{width: width/9, zIndex:1, position:'absolute', left: width*8/9, backgroundColor:'white'}}>
            {this._getAllFloors().map(item => 
            <Button transparent
                key={item._id}
                type='clear'
                onPress={()=>{
                    if(item._id !== this.props.currFloor){
                        this.props.change_floor(item._id, item.buildingId);
                    }
                    this.drawer.closeDrawer();
                }} 
            >
                <Text fontSize={8}>{item._id}</Text>    
            </Button>)}
        </View>)
    }


    render(){
        const {
            searchInput,
            currentSearchKeyword,
            isLoading,
        } = this.state;

        var suggestions = this.state.suggestionList.map((node, index) => {
            return (
                <TouchableOpacity
                    onPress={() => this._onPressSuggestion(node)}
                    style={{backgroundColor: 'white'}}
                    key={index}
                >
                        <Text
                            style={{padding: 10}}
                        >
                            {node.name}, {node.floorId}, {node.buildingName}
                        </Text>
                </TouchableOpacity>
            )

        })
        return(
            <View style={{flex:6, zIndex: 1}} onPress={() => {Keyboard.dismiss(); this.setState({suggestionList: []})}}>
                <DrawerLayout
                    ref={drawer => {this.drawer=drawer}}
                    drawerWidth={width * 1 / 2}
                    drawerPosition={DrawerLayout.positions.Left}
                    drawerType='front'
                    drawerBackgroundColor="#ddd"
                    renderNavigationView={this._renderDrawer}
                >
                    <View style={{width: '100%', zIndex:1, flexDirection:'row'}}>
                        <Button light onPress={()=>this.drawer.openDrawer()}>
                            <Base.Icon name='arrow-forward' />
                        </Button>
                        <View>
                            <View style={{width: 250, flexDirection:'row'}}>
                                {/* <SearchBar searchInput={searchInput} placeholder="Where are you?" onChangeText={(input)=> this._onChangeCurrentLocationText(input)}/> */}
                                <SearchBar searchInput={searchInput} placeholder="Where are you going?" onChangeText={(input)=> this._onChangeSearchText(input)} onFocus={() => this._onFocusSearchBar()}/>
                                <Button light onPress={()=>this._searchRoom()}>
                                    <Icon size={30} name='enter' />
                                </Button>
                            </View>
                            <View style={{maxHeight: 200}}>
                                <ScrollView 
                                    keyboardShouldPersistTaps="always"
                                    style={{zIndex:2}}
                                >
                                        {suggestions}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                    {/* {this.props.children} */}
                    <LoadingPage text="Loading...">
                        <MapTiles 
                            searchKeyword={this.state.currentSearchKeyword}
                            resetCurrentSearchKeyword={() => this._resetCurrentSearchKeyword()}
                        ></MapTiles>
                        <View>
                            <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#5e9cff'}}>{this._buildingnameToString(this.props.currBuilding)} - {this.props.currFloor}</Text>
                        </View>
                    </LoadingPage>
                </DrawerLayout>
                <View style={{position: 'absolute', flex: 1, justifyContent: 'center', top: 0, left: 0, right: 0, bottom: 0}}>
                    <ActivityIndicator size="large" color="#0000ff" animating={isLoading}></ActivityIndicator>
                </View>
            </View>

        );
    }
}


function mapStateToProps(state){
    return {
        currFloor: state.floorReducer.currentFloor._id,
        currBuilding: state.floorReducer.currentFloor.buildingId,
        allFloors: state.floorReducer.data,
        zoomLevel: 0,
        currentNode: state.floorReducer.currentNode,
        currentBuilding: state.floorReducer.currentBuilding
    };
}

function mapDispatchToProps(dispatch){
    return {
        change_floor: (floor, buildingId) => 
            dispatch({type: CHANGE_FLOOR, payload: {floor: floor, buildingId: buildingId}}),
        change_building: (floor) => dispatch({type: CHANGE_BUILDING, payload: {buildingId: floor}}),
        change_node: (name, currentNode=null)=>dispatch({type: CHANGE_NODE, payload: {name: name, currentNode:currentNode}}),
        render_loading_page: () => dispatch({type: RENDER_LOADING_PAGE, payload: true}),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      page: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        paddingTop: 40,
        backgroundColor: 'gray',
      },
      pageText: {
        fontSize: 21,
        color: 'white',
      },
      rectButton: {
        height: 60,
        padding: 10,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: 'white',
      },
      rectButtonText: {
        backgroundColor: 'transparent',
      },
      drawerContainer: {
        flex: 1,
        paddingTop: 10,
      },
      pageInput: {
        height: 60,
        padding: 10,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: '#eee',
      },
      drawerText: {
        margin: 10,
        fontSize: 15,
        textAlign: 'left',
      },
      lineStyle:{
        borderWidth: 0.5,
        borderColor:'black',
        margin:10,
      }, 
      text1:{
          
      },
      drawerSubSection: {
          fontSize: 18,
          paddingLeft: 5,
      },
      drawerItems: {
          paddingLeft: 10,
          minWidth: 40,
      }
})
