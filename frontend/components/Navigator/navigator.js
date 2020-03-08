import React from "react";
import { connect } from "react-redux";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import LoadingPage from "../LoadingPage/LoadingPage";
import AsyncStorage from "@react-native-community/async-storage";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  Platform,
  TouchableHighlight,
  Image
} from "react-native";
import {
  CHANGE_FLOOR,
  CHANGE_BUILDING,
  CHANGE_NODE,
  RENDER_LOADING_PAGE,
  SAVE_PREVIOUS_NODE,
} from "../../reducer/floors/actionList";
import {UPDATE_PATH, CLEAR_PATH_STATE} from "../../reducer/path/actionList";
import {
  Button,
  Container,
  Content,
  Text,
  Input,
  Item,
  Icon,
  ListItem
} from "native-base";
import MapTiles from "../mapTiles/MapTiles";
const { width } = Dimensions.get("window");
import * as Base from "native-base";
import { api } from "../../../backend";
import realm from "../../../backend/Realm/realm";
import { searchShortestPath } from "../../../backend/api/search/searchShortestPath";
import _ from "lodash";
import EventListPage from "../EventListPage/EventListPage";
import { Actions } from 'react-native-router-flux';

/**
 * childrenView:
 */

class Navigator extends React.Component {
  constructor(props) {
    super(props);
    this._renderDrawer = this._renderDrawer.bind(this);
    this._allBuildings = this._getUniqueBuildingId(this.props.allFloors);
    this._getAllFloors = this._getAllFloors.bind(this);
    this.isInputting = false;
    this.delay_execution = null;
    this.state = {
      allFloorIds: this._getAllFloors(),
      isBuilding: true,
      expandedFloorId: null
    };
  }

