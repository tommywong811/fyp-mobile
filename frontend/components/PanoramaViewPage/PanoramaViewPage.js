import React from 'react';
import { Item, Label, Picker } from 'native-base';
import axios from 'axios';
import { View, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { PanoramaView } from "@lightbase/react-native-panorama-view";
import ImageZoom from 'react-native-image-pan-zoom';

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

    renderViewer() {
      if(this.state.imageUrl !== "") {
        if( Platform.OS === 'ios') {
          return (
            <ImageZoom
                cropWidth={Dimensions.get('window').width}
                cropHeight={Dimensions.get('window').height}
                imageHeight={Dimensions.get('window').height * 5}
                imageWidth={Dimensions.get('window').width * 6}
                minScale={5}
                maxScale={100}
            >
                <Image style={styles.staticViewer} source={{uri: this.state.imageUrl}}/>
            </ImageZoom>
          )
        } else {
          return (
            <PanoramaView
                style={styles.viewer}
                dimensions={{ height: Dimensions.get('window').height, width: Dimensions.get("window").width }}
                inputType="mono"
                imageUrl={this.state.imageUrl}
            />
          )
        }
      } else {
        return null
      }
    }

    render() {
        return(
            <View style={styles.container_temp}>
              {this.renderViewer()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    staticViewer: {
      height: Dimensions.get('window').height * 5,
      width: Dimensions.get('window').width * 6,
      resizeMode: 'contain'
    },
    viewer: {
      height: Dimensions.get('window').height,
    }
})
