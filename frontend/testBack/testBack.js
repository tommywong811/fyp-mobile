import React from 'react';
import {View, Text} from 'react-native';
import {downloadDatabase} from '../../backend/db/index';
import { db/*, api*/ } from "../../backend";
import * as Progress from 'react-native-progress';
// import validateDownloadFiles from "../../backend/utils/validateDownloadFiles";

class TestBack extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            progress: 0
        }
        this.progressHandler = this.progressHandler.bind(this)
        //downloadDatabase((written, total) => console.log(`${written} / ${total}`)).then(() => db.loadDatabase((written, total) => console.log(`${written} / ${total}`)));
        // validateDownloadFiles().then(() => console.log("OK"));
        //db.loadDatabase((written, total) => console.log(`${written} / ${total}`));
    }
    progressHandler(w, t) {
        this.setState({
            progress: w / t
        })
    }
    componentDidMount(){
        downloadDatabase(this.progressHandler)
        .then(() => db.loadDatabase((written, total) => console.log(`${written} / ${total}`)));
    }
    render(){
        return (
            <Progress.Bar progress={this.state.progress} width={200}/>
        );
    }
}

export default TestBack;