  componentWillMount() {
    this.setState({
      searchInput: "",
      fromSearchInput: "",
      toSearchInput: "",
      currentSearchKeyword: "",
      currentLocation: "",
      isLoading: false,
      fromSuggestionList: [],
      toSuggestionList: [],
      suggestionList: [],
      currentNode: null,
      fromNode: null, 
      toNode: null,
      floorInPath: null,
      expandedFloorId: null,
      currentPathFloorIndex: null,
      isKeyBoardShown: false,
      isFindDirection: false,
      previousSearchNode: null,
    });
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {this.setState({isKeyBoardShown: true})});
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {this.setState({isKeyBoardShown: false})});
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentNode != this.props.currentNode) {
      // for _searchRoom function after find_node
      this.props.change_floor(nextProps.currFloor, nextProps.currentBuilding);
      this.setState({
        isLoading: false
      });
    } 
    if (this.props.shortestPath.floors !== nextProps.shortestPath.floors) {
      this.props.change_floor(nextProps.shortestPath.floors[0], null)
      this.setState({
        currentPathFloorIndex: 0,
      })
    }

    if (this.props.shortestPath.data !== nextProps.shortestPath.data) {
      this.setState({
        isLoading: false,
      })
    }
  }

  async setCacheToSuggestionList(suggestionListStateName) {
    let suggestionCache = await AsyncStorage.getItem("suggestions");
    if (suggestionCache) {
      let suggestionCacheData = JSON.parse(suggestionCache).data;
      this.setState({
        [suggestionListStateName]: suggestionCacheData,
      });
    }
  }


  _onFocusSearchBar() {
      this.setCacheToSuggestionList('suggestionList');
  }

  _onFocusSearchDirectionBar(text, isFrom) {
    if (!text) {
      this.setCacheToSuggestionList(isFrom ? 'fromSuggestionList' :'toSuggestionList');
      this.setState({
        ...(isFrom ? {toSuggestionList : []} : {fromSuggestionList : []}),
      })
    }
  }

  _onChangeSearchText(text) {
    this.isInputting = true;
    this.setState({
      searchInput: text
    });
    if (text !== "" && text !== " ") {
      var nodes = api.nodes({ name: text }).data;
      this.isInputting = false;
      nodes.forEach(e => {
        e.buildingName = this._buildingnameToString(
          this.props.allFloors.find(floor => floor._id == e.floorId)[
            "buildingId"
          ]
        );
      });
      this.setState({
        suggestionList: nodes
      });
    } else {
      this.setCacheToSuggestionList();
    }
  }

  _onChangeDirectionSearchText(text, isFrom) {
    this.isInputting = true;
    this.setState({
      ...(isFrom ? {fromSearchInput: text} : {toSearchInput: text})
    });
    if (text !== "" && text !== " ") {
      var nodes = api.nodes({ name: text }).data;
      this.isInputting = false;
      nodes.forEach(e => {
        e.buildingName = this._buildingnameToString(
          this.props.allFloors.find(floor => floor._id == e.floorId)[
            "buildingId"
          ]
        );
      });
      this.setState({
        ...(isFrom ? {fromSuggestionList : nodes} : {toSuggestionList : nodes}),
      });
    } else {
      this.setCacheToSuggestionList(isFrom);
    }
  }

  _onChangeCurrentLocationText(text) {
    this.setState({
      currentLocation: text
    });
  }

  _onPressBackToSearch() {
    this.setState({
      toSuggestionList: [],
      fromSuggestionList: [],
      suggestionList: [],
      isFindDirection: false,
      toSearchInput : '',
      fromSearchInput : '',
      toNode: null,
      fromNode: null,
      searchInput: this.props.currentNode.name,
    });

    this.props.clear_path_state();
    if (this.props.previousNode) {
      this._onPressSuggestion(this.props.previousNode)
    }
  }

  _onPressSuggestion(node) {
    this.setState(
      {
        searchInput: node.name,
        suggestionList: []
      },
      this._searchRoom(node)
    );
  }

  _onPressDirectionSuggestion(node, isFrom) {
    this.setState(
      {
        ...(isFrom ? 
          {fromSearchInput: node.name, fromNode: node} 
          :
          {toSearchInput : node.name, toNode: node}
        ),
        fromSuggestionList: [],
        toSuggestionList: [],
      }
    );
  }

  _onPressDirectionLayout() {
    this.setState({
      isFindDirection: true,
      toSearchInput : this.props.currentNode.name,
      toNode: this.props.currentNode,
    })
    this.props.save_previous_node(this.props.currentNode);
  }

  _onPressSearchPath() {
    this._searchDirection();
  }

  _searchRoom(currentNode = null) {
    this.setState({
      isLoading: currentNode === this.props.currentNode ? false : true,
      suggestionList: [] // suggestion dropdown dismiss after search button press
    });
    Keyboard.dismiss();
    setTimeout(() => {
      // only setTimeout can make the Keyboard dismiss before the change node finished
      this.props.change_node(this.state.searchInput, currentNode);
    }, 100);
  }

  _searchDirection() {
    this.setState({
      isLoading: true,
      fromSuggestionList: [],
      toSuggestionList: [], // suggestion dropdown dismiss after search button press
    });
    Keyboard.dismiss();

    setTimeout(() => {
      this.props.change_node(this.state.fromSearchInput, this.state.fromNode);
      if (this.state.fromSearchInput && this.state.toSearchInput) {
        this.props.search_shortest_path(this.state.fromNode._id, this.state.toNode._id, true, false)  // TO DO: set the fromTo through user input
      }
    }, 1)
  }

  _resetCurrentSearchKeyword() {
    this.setState({
      currentSearchKeyword: "",
      currentLocation: ""
    });
  }

  //get all unique building name
  _getUniqueBuildingId(data) {
    let tempData = data.map(item => item.buildingId);
    let result = [];
    for (i = 0; i < tempData.length; i++) {
      if (!result.includes(tempData[i])) {
        result.push(tempData[i]);
      }
    }
    return result;
  }
  //Get all floor names in one building
  _getAllFloors(buildingId) {
    return this.props.allFloors.filter(item => item.buildingId === buildingId);
  }
  _buildingnameToString(name) {
    switch (name) {
      case "academicBuilding":
        return "Academic Building";
      case "cyt":
        return "CYT";
      case "ias":
        return "IAS";
      case "lsk":
        return "LSK";
      case "campusMap":
        return "Campus Map";
      case "universityCenter":
        return "University Center";
    }
  }

  _onPressPathPreviousFloor() {
    this.props.change_floor(this.props.shortestPath.floors[this.state.currentPathFloorIndex - 1], null)

    const nextCurrNode = this.props.shortestPath.data.find(node =>  node.floorId === this.props.shortestPath.floors[this.state.currentPathFloorIndex - 1])
    this.props.change_node(null, nextCurrNode) // change the current node to the starting point on the floor

    this.setState({
      currentPathFloorIndex: this.state.currentPathFloorIndex - 1,
    })
  }

  _onPressPathNextFloor() {
    this.props.change_floor(this.props.shortestPath.floors[this.state.currentPathFloorIndex + 1], null)

    const nextCurrNode = this.props.shortestPath.data.find(node =>  node.floorId === this.props.shortestPath.floors[this.state.currentPathFloorIndex + 1])
    this.props.change_node(null, nextCurrNode) // change the current node to the starting point on the floor

    this.setState({
      currentPathFloorIndex: this.state.currentPathFloorIndex + 1,
    })
  }

  _renderDrawer() {
    return (
      <View>
        <ScrollView>
          <Image source={require('../../asset/hkust_icon.png')} style={styles.ustBannerImage}></Image>
          <Text style={styles.drawerSubSection}>Buildings</Text>
          <View style={styles.lineStyle} />
          {this._allBuildings.map(item => (
            <View style={styles.drawerItems} key={item}>
              <View style={styles.buildingItems}>
                <Text
                  style={{ color: "#003366" }}
                  onPress={() => {
                    this.setState({
                      expandedFloorId:
                        this.state.expandedFloorId === item ? null : item
                    });
                  }}
                >
                  {this._buildingnameToString(item)}
                </Text>
                <Icon
                  name="arrow-dropdown"
                  style={styles.drawerItemsIcon}
                ></Icon>
              </View>
              {this.state.expandedFloorId === item
                ? this._getAllFloors(item).map(floor => {
                  floor_ID = null;
                  listToAddF = ['1','2','3','4','5','6','7','G']
                  style = Object.assign({}, item._id === this.props.currFloor ? styles.activeFloor : {}, styles.drawerSubItems)
                  if(listToAddF.includes(floor._id)) {
                    floor_ID = floor._id + '/F';
                  }
                  else {
                    floor_ID = floor._id;
                  }
                    return (
                      <Text
                        style={style}
                        key={floor._id}
                        onPress={() => {
                          if (item._id !== this.props.currFloor) {
                            setTimeout(() => {
                              // to let the menu close
                              this.props.render_loading_page();
                              this.props.change_floor(
                                floor._id,
                                floor.buildingId
                              );
                            }, 100);
                          }
                          this.drawer.closeDrawer();
                        }}
                      >
                        {floor_ID}
                      </Text>
                    );
                  })
                : null}
            </View>
          ))}

          <View style={styles.menuItem}>
            <Text 
              style={styles.drawerSubSection}
              onPress={() => Actions.EventListPage()}
            >
              Events
            </Text>
            <Icon type='Ionicons' name='ios-arrow-forward' style={styles.menuItemArrowRight}></Icon>
          </View>
        </ScrollView>
      </View>
    );
  }

  render() {
    const { 
      searchInput,
      fromSearchInput,
      toSearchInput, 
      currentSearchKeyword, 
      isLoading, 
      fromNode, 
      toNode, 
      currentPathFloorIndex,
      isFindDirection,
    } = this.state;

    floor_ID = null;
    listToAddF = ['1','2','3','4','5','6','7','G']

    if(listToAddF.includes(this.props.currFloor)) {
      floor_ID = this.props.currFloor + '/F';
    }
    else {
      floor_ID = this.props.currFloor;
    }

    var suggestions = this.state.suggestionList.map((node, index) => {
      return (
        <TouchableOpacity
          onPress={() => this._onPressSuggestion(node)}
          style={{ backgroundColor: "white" }}
          key={index}
        >
          <Text style={{ padding: 10 }}>
            {node.name}, {node.floorId}, {node.buildingName}
          </Text>
        </TouchableOpacity>
      );
    });

    var fromSuggestions = this.state.fromSuggestionList.map((node, index) => {
      return (
        <TouchableOpacity
          onPress={() => this._onPressDirectionSuggestion(node, true)}
          style={{ backgroundColor: "white" }}
          key={index}
        >
          <Text style={{ padding: 10 }}>
            {node.name}, {node.floorId}, {node.buildingName}
          </Text>
        </TouchableOpacity>
      );
    });

    var toSuggestions = this.state.toSuggestionList.map((node, index) => {
      return (
        <TouchableOpacity
          onPress={() => this._onPressDirectionSuggestion(node, false)}
          style={{ backgroundColor: "white" }}
          key={index}
        >
          <Text style={{ padding: 10 }}>
            {node.name}, {node.floorId}, {node.buildingName}
          </Text>
        </TouchableOpacity>
      );
    });

    return (
      <DrawerLayout
        ref={drawer => {
          this.drawer = drawer;
        }}
        drawerWidth={width / 2 }
        drawerPosition={DrawerLayout.positions.Left}
        drawerType="front"
        drawerBackgroundColor="#FFFFFF"
        renderNavigationView={this._renderDrawer}
      >
        <Container>
          <LoadingPage text="Loading..." style={Platform.OS === 'android' ? {} : {position: 'relative'}} >
            {!isFindDirection && [
              <Item
                key={0}
                rounded
                style={{
                  backgroundColor: "white",
                  borderColor: "#BCE0FD",
                  borderWidth: 2,
                  marginTop: 10,
                  marginLeft: 5,
                  marginRight: 5,
                  zIndex: 999
                }}
                >
                <Icon
                  active
                  name="md-menu"
                  style={{ color: "#003366" }}
                  onPress={() => this.drawer.openDrawer()}
                ></Icon>
                <Input
                  placeholder="Where are you going?"
                  placeholderTextColor="#003366"
                  fontSize={17}
                  onChangeText={input => this._onChangeSearchText(input)}
                  onFocus={() => this._onFocusSearchBar()}
                  style={{
                    backgroundColor: "white",
                    borderColor: "transparent",
                    borderWidth: 1,
                    backgroundColor: "transparent",
                    borderRadius: 10,
                    height: 48,
                    padding: 10
                  }}
                  value={searchInput}
                />
                <Icon active name="search" style={{ color: "#003366" }}></Icon>
              </Item>
              ,
              <View key={1} style={Platform.OS === 'android' ? { maxHeight: 200} : {maxHeight: 200, position: 'absolute', zIndex:1, top: 50}}>
                <ScrollView
                  keyboardShouldPersistTaps="always"
                  style={{
                    zIndex: 2,
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 10
                  }}
                >
                  {suggestions}
                </ScrollView>
              </View>
            ]}
            {isFindDirection && [
              <Item
                key={0}
                rounded
                style={{
                  backgroundColor: "white",
                  borderColor: "#BCE0FD",
                  borderWidth: 2,
                  marginTop: 10,
                  marginLeft: 5,
                  marginRight: 5,
                  zIndex: 999
                }}
              >
                <Icon
                  active
                  name="md-menu"
                  style={{ color: "#003366", fontSize: 20}}
                  onPress={() => this.drawer.openDrawer()}
                ></Icon>
                <Input
                  placeholder="From"
                  placeholderTextColor="#003366"
                  fontSize={17}
                  onChangeText={input => this._onChangeDirectionSearchText(input, true)}
                  onFocus={() => this._onFocusSearchDirectionBar(true)}
                  style={{
                    backgroundColor: "white",
                    borderColor: "transparent",
                    borderWidth: 1,
                    backgroundColor: "transparent",
                    borderRadius: 10,
                    height: 48,
                    padding: 10
                  }}
                  value={fromSearchInput}
                />
                <TouchableHighlight style={styles.backToSearchBtn} onPress={()=> this._onPressBackToSearch()} underlayColor="#428bca">
                  <Text style={styles.backToSearchBtnText}>Back to Search</Text>
                </TouchableHighlight>
              </Item>
              ,
              <View key={1} style={Platform.OS === 'android' ? { maxHeight: 200} : {maxHeight: 200, position: 'absolute', zIndex:1000, top: 50}}>
                <ScrollView
                  keyboardShouldPersistTaps="always"
                  style={{
                    zIndex: 2,
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 10
                  }}
                >
                  {fromSuggestions}
                </ScrollView>
              </View>
              ,
              <Item
                key={2}
                rounded
                style={{
                  backgroundColor: "white",
                  borderColor: "#BCE0FD",
                  borderWidth: 2,
                  marginTop: 10,
                  marginLeft: 5,
                  marginRight: 5,
                  zIndex: 999
                }}
              >
                <Input
                  placeholder="To"
                  placeholderTextColor="#003366"
                  fontSize={17}
                  onChangeText={input => this._onChangeDirectionSearchText(input, false)}
                  onFocus={() => this._onFocusSearchDirectionBar(false)}
                  style={{
                    backgroundColor: "white",
                    borderColor: "transparent",
                    borderWidth: 1,
                    backgroundColor: "transparent",
                    borderRadius: 10,
                    height: 48,
                    padding: 10,
                    paddingLeft: 40,
                  }}
                  value={toSearchInput}
                />
                {fromNode && toNode &&
                  <TouchableHighlight onPress={()=> this._onPressSearchPath()} underlayColor="white">
                    <Icon active name="search" style={{ color: "#003366" }}></Icon>
                  </TouchableHighlight>
                }
              </Item>
              ,
              <View key={3} style={Platform.OS === 'android' ? { maxHeight: 200} : {maxHeight: 200, position: 'absolute', zIndex:1000, top: 100}}>
                <ScrollView
                  keyboardShouldPersistTaps="always"
                  style={{
                    zIndex: 2,
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 10
                  }}
                >
                  {toSuggestions}
                </ScrollView>
              </View>
            ]}
            <MapTiles
              onCloseSuggestionList={() =>
                this.setState({ fromSuggestionList: [], toSuggestionList: [] })
              }
              isKeyBoardShown={this.state.isKeyBoardShown}
              isSuggestionListOpen={this.state.fromSuggestionList.length > 0 || this.state.toSuggestionList.length > 0}
              searchKeyword={this.state.currentSearchKeyword}
              resetCurrentSearchKeyword={() =>
                this._resetCurrentSearchKeyword()
              }
            ></MapTiles>
            
            {!isFindDirection && this.props.currentNode &&
              <View
                style={styles.roomDetailBox}
                >
                <Text style={styles.roomName}>{this.props.currentNode.name}</Text>
                <Text style={styles.roomFloor}>{`${this._buildingnameToString(this.props.currBuilding)} - ${floor_ID}`}</Text>
                <TouchableHighlight style={styles.directionBtn} onPress={()=> this._onPressDirectionLayout()} underlayColor="#428bca">
                  <Text style={styles.directionBtnText}>Direction</Text>
                </TouchableHighlight>
              </View>
            }
            <View>
              <Text
                style={{
                  padding: 5,
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#003366"
                }}
              >
                {this._buildingnameToString(this.props.currBuilding)} -{" "}
                {floor_ID}
              </Text>
            </View>
            <View
              style={styles.pathFloorControlContainer}
              >
              {this.props.shortestPath.floors.length > 0 && currentPathFloorIndex > 0 &&
                <TouchableHighlight
                  style={styles.pathFloorLeftBtn}
                  onPress={() => this._onPressPathPreviousFloor()}
                >
                  <Icon
                  reverse
                  name="ios-arrow-back"
                  style={{fontSize: 20}}
                  reverseColor='white'></Icon>
                </TouchableHighlight>
              }
              {this.props.shortestPath.floors.length > 0 && currentPathFloorIndex + 1 < this.props.shortestPath.floors.length &&
                <TouchableHighlight
                  style={styles.pathFloorRightBtn}
                  onPress={() => this._onPressPathNextFloor()}
                  >
                  <Icon
                  reverse
                  name="ios-arrow-forward"
                  style={{fontSize: 20}}
                  reverseColor="white"></Icon>
                </TouchableHighlight>
              }
            </View>
            {isLoading &&
              <View
                style={{flex: 1, 
                        top: 0, 
                        left: 0, 
                        width: '100%',
                        height: '100%',
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 100,
                        position: "absolute",
                        }}>
                <ActivityIndicator size="large" color="#0000ff" ></ActivityIndicator>
              </View>
            }
          </LoadingPage>
        </Container>
      </DrawerLayout>
    );
  }
}

