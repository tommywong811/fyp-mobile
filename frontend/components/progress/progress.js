import React from 'react';
import { connect } from 'react-redux';
import { db, api } from '../../../backend';
import * as Progress from 'react-native-progress';
import Navigator from '../Navigator/navigator';
import { UPDATE_FLOOR_DATA, UPDATE_CURRENT_FLOOR } from '../../reducer/floors/actionList';

class ProgressBar extends React.Component{
    constructor(props){
        super(props);
        this._renderProgress = this._renderProgress.bind(this);
        this._addProgressHandler = this._addProgressHandler.bind(this);
        try{api.meta();
            this.state = {
                finished: true,
                written: 0,
                total: 1,
            }}
        catch(error){
            this.state = {
                finished: false,
                written: 0,
                total: 1,
            }
        }
    }

    _addProgressHandler(written, total){
        this.setState({
            // finished: Number(written) >= Number(total) ? true : false,
            written: written,
            total: total
        })
    }

    componentDidMount(){
        try{api.meta()}
        catch(error){
            db.downloadDatabase(this._addProgressHandler)
            .then(() => db.loadDatabase(this._addProgressHandler))
            .then(() => {
                this.props.update_floor_data(api.floors().data)
                this.props.update_current_floor(api.floors().data[0])
                this.setState({ finished: true })
            })
        }

    }

    _renderProgress(){
        if(!this.state.finished){
            return <Progress.Circle progress={this.state.written/this.state.total} endAndgle={1} size={60}
            showsText={true}
            style={{justifyContent: 'center', alignItems: 'center'}}
            textStyle={{justifyContent: 'center', alignItems: 'center'}}/>
        }else{
            return (
                <Navigator>
                </Navigator>
            );
        }
    }

    render(){
        return this._renderProgress();
    }
}

function mapDispatchToProps(dispatch){
    return {
        update_floor_data: (data) => 
            dispatch({type: UPDATE_FLOOR_DATA, payload: {data: data}}),
        update_current_floor: (currentFloor) => 
            dispatch({type: UPDATE_CURRENT_FLOOR, payload: {currentFloor: currentFloor}})
    };
}

export default connect(mapDispatchToProps)(ProgressBar);