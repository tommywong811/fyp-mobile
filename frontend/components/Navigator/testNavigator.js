import React from 'react';
import { connect } from 'react-redux';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import {  
    Text, 
    View, 
    StyleSheet,
    Dimensions,
    ScrollView,
} from 'react-native';
import { 
    CHANGE_FLOOR, 
    CHANGE_BUILDING
} from '../../reducer/floors/actionList';
import { Button } from 'native-base';
const {width} = Dimensions.get('window');

/**
 * childrenView: 
 */
class Navigator extends React.Component{

    constructor(props){
        super(props);
        this._renderDrawer = this._renderDrawer.bind(this);
        this._allBuildings = this._getUniqueBuildingId(this.props.allFloors);
        this._getAllFloors = this._getAllFloors.bind(this);
        //console.log(this.props);
        this.state = {
            allFloorIds : this._getAllFloors()
        }
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
            case 'cyt': return 'Academic Building';
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
                    <View style={{position:'absolute',zIndex:1}}>
                        <Text>Move</Text>
                    </View>
                    {this.props.children}
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
      }, text1:{
          
      } 
})