function mapStateToProps(state) {
  return {
    currFloor: state.floorReducer.currentFloor._id,
    currBuilding: state.floorReducer.currentFloor.buildingId,
    allFloors: state.floorReducer.data,
    zoomLevel: 0,
    currentNode: state.floorReducer.currentNode,
    currentBuilding: state.floorReducer.currentBuilding,
    shortestPath: state.pathReducer,
    previousFloor: state.floorReducer.previousFloor,
    previousNode: state.floorReducer.previousNode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    change_floor: (floor, buildingId) =>
      dispatch({
        type: CHANGE_FLOOR,
        payload: { floor: floor, buildingId: buildingId }
      }),
    change_building: floor =>
      dispatch({ type: CHANGE_BUILDING, payload: { buildingId: floor } }),
    change_node: (name, currentNode = null) =>
      dispatch({
        type: CHANGE_NODE,
        payload: { name: name, currentNode: currentNode }
      }),
    search_shortest_path: (fromId, toId, noStairCase, noEscalator) =>{
      dispatch({
        type: UPDATE_PATH,
        payload: { fromId: fromId, toId: toId, noStairCase: noStairCase, noEscalator: noEscalator}
      })},
    clear_path_state: () => {
      dispatch({
        type: CLEAR_PATH_STATE,
        payload: {}
      })
    },
    save_previous_node: (node) => {
      dispatch({
        type: SAVE_PREVIOUS_NODE,
        payload: {node: node}
      })
    },
    render_loading_page: () =>
      dispatch({ type: RENDER_LOADING_PAGE, payload: true })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  page: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    paddingTop: 40,
    backgroundColor: "white"
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: "black",
    marginLeft: 20,
    marginRight: 20
  },
  drawerSubSection: {
    fontSize: 20,
    padding: 5,
    color: "#003366",
    fontWeight: "bold"
  },
  drawerItems: {
    backgroundColor: "white",
    color: "#003366",
    paddingLeft: 10,
    padding: 5,
    width: "100%"
  },
  buildingItems: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  drawerItemsIcon: {},
  drawerSubItems: {
    backgroundColor: "white",
    color: "#003366",
    marginLeft: 30,
    padding: 5,
    width: "100%"
  },
  activeFloor: {
    color: "#BCE0FD"
  },
  pathFloorControlContainer: {
    position: "absolute",
    width: 100,
    zIndex: 1000,
    right: 10,
    bottom: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  pathFloorLeftBtn: { 
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white", 
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: "auto",

  },
  pathFloorRightBtn: { 
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white", 
    marginRight: "auto",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginLeft: "auto",

  },
  ustBannerImage: {
    width: width / 2 - 10,
    height: 75,
    padding: 3,
    resizeMode: 'contain'
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 5
  },
  menuItemArrowRight: {
  },

  roomDetailBox: {
    backgroundColor: "white",
    width: "95%",
    alignSelf: "center",
    margin: 5,
    height: 150,
    borderRadius: 20,
    padding: 20,
  },

  roomName: {
    fontSize: 20,
    color: "#003366",
    // paddingBottom: 10,
  },
  roomFloor: {
    fontSize: 16,
    color: "#003366",
  },
  directionBtn: {
    backgroundColor: "#428bca",
    paddingTop: 5,
    paddingLeft: 5,
    paddingBottom: 5,
    paddingRight: 5,
    borderRadius: 12,
    width: 100,
    marginTop: 'auto',
  },
  directionBtnText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  backToSearchBtn: {
    backgroundColor: "#428bca",
    borderRadius: 12,
    padding: 5,
    width: 100,
    marginRight: 10,
  },
  backToSearchBtnText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
});
