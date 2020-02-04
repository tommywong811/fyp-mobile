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
} from "react-native";
import {
  CHANGE_FLOOR,
  CHANGE_BUILDING,
  CHANGE_NODE,
  RENDER_LOADING_PAGE
} from "../../reducer/floors/actionList";
import {UPDATE_PATH} from "../../reducer/path/actionList";
import {
  Button,
  Container,
  Content,
  Text,
  Input,
  Item,
  Icon
} from "native-base";
import MapTiles from "../mapTiles/MapTiles";
const { width } = Dimensions.get("window");
import * as Base from "native-base";
import { api } from "../../../backend";
import realm from "../../../backend/Realm/realm";
import { searchShortestPath } from "../../../backend/api/search/searchShortestPath";
import _ from "lodash";

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
      currentSearchKeyword: "",
      currentLocation: "",
      isLoading: false,
      fromSuggestionList: [],
      toSuggestionList: [],
      currentNode: null,
      fromNode: null, 
      toNode: null,
      floorInPath: null,
      expandedFloorId: null,
      currentPathFloorIndex: null,
    });
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
  }

  async setCacheToSuggestionList(isFrom) {
    let suggestionCache = await AsyncStorage.getItem("suggestions");
    if (suggestionCache) {
      let suggestionCacheData = JSON.parse(suggestionCache).data;
      this.setState({
        ...(isFrom ? {fromSuggestionList : suggestionCacheData} : {toSuggestionList : suggestionCacheData}),
      });
    }
  }

  _onFocusSearchBar(text, isFrom) {
    if (!text) {
      this.setCacheToSuggestionList(isFrom);
      this.setState({
        ...(isFrom ? {toSuggestionList : []} : {fromSuggestionList : []}),
      })
    }
  }

  _onChangeSearchText(text, isFrom) {
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

  _onPressSuggestion(node, isFrom) {
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

  _onPressSearchPath() {
    this._searchRoom();
  }

  _searchRoom() {
    this.setState({
      isLoading: true,
      fromSuggestionList: [],
      toSuggestionList: [], // suggestion dropdown dismiss after search button press
    });
    Keyboard.dismiss();
    setTimeout(() => {
      // only setTimeout can make the Keyboard dismiss before the change node finished
      this.props.change_node(this.state.fromSearchInput, this.state.fromNode);
      if (this.state.fromSearchInput && this.state.toSearchInput) {
        this.props.search_shortest_path(this.state.fromNode._id, this.state.toNode._id, true, false)  // TO DO: set the fromTo through user input
      }
    }, 100);
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

                  if(listToAddF.includes(floor._id)) {
                    floor_ID = floor._id + '/F';
                  }
                  else {
                    floor_ID = floor._id;
                  }
                    return (
                      <Text
                        style={styles.drawerSubItems}
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
        </ScrollView>
      </View>
    );
  }

  render() {
    const { fromSearchInput, toSearchInput, currentSearchKeyword, isLoading, fromNode, toNode, currentPathFloorIndex } = this.state;

    floor_ID = null;
    listToAddF = ['1','2','3','4','5','6','7','G']

    if(listToAddF.includes(this.props.currFloor)) {
      floor_ID = this.props.currFloor + '/F';
    }
    else {
      floor_ID = this.props.currFloor;
    }

    var fromSuggestions = this.state.fromSuggestionList.map((node, index) => {
      return (
        <TouchableOpacity
          onPress={() => this._onPressSuggestion(node, true)}
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
          onPress={() => this._onPressSuggestion(node, false)}
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
        drawerWidth={(width * 1) / 2}
        drawerPosition={DrawerLayout.positions.Left}
        drawerType="front"
        drawerBackgroundColor="#FFFFFF"
        renderNavigationView={this._renderDrawer}
      >
        <Container>
          <LoadingPage text="Loading..." style={Platform.OS === 'android' ? {} : {position: 'relative'}} >
            <Item
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
                onChangeText={input => this._onChangeSearchText(input, true)}
                onFocus={() => this._onFocusSearchBar(true)}
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
            </Item>
            <View style={Platform.OS === 'android' ? { maxHeight: 200} : {maxHeight: 200, position: 'absolute', zIndex:1000, top: 50}}>
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
            <Item
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
                onChangeText={input => this._onChangeSearchText(input, false)}
                onFocus={() => this._onFocusSearchBar(false)}
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
            <View style={Platform.OS === 'android' ? { maxHeight: 200} : {maxHeight: 200, position: 'absolute', zIndex:1000, top: 100}}>
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
            <MapTiles
              onCloseSuggestionList={() =>
                this.setState({ fromSuggestionList: [], toSuggestionList: [] })
              }
              searchKeyword={this.state.currentSearchKeyword}
              resetCurrentSearchKeyword={() =>
                this._resetCurrentSearchKeyword()
              }
            ></MapTiles>

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
    padding: 9,
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
    marginLeft: 51,
    padding: 9,
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
    color: "#003366",
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
    color: "#003366",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white", 
    marginRight: "auto",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginLeft: "auto",

  }
});
