import React from 'react';
import {connect} from 'react-redux';
import {Button} from 'react-native';


class Floor extends React.Component{
    render(){
        return(
            <Button title="GET" onPress={()=>{console.log(this.props.floors)}}/>     
        )
    }
}

const mapStateToProps = state => {
    return{
        floors: state
    }
}

export default connect(mapStateToProps, null)(Floor);