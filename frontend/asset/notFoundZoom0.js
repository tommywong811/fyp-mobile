import React from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet
} from 'react-native';
const { width } = Dimensions.get('screen');

export default () => {
    return(
        <View style={styles.boxView}>
            <Text style={styles.text}>Not Found</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    boxView:{
        width: width/3, 
        height: width/3, 
        backgroundColor: 'blanchedalmond'
    }
})