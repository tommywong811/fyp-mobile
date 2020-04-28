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
    }


    render() {
        return(
            <View style={styles.container_temp}>
                <PanoramaView
                    style={styles.viewer}
                    dimensions={{ height: Dimensions.get('window').height, width: Dimensions.get("window").width }}
                    inputType="mono"
                    imageUrl="http://klor.student.ust.hk/image/panorama_sample.jpg"
                />
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
  