import React from 'react';
import { connect } from 'react-redux';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import LoadingPage from '../LoadingPage/LoadingPage';
import AsyncStorage from '@react-native-community/async-storage';
import {   
    View, 
    StyleSheet,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import { 
    CHANGE_FLOOR, 
    CHANGE_BUILDING,
    CHANGE_NODE,
    RENDER_LOADING_PAGE,
} from '../../reducer/floors/actionList';
import { Button, Container, Content, Text, Input, Item, Icon } from 'native-base';
import MapTiles from '../mapTiles/MapTiles'
const {width} = Dimensions.get('window');
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
            isBuilding: true,
            currentBuilding: null,
            expandedFloorId: null
        }
    }

    componentWillMount() {
        this.setState({
            searchInput: '',
            currentSearchKeyword: '',
            currentLocation: '',
            isLoading: false,
            suggestionList: [],
            currentNode: null,
            currentBuilding: 'academicBuilding',
            expandedFloorId: null
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
    _getAllFloors(buildingId){
        return this.props.allFloors.filter((item) => item.buildingId === buildingId)
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
                <ScrollView>
                    <Text style={styles.drawerSubSection}>Buildings</Text>
                    <View style={styles.lineStyle} />
                        {this._allBuildings.map(item => 
                            <View key={item}>
                                <Button 
                                    transparent
                                    style={styles.drawerItems}
                                    type='clear'
                                    onPress={()=>{
                                        this.setState({
                                            expandedFloorId: item,
                                            currentBuilding: this.state.currentBuilding === item ? null : item
                                        })
                                        // if(item !== this.props.currBuilding){
                                        //     this.props.render_loading_page();
                                        //     this.props.change_building(item);
                                        // }
                                        // this.drawer.closeDrawer();
                                    }}
                                >
                                    <Text>{this._buildingnameToString(item)}</Text>                                
                                </Button>
                                {this.state.expandedFloorId === item ? this._getAllFloors(item).map(floor => {
                                    return(
                                        <Text 
                                            style={styles.drawerSubItems}
                                            key={floor._id}
                                            onPress={()=>{
                                                if(item._id !== this.props.currFloor){
                                                    setTimeout(()=>{ // to let the menu close
                                                        this.props.render_loading_page();
                                                        this.props.change_floor(floor._id, floor.buildingId);
                                                    }, 100)
                                                }
                                                this.drawer.closeDrawer();
                                            }}    
                                        >
                                            {floor._id}
                                        </Text>
                                    )
                                }) : null}
                            </View>
                        )}
                    {/* <View style={styles.lineStyle} />
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
                    } */}
                </ScrollView>
            </View>
        );
    }
    _renderBuildings = () => {
        return(
            <View>
                <ScrollView scrollEventThrottle={16}>
                <Text style={styles.drawerSubSection}>Buildings</Text>
                <View style={styles.lineStyle} />
                {this._allBuildings.map(item =>{
                    // if(item !== this.props.currBuilding){
                        return(
                            <Item key={item} style={{borderWidth: 0}}>
                                {/* <Button 
                                transparent
                                style={styles.drawerItems}
                                key={item}
                                type='clear'
                                onPress={()=>{
                                    if(item !== this.props.currBuilding){
                                        // this.props.render_loading_page();
                                        this.props.change_building(item);
                                    }
                                    //this.drawer.closeDrawer();
                                    this.setState({isBuilding: false});
                                }}
                            > */}
                                <Text style={{
                                    color:'#003366',
                                    padding: 10
                                }}>
                                    {this._buildingnameToString(item)}
                                </Text>
                                <Icon 
                                    name='arrow-dropdown'
                                    onPress={()=>{
                                        if(item !== this.props.currBuilding){
                                            // this.props.render_loading_page();
                                            this.props.change_building(item);
                                        }
                                        //this.drawer.closeDrawer();
                                        this.setState({isBuilding: false});
                                    }}
                                ></Icon>
                            {/* </Button> */}
                            </Item>
                        );
                    // }else{
                    //     return(
                    //     <Button info
                    //         style={styles.drawerItems}
                    //         key={item}
                    //         type='clear'
                    //         onPress={()=>{
                    //             if(item !== this.props.currBuilding){
                    //                 // this.props.render_loading_page();
                    //                 this.props.change_building(item);
                    //             }
                    //             //this.drawer.closeDrawer();
                    //             this.setState({isBuilding: false});
                    //         }}
                    //     >
                    //         <Text style={{color:'#003366'}}>{this._buildingnameToString(item)}</Text>
                    //     </Button>
                    //     );
                    // }
                } 
            )}
                </ScrollView>
            </View>);
    }
    _renderFloors = () => {
        return(
            <View>
                <ScrollView scrollEventThrottle={16}>
                    <Icon size={32} name='arrow-round-back' style={{flexDirection:"row"}} onPress={()=>{this.setState({isBuilding: true})}}>
                        <Text style={styles.drawerSubSection}>Floors</Text>
                    </Icon>

                {this._getAllFloors().map(item => {
                    if(item._id !== this.props.currFloor){
                        return(
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
                            <Text style={{color:'#003366'}}>{item._id}</Text>
                            </Button>
                        );
                    }else{
                        return(
                            <Button info
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
                            <Text style={{color:'#003366'}}>{item._id}</Text>
                        </Button>
                        )
                    }
                })
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
        // if(this.state.isBuilding)
        return(
            <DrawerLayout
                ref={drawer => {this.drawer=drawer}}
                drawerWidth={width * 1 / 2}
                drawerPosition={DrawerLayout.positions.Left}
                drawerType='front'
                drawerBackgroundColor="#FFFFFF"
                renderNavigationView={this._renderDrawer}
            >
                <Container>
                    <LoadingPage text="Loading...">
                        <Item rounded style={{
                            backgroundColor: 'white',
                            borderColor: '#BCE0FD',
                            borderWidth: 2,
                            marginTop: 10,
                            marginLeft: 5,
                            marginRight: 5,
                            zIndex: 999
                        }}>
                            <Icon active name='md-menu' style={{color:'#003366'}} onPress={()=>this.drawer.openDrawer()}></Icon>
                            <Input
                                placeholder="Where are you going?"
                                placeholderTextColor="#003366"
                                fontSize={17}
                                onChangeText={(input)=> this._onChangeSearchText(input)} 
                                onFocus={() => this._onFocusSearchBar()}
                                style={{
                                    backgroundColor: 'white',
                                    borderColor: 'transparent',
                                    borderWidth: 1,
                                    backgroundColor: "transparent",
                                    borderRadius: 10,
                                    height: 48,
                                    padding: 10
                                }}
                                value={searchInput}
                            />
                            <Icon active name='search' style={{color:'#003366'}}></Icon>
                        </Item>
                        <View style={{maxHeight: 200}}>
                            <ScrollView 
                                keyboardShouldPersistTaps="always"
                                style={{zIndex:2, marginLeft: 15, marginRight: 15, marginTop: 10}}
                            >
                                {suggestions}
                            </ScrollView>
                        </View>
                        <MapTiles 
                            onCloseSuggestionList={()=> this.setState({suggestionList: []})}
                            searchKeyword={this.state.currentSearchKeyword}
                            resetCurrentSearchKeyword={() => this._resetCurrentSearchKeyword()}
                        ></MapTiles>
                        <View>
                            <Text style={{ padding: 5, fontSize: 20, fontWeight: 'bold', color: '#003366'}}>{this._buildingnameToString(this.props.currBuilding)} - {this.props.currFloor}</Text>
                        </View>
                    </LoadingPage>
                </Container>
            </DrawerLayout>
        );
        // else
        //     return(
        //         <DrawerLayout
        //             ref={drawer => {this.drawer=drawer}}
        //             drawerWidth={width * 1 / 2}
        //             drawerPosition={DrawerLayout.positions.Left}
        //             drawerType='front'
        //             drawerBackgroundColor="#ddd"
        //             renderNavigationView={this._renderFloors}
        //         >
        //             <Container>
        //                 <LoadingPage text="Loading...">
        //                     <Item rounded style={{
        //                         backgroundColor: 'white',
        //                         borderColor: '#BCE0FD',
        //                         borderWidth: 2,
        //                         marginTop: 10,
        //                         marginLeft: 5,
        //                         marginRight: 5,
        //                         zIndex: 999
        //                     }}>
        //                         <Icon active name='md-menu' style={{color:'#003366'}} onPress={()=>this.drawer.openDrawer()}></Icon>
        //                         <Input
        //                             placeholder="Where are you going?"
        //                             placeholderTextColor="#003366"
        //                             fontSize={17}
        //                             onChangeText={(input)=> this._onChangeSearchText(input)} 
        //                             onFocus={() => this._onFocusSearchBar()}
        //                             style={{
        //                                 backgroundColor: 'white',
        //                                 borderColor: 'transparent',
        //                                 borderWidth: 1,
        //                                 backgroundColor: "transparent",
        //                                 borderRadius: 10,
        //                                 height: 48,
        //                                 padding: 10
        //                             }}
        //                             value={searchInput}
        //                         />
        //                         <Icon active name='search' style={{color:'#003366'}}></Icon>
        //                     </Item>
        //                     <View style={{maxHeight: 200}}>
        //                         <ScrollView 
        //                             keyboardShouldPersistTaps="always"
        //                             style={{zIndex:2, marginLeft: 15, marginRight: 15, marginTop: 10}}
        //                         >
        //                             {suggestions}
        //                         </ScrollView>
        //                     </View>
        //                     <MapTiles 
        //                         onCloseSuggestionList={()=> this.setState({suggestionList: []})}
        //                         searchKeyword={this.state.currentSearchKeyword}
        //                         resetCurrentSearchKeyword={() => this._resetCurrentSearchKeyword()}
        //                     ></MapTiles>
        //                     <View>
        //                         <Text style={{ padding: 5, fontSize: 20, fontWeight: 'bold', color: '#003366'}}>{this._buildingnameToString(this.props.currBuilding)} - {this.props.currFloor}</Text>
        //                     </View>
        //                 </LoadingPage>
        //             </Container>
        //         </DrawerLayout>
        //         // <View style={{position: 'absolute', flex: 1, justifyContent: 'center', top: 0, left: 0, right: 0, bottom: 0}}>
        //         //     <ActivityIndicator size="large" color="#0000ff" animating={isLoading}></ActivityIndicator>
        //         // </View>
        //     );
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
        backgroundColor: 'white',
      },
      pageText: {
        fontSize: 21,
        color: '#003366',
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
        marginLeft: 20,
        marginRight: 20,
      }, 
      text1:{
          
      },
      drawerSubSection: {
        fontSize: 20,
        padding: 5,
        color: '#003366',
        fontWeight: "bold"
      },
      drawerItems: {
        backgroundColor: 'white',
        color: '#003366',
        paddingLeft: 10,
        width: '100%',
      },
      drawerSubItems: {
        backgroundColor: 'white',
        color: '#003366',
        marginLeft: 51,
        padding: 9,
        width: '100%',
      }
})
