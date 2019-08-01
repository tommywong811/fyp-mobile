import React from 'react';
import { 
    Button, 
    Text, 
    View, 
    StyleSheet,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { CHANGE_FLOOR } from '../../reducer/floors/actionList';

const {width, height} = Dimensions.get('window');

class Navigator extends React.Component{

    constructor(props){
        super(props);
        this.onPressHandler = this.onPressHandler.bind(this);
        this._renderDrawer = this._renderDrawer.bind(this);
        this._allBuildings = this._getUniqueBuildingId(this.props.allFloors)
        console.log(this.props);
        console.log(CHANGE_FLOOR);
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


    _renderDrawer(){
        /*return(
            <View>
                <Text h1>Buildings</Text>
                <View style={styles.lineStyle} />
                {this._allBuildings.map(item => 
                    <RetriveableButton
                        key={item}
                        name={item}
                    >
                    </RetriveableButton>)}
                <View style={styles.lineStyle} />
                <Text h2>Floors</Text>
            </View>
        );*/
        return(
            <View>
                <Text h1>Buildings</Text>
                <View style={styles.lineStyle} />
                {this._allBuildings.map(item => 
                    <Button
                        key={item}
                        title={item}
                        onPress={()=>{
                            if(item !== this.props.currBuilding){
                                //console.log('make some change');
                                this.props.change_floor(item);
                                console.log(this.props);
                            }
                        }}
                    >
                    </Button>)}
                <View style={styles.lineStyle} />
                <Text h2>Floors</Text>
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
                            {this.props.currBuilding}
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
        change_floor: (floor) => dispatch({type: CHANGE_FLOOR, payload: {buildingId: floor}})
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