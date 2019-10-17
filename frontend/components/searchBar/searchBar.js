import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Button} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

type Props = {};
export default class SearchBar extends Component<Props> {

    render() {
        return (
            // <View style={styles.container}>
            //     {/* <Icon name='md-menu' size={30} /> */}
            //     <Text style={styles.instructions}>To get started, edit App.js</Text>
            //     <Text style={styles.instructions}>{instructions}</Text>
            //     <Button title='press me!!' />
            //     <Text>Hello World!</Text>
            //     <Text style={{color: 'red', fontSize: 40}}>Welcome to HKUST!!</Text>
            //     <Text style={{color: 'orange', fontSize: 40}}>Nice to meet you here! :-)</Text>
            //     <Text>Testing now!!!!!!!!!!!!!!</Text>
            // </View>
            //{<View style={{flexDirection: 'row', marginHorizontal: 20, marginVertical: 10}}>}
                <TextInput 
                    placeholder={this.props.placeholder}
                    placeholderTextColor='grey'
                    fontSize={17}
                    onChangeText={Text => this.props.onChangeText(Text)}
                    style={{ borderWidth: 1, borderColor: '#f2f2e1', 
                    backgroundColor: 'white', borderTopRightRadius: 10, 
                    borderBottomRightRadius: 10, height: 48, flex:1, padding: 5}}
                    value={this.props.searchInput}
                />
                /*{ <TouchableOpacity>
                    <View style={{ height: 50, backgroundColor: '#eaeaea' }}>
                        <Button title='b' size={30} />
                    </View>
                </TouchableOpacity> }*/
            //{</View>}
        ); 
    }
}

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
