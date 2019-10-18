import React from 'react';
import { connect } from 'react-redux'; 
import {  
    Text, 
    View, 
    ActivityIndicator,
    Image,
} from 'react-native';
import { 
    RENDER_LOADING_PAGE,
} from '../../reducer/floors/actionList';

import Logo from '../../../res/tags/escalator.png';
/**
 * childrenView: 
 */
class loadingPage extends React.Component{
    constructor(props){
        super(props);
    }

    componentWillMount() {
        this.setState({
            renderChildren: false,
        })
    }
    componentDidMount() {
        setTimeout(()=>{
            this.setState({
                renderChildren: true,
            })
        }, 10)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.renderLoadingPage) {
            this.setState({
                renderChildren: false,
            })
        }
    }

    componentDidUpdate() {
        if (!this.state.renderChildren) {
            setTimeout(()=>{
                this.setState({
                    renderChildren: true,
                })
            }, 10)
            this.props.rendered_loading_page();
        }
    }
    
    component

    render(){
        console.log(this.state.renderChildren)
        if(this.state.renderChildren) {
            return this.props.children;
        }

        return(
                <View style={{flex: 1, flexDirection: 'column', backgroundColor: '#5e9cff', justifyContent:'center', alignItems:'center'}}>
                    <Image style={{width: 100, height: 100, marginBottom: 20}} source={Logo}></Image>
                    <ActivityIndicator size="large" color="#c9e6ff"></ActivityIndicator>
                    <Text style={{color: 'white', fontSize: 14, marginTop: 10}}>{this.props.text ? this.props.text : 'Loading'}</Text>
                </View> 
        );
    }
}

function mapStateToProps(state) {
    return{
        renderLoadingPage: state.floorReducer.renderLoadingPage,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        rendered_loading_page: () => dispatch({type: RENDER_LOADING_PAGE, payload: false}),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(loadingPage)