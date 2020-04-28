import React from 'react';
import { connect } from 'react-redux';
import { db, api } from '../../../backend';
import * as Progress from 'react-native-progress';
import {SafeAreaView} from 'react-native';
import {
    Image,
    View,
    Text,
    ActivityIndicator,
} from 'react-native';
import {LOGO_IMAGE} from '../constant'
import Navigator from '../Navigator/navigator';
import { UPDATE_FLOOR_DATA, UPDATE_CURRENT_FLOOR } from '../../reducer/floors/actionList';
import { UPDATE_NODE_DATA } from '../../reducer/nodes/actionList'
import { createDB } from '../../../backend/Realm/realm';
import buildGraph from "../../../backend/api/graph/build";
import graphCache from "../../../backend/api/graph/cache";
import Store from 'react-native-fs-store';

class ProgressBar extends React.Component{
    constructor(props){
        super(props);
        this._renderProgress = this._renderProgress.bind(this);
        this._addProgressHandler = this._addProgressHandler.bind(this);
        try{api.meta(); 
            this.state = {
                finished: true,
                written: 0,
                total: 1,
            }}
        catch(error){
            this.state = {
                finished: false,
                written: 0,
                total: 1,
            }
        }
    }

    _addProgressHandler(written, total){
        this.setState({
            // finished: Number(written) >= Number(total) ? true : false,
            written: written,
            total: total
        })
    }

    async componentDidMount(){
        const sleep = () => new Promise(resolve => setTimeout(resolve, 50))  // to allow load spinner render first
        await sleep();
        try{
            api.meta()
        }
        catch(error){
            await createDB()
            this.props.update_floor_data(api.floors().data)
            this.props.update_current_floor(api.floors().data[0])
            this.props.update_node_data(api.nodes().data)
            this.setState({ finished: true })
        }

        try {
            const AsyncStorage = new Store('graphStore');
            let cachedGraphCache = await AsyncStorage.getItem('cachedGraphCache');
            if (!cachedGraphCache) { // prebuild graph for searching path
                graphCache.data = buildGraph()
                await AsyncStorage.setItem('cachedGraphCache', JSON.stringify(graphCache));
            } else {
                graphCache.data = JSON.parse(cachedGraphCache).data ;
            }
        } catch (error) {
            console.log('GraphDataGraph Error', error)
        }
    }

    _renderProgress(){
        if(!this.state.finished){
            return( 
                <SafeAreaView style={{flex: 1}}>
                    <View style={{flex: 6, zIndex:1, flexDirection: 'column', backgroundColor: '#003366', justifyContent:'center', alignItems:'center'}}>
                        {/* <Image style={{width: 100, height: 100, marginBottom: 20}} source={LOGO_IMAGE}></Image> */}
                        <ActivityIndicator size="large" color="#c9e6ff"></ActivityIndicator>
                        {/* <Progress.Circle progress={this.state.written/this.state.total} endAndgle={1} size={60}
                            showsText={true}
                            style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#5e9cff'}}
                            textStyle={{justifyContent: 'center', alignItems: 'center'}}/> */}
                        <Text style={{color: 'white', fontSize: 14, marginTop: 10}}>{'Please wait, initializing data...'}</Text>
                    </View> 
                </SafeAreaView>
            );
        } else{
            return (
                <SafeAreaView style={{flex: 1}}>
                    <Navigator>
                    </Navigator>
                </SafeAreaView>
            );
        }
    }

    render(){
        return this._renderProgress();
    }
}

function mapDispatchToProps(dispatch) {
    return {
        update_floor_data: (data) => 
            dispatch({type: UPDATE_FLOOR_DATA, payload: {data: data}}),
        update_current_floor: (currentFloor) => 
            dispatch({type: UPDATE_CURRENT_FLOOR, payload: {currentFloor: currentFloor}}),
        update_node_data: (data) =>
            dispatch({type: UPDATE_NODE_DATA, payload: {data:data}})
    };
}

export default connect(null, mapDispatchToProps)(ProgressBar);