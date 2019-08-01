import React from 'react';
import { 
    Button, 
    Text, 
    View, 
    StyleSheet,
    Dimensions,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { 
    CHANGE_FLOOR, 
    CHANGE_BUILDING
} from '../../reducer/floors/actionList';

const {width, height} = Dimensions.get('window');

class Navigator extends React.Component{

    constructor(props){
        super(props);
        this.onPressHandler = this.onPressHandler.bind(this);
        this._renderDrawer = this._renderDrawer.bind(this);
        this._allBuildings = this._getUniqueBuildingId(this.props.allFloors);
        this._getAllFloors = this._getAllFloors.bind(this);
        console.log(this.props);
        console.log(this.props.allFloors);
        this.state = {
            allFloorIds : this._getAllFloors()
        }
    }

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

    _getAllFloors(){
        return this.props.allFloors.filter((item) => item.buildingId === this.props.currBuilding)
    }

    _renderDrawer(){
        return(
            <View>
                <ScrollView scrollEventThrottle={16}>
                <Text h1>Buildings</Text>
                <View style={styles.lineStyle} />
                {this._allBuildings.map(item => 
                    <Button
                        key={item}
                        title={item}
                        onPress={()=>{
                            if(item !== this.props.currBuilding){
                                this.props.change_building(item);
                            }
                        }}
                    >
                    </Button>)}
                <View style={styles.lineStyle} />
                <Text h2>Floors</Text>
                {this._getAllFloors().map(item => 
                    <Button
                        key={item._id}
                        title={item._id}
                        onPress={()=>{
                            if(item._id !== this.props.currFloor){
                                this.props.change_floor(item._id, item.buildingId);
                            }
                        }}    
                    >
                    </Button>)
                }
                </ScrollView>
            </View>
        );
    }

    onPressHandler(){
        
        this.props.change_floor();
        console.log(this.props);
    }

    render(){
        return(
            <View style={{flex: 1, zIndex: 1}}>
                <DrawerLayout
                    ref={drawer => {this.drawer=drawer}}
                    drawerWidth={width * 2 / 3}
                    drawerPosition={DrawerLayout.positions.Left}
                    drawerType='front'
                    drawerBackgroundColor="#ddd"
                    renderNavigationView={this._renderDrawer}
                >
                    <View>
                        <Text>
                            {`${this.props.currBuilding}   ${this.props.currFloor}`}
                        </Text>
                    </View>
                </DrawerLayout>
            </View>
        );
    }
}


function mapStateToProps(state){
    return {
        offSetX: state.floorReducer.currentFloor.startX,
        offSetY: state.floorReducer.currentFloor.startY,
        width: state.floorReducer.currentFloor.mapWidth,
        height: state.floorReducer.currentFloor.mapHeight,
        currFloor: state.floorReducer.currentFloor._id,
        currBuilding: state.floorReducer.currentFloor.buildingId,
        allFloors: state.floorReducer.data,
        zoomLevel: 0
    };
}

function mapDispatchToProps(dispatch){
    return {
        change_floor: (floor, buildingId) => 
            dispatch({type: CHANGE_FLOOR, payload: {floor: floor, buildingId: buildingId}}),
        change_building: (floor) => dispatch({type: CHANGE_BUILDING, payload: {buildingId: floor}})
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
})