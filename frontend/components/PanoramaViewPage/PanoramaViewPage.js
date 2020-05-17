import React from 'react';
import { Item, Label, Picker } from 'native-base';
import axios from 'axios';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { PanoramaView } from "@lightbase/react-native-panorama-view";
/**
 * childrenView:
 */

export default class PanoramaViewPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          imageUrl: ""
        }
    }

    componentDidMount() {
        var url = "http://ec2-52-220-86-136.ap-southeast-1.compute.amazonaws.com:3001/pano/floors/"
        + this.props.floorId
        + "/node?nearCoordinates=" +
        this.props.nodeCoord[0] + "," + this.props.nodeCoord[1]
        fetch(url, {
          headers: {
            Accept: 'application/json'
          }
        }).then((response) => response.json())
        .then((json) => {
         if(json.data) {
           this.setState({imageUrl: json.data.panoImageUrl})
         } else {
           this.setState({imageUrl: ""})
         }
        })
    }

    render() {
        return(
            <View style={styles.container_temp}>
            { this.state.imageUrl !== "" &&
                <PanoramaView
                    style={styles.viewer}
                    dimensions={{ height: Dimensions.get('window').height, width: Dimensions.get("window").width }}
                    inputType="mono"
                    imageUrl={this.state.imageUrl}
                />
            }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    viewer: {
        height: Dimensions.get('window').height
    }
})
