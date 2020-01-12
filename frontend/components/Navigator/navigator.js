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
      suggestionList: [],
      currentNode: null,
      expandedFloorId: null
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
  }

  async setCacheToSuggestionList() {
    let suggestionCache = await AsyncStorage.getItem("suggestions");
    if (suggestionCache) {
      let suggestionCacheData = JSON.parse(suggestionCache).data;
      this.setState({
        suggestionList: suggestionCacheData
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

  _onChangeCurrentLocationText(text) {
    this.setState({
      currentLocation: text
    });
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

  _searchRoom(currentNode = null) {
    this.setState({
      isLoading: true,
      suggestionList: [] // suggestion dropdown dismiss after search button press
    });
    Keyboard.dismiss();
    setTimeout(() => {
      // only setTimeout can make the Keyboard dismiss before the change node finished
      this.props.change_node(this.state.searchInput, currentNode);
      this.props.search_shortest_path('eYfKbAeafgj', currentNode._id, true, false)  // TO DO: set the fromTo through user input
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
    const { searchInput, currentSearchKeyword, isLoading } = this.state;

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
            <View style={Platform.OS === 'android' ? { maxHeight: 200} : {maxHeight: 200, position: 'absolute', zIndex:1, top: 50}}>
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
            <MapTiles
              onCloseSuggestionList={() =>
                this.setState({ suggestionList: [] })
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
    currentBuilding: state.floorReducer.currentBuilding
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
  }
});
