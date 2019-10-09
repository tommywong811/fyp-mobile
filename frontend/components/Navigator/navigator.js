import React from 'react';
import { connect } from 'react-redux';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import {  
    Text, 
    View, 
    StyleSheet,
    Dimensions,
    ScrollView,
    Keyboard,
} from 'react-native';
import { 
    CHANGE_FLOOR, 
    CHANGE_BUILDING,
    CHANGE_NODE
} from '../../reducer/floors/actionList';
import { Button } from 'native-base';
import SearchBar from '../searchBar/searchBar';
import MapTiles from '../mapTiles/MapTiles';
const {width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/AntDesign';
import * as Base from 'native-base';
import { api } from '../../../backend'
import realm from '../../../backend/Realm/realm';
import { searchShortestPath } from '../../../backend/api/search/searchShortestPath';

/**
 * childrenView: 
 */
class Navigator extends React.Component{

    constructor(props){
        super(props);
        this._renderDrawer = this._renderDrawer.bind(this);
        this._allBuildings = this._getUniqueBuildingId(this.props.allFloors);
        this._getAllFloors = this._getAllFloors.bind(this);
        this.state = {
            allFloorIds : this._getAllFloors()
        }
    }

    componentWillMount() {
        this.setState({
            searchInput: '',
            currentSearchKeyword: '',
            currentLocation: ''
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.currentNode != this.props.currentNode) {  // for _searchRoom function after find_node
            this.props.change_floor(nextProps.currFloor, nextProps.currentBuilding)
        }
    }

    _onChangeSearchText(text) {
        this.setState({
            searchInput: text,
        });
    }

    _onChangeCurrentLocationText(text) {
        this.setState({
            currentLocation: text
        })
    }

    _onChangeCurrentSearchKeyword() {
        // this.setState({
        //     currentSearchKeyword: keyword,
        // })
        // if(this.state.searchInput=='' || this.state.currentLocation=='') {
        //     alert('No input is entered')
        //     return;
        // };
        // alert(JSON.stringify(api.nodes({name: this.state.searchInput}), null, 2))
        // let fromNode = realm.objects('nodes').filtered(`name CONTAINS[c] '${this.state.searchInput}' AND unsearchable != true`)
        // let toNode = realm.objects('nodes').filtered(`name CONTAINS[c] '${this.state.currentLocation}' AND unsearchable != true`)
        // let fromNode = Array.from(realm.objects('nodes').filtered(`name CONTAINS[c] '${5017}' AND unsearchable != true`))
        // let toNode = Array.from(realm.objects('nodes').filtered(`name CONTAINS[c] '${5018}' AND unsearchable != true`))
        // // alert(JSON.stringify(Array.from(fromNode), null, 2))
        // let fromId = fromNode[0]['_id'];
        // let toId = toNode[0]['_id'];
        // let fromBuildingId = Array.from(realm.objects('floors').filtered(`_id = '${fromNode[0].floorId}'`))[0].buildingId
        // let toBuildingId = Array.from(realm.objects('floors').filtered(`_id = '${toNode[0].floorId}'`))[0].buildingId
        // let res = searchShortestPath(fromId, toId)
        // this.props.change_floor(fromNode[0].floorId,fromBuildingId)
        // alert(JSON.stringify(res,null,2))
    }

    _searchRoom() {
        Keyboard.dismiss()
        this.props.change_node(this.state.searchInput);
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
                <Text h1>Buildings</Text>
                <View style={styles.lineStyle} />
                {this._allBuildings.map(item => 
                    <Button transparent
                        key={item}
                        type='clear'
                        onPress={()=>{
                            if(item !== this.props.currBuilding){
                                this.props.change_building(item);
                            }
                            this.drawer.closeDrawer();
                        }}
                    >
                        <Text>{this._buildingnameToString(item)}</Text>
                    </Button>)}
                <View style={styles.lineStyle} />
                <Text h2>Floors</Text>
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
        } = this.state;console.log(searchInput)

        return(
            <View style={{flex:6, zIndex: 1}}>
                <DrawerLayout
                    ref={drawer => {this.drawer=drawer}}
                    drawerWidth={width * 1 / 2}
                    drawerPosition={DrawerLayout.positions.Left}
                    drawerType='front'
                    drawerBackgroundColor="#ddd"
                    renderNavigationView={this._renderDrawer}
                >
                    <View style={{position:'absolute',zIndex:1, flexDirection:'row'}}>
                        <Button light onPress={()=>this.drawer.openDrawer()}>
                            <Base.Icon name='arrow-forward' />
                        </Button>
                        <View style={{width: '100%', flexDirection: 'row'}}>
                            <View>
                                {/* <SearchBar searchInput={searchInput} placeholder="Where are you?" onChangeText={(input)=> this._onChangeCurrentLocationText(input)}/> */}
                                <SearchBar searchInput={searchInput} placeholder="Where are you going?" onChangeText={(input)=> this._onChangeSearchText(input)}/>
                            </View>
                            <Button light onPress={()=> this._searchRoom()}>
                                <Icon size={30} name='enter' />
                            </Button>
                        </View>
                    </View>
                    {/* {this.props.children} */}
                    <MapTiles 
                        searchKeyword={this.state.currentSearchKeyword}
                        resetCurrentSearchKeyword={() => this._resetCurrentSearchKeyword()}
                    ></MapTiles>
                </DrawerLayout>
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
        change_node: (name)=>dispatch({type: CHANGE_NODE, payload: {name: name}})
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
          
      } 
})