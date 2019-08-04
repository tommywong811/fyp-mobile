import React from 'react';
import { connect } from 'react-redux'; 
import {
    Text,
    Image,
    View,
    Animated
} from 'react-native';
import NotFoundZoom0 from '../../asset/notFoundZoom0';
import { getFloorDimension, dirToUri } from '../../plugins/MapTiles';
import {mapTileSize, logicTileSize} from './config';
import { api } from '../../../backend';
import { 
    PanGestureHandler, 
    PinchGestureHandler,
    State 
} from 'react-native-gesture-handler';

export default class PinchableBox extends React.Component {
    pinchRef = React.createRef();
    constructor(props) {
        super(props);
        this._baseScale = new Animated.Value(1);
        this._pinchScale = new Animated.Value(1);
        this._scale = Animated.multiply(this._baseScale, this._pinchScale);
        this._lastScale = 1;
        this._onPinchGestureEvent = Animated.event(
        [{ nativeEvent: { scale: this._pinchScale } }],
        { useNativeDriver: { USE_NATIVE_DRIVER: true } }
        );
    }

    _onPinchHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
          this._lastScale *= event.nativeEvent.scale;
          this._baseScale.setValue(this._lastScale);
          this._pinchScale.setValue(1);
        }
    };

    render() {
        return(
            <PinchGestureHandler
                ref={this.pinchRef}
                onGestureEvent={this._onPinchGestureEvent}
                onHandlerStateChange={this._onPinchHandlerStateChange}>
                <Animated.View style={{flex:1}} collapsable={false}>
                  <Animated.Image
                    style={[
                      {width: 250,
                        height: 250,},
                      {
                        transform: [
                          { perspective: 200 },
                          { scale: this._scale }
                        ],
                      },
                    ]}
                    source={require('../../asset/RN.png')}
                  />
                </Animated.View>
            </PinchGestureHandler>
        )
    }
}