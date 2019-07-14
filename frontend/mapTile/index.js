import {Image, View, StyleSheet, Text, Platform} from 'react-native';
import React from 'react';
import {api} from '../../backend';
import RNFetchBlob from 'rn-fetch-blob';
import shorthash from 'shorthash';
import { isNumericLiteral } from '@babel/types';
import RNFS from 'react-native-fs';

class MapTile extends React.Component {
    state = {
        floorId: null,
        X: null,
        Y: null,
        zoomLevel: 0,
        uri: null,
        source: null
    }
    constructor(props){
        super(props);
        this.state.floorId = props.floorId,
        this.state.X = props.X;
        this.state.Y = props.Y;
        this.state.zoomLevel = props.zoomLevel;
        this.state.uri = api.mapTiles({
            floorId: this.state.floorId,
            x: this.state.X,
            y: this.state.Y,
            zoomLevel: this.state.zoomLevel
        });
        const extension = (Platform.OS === 'android') ? 'file://' : '';
        const path = `${extension}${this.state.uri}`;
        this.state.uri = path;
    }

    componentDidMount(){
    }
    render(){
        return (
            <View style={styles.container}>
                <Text>Hello</Text>
                <Image style={{width:300, height:300}} source={{uri: this.state.uri}} />
            </View>);
    }
}

export default MapTile; 

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });