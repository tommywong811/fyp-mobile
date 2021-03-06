import React from 'react';
import { connect } from 'react-redux'; 
import {  
    Text, 
    View, 
    ActivityIndicator
} from 'react-native';
import { 
    RENDER_LOADING_PAGE,
} from '../../reducer/floors/actionList';

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
            });
        }, 100)
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
            }, 100)
            this.props.rendered_loading_page();
        }
    }
    

    render(){
        if(this.state.renderChildren) {
            return this.props.children;
        }

        return(
                <View style={{flex: 1, flexDirection: 'column', backgroundColor: '#003366', justifyContent:'center', alignItems:'center'}}>
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