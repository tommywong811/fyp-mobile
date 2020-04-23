import React from 'react';
import { Item, Label, Picker } from 'native-base';
import axios from 'axios';
import { View, StyleSheet, Image } from 'react-native';
/**
 * childrenView: 
 */

const BARN_A_GENERAL_AREA_URL = 'http://itsc.ust.hk/apps/realcam/barna_g1_000M.jpg';
const BARN_A_TEACHING_AREA_URL = 'http://itsc.ust.hk/apps/realcam/barna_t1_000M.jpg';
const BARN_B_FAR_END_1_URL = 'http://itsc.ust.hk/apps/realcam/barnb_1_000M.jpg';
const BARN_B_FAR_END_2_URL = 'http://itsc.ust.hk/apps/realcam/barnb_2_000M.jpg';
const BARN_C_GENERAL_AREA_URL = 'http://itsc.ust.hk/apps/realcam/barnc_g1_000M.jpg';
const BARN_C_TEACHING_AREA_URL = 'http://itsc.ust.hk/apps/realcam/barnc_t1_000M.jpg';


export default class BarnHeatMapPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectBarn: 'a',
            selectedBarnUrl_a: BARN_A_GENERAL_AREA_URL,
            selectedBarnUrl_b: BARN_A_TEACHING_AREA_URL
        }
        this.selectBarn = this.selectBarn.bind(this)
    }

    async componentWillMount() {
        
    }

    selectBarn(value) {
        this.setState({selectBarn: value})
        switch(value) {
            case 'a':
                this.setState({
                    selectedBarnUrl_a: BARN_A_GENERAL_AREA_URL,
                    selectedBarnUrl_b: BARN_A_TEACHING_AREA_URL
                })
                break;
            case 'b':
                this.setState({
                    selectedBarnUrl_a: BARN_B_FAR_END_1_URL,
                    selectedBarnUrl_b: BARN_B_FAR_END_2_URL
                })
                break;
            case 'c':
                this.setState({
                    selectedBarnUrl_a: BARN_C_GENERAL_AREA_URL,
                    selectedBarnUrl_b: BARN_C_TEACHING_AREA_URL
                })
                break;
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <Item fixedLabel>
                    <Label>Barn:</Label>
                    <Picker
                        mode="dropdown"
                        selectedValue={this.state.selectBarn}
                        placeholder="Select Barn"
                        onValueChange={this.selectBarn}
                    >
                        <Picker.Item label='Barn A' value='a' key='a'></Picker.Item>
                        <Picker.Item label='Barn B' value='b' key='b'></Picker.Item>
                        <Picker.Item label='Barn C' value='c' key='c'></Picker.Item>
                    </Picker>
                </Item>

                <View style={styles.imageContainer}>
                    <Image source={{uri: this.state.selectedBarnUrl_a}} resizeMode='contain' style={styles.barnImage}></Image>
                </View>

                <View style={styles.imageContainer}>
                    <Image source={{uri: this.state.selectedBarnUrl_b}} resizeMode='contain' style={styles.barnImage}></Image>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column"
    },
    imageContainer: {
        padding: 10,
    },
    barnImage: {
        width: 300,
        height: 200,
        alignSelf: 'center'
    }
})
  