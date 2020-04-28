import React from 'react';
import {View,Modal, Text} from 'react-native';

export default class Administration extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        }
    }

    render(){
        return(
            <View>
                <Text>360 Camera</Text>
            </View>
        )
    }
}
