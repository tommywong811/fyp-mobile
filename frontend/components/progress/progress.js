import React from 'react';
import { db, api } from '../../../backend';
import * as Progress from 'react-native-progress';
import Navigator from '../Navigator/navigator';

export default class ProgressBar extends React.Component{
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
            finished: written >= total ? true : false,
            written: written,
            total: total
        })
    }

    componentDidMount(){
        try{api.meta()}
        catch(error){
            db.downloadDatabase(this._addProgressHandler)
            .then(() => db.loadDatabase(this._addProgressHandler))  
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