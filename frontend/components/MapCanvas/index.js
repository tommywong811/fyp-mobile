import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Dimensions, StyleSheet } from 'react-native';
import allReducers from '../../reducer/index';
import MapCanvas from './mapCanvas';
import Animated from "react-native-reanimated";
import { PanGestureHandler, 
         State,
         PinchGestureHandler,
         RotationGestureHandler } from "react-native-gesture-handler";

import { USE_NATIVE_DRIVER } from '../config';

const {Value, event, cond, eq, add, set, multiply} = Animated;

const store = createStore(allReducers);

const { width, height } = Dimensions.get("window");


export default class MapCanvasWrapper extends React.Component{
    panRef = React.createRef();
    rotationRef = React.createRef();
    pinchRef = React.createRef();
    constructor(props){
      super(props);
          this.changeCache = this.changeCache.bind(this);
          /* Dragging even */
          this.dragX = new Value(0);
          this.dragY = new Value(0);
          this.offsetX = new Value(0);
          this.offsetY = new Value(0);
          this.gestureState = new Value(-1);
          this.onGestureEvent = event([
              {
                nativeEvent: {
                  translationX: this.dragX,
                  translationY: this.dragY,
                  state: this.gestureState
                }
              }
          ]);
          this.transX = cond(
              eq(this.gestureState, State.ACTIVE),
              add(this.offsetX, this.dragX),
              set(this.offsetX, add(this.offsetX, this.dragX)),
            );
          
          this.transY = cond(
              eq(this.gestureState, State.ACTIVE),
              add(this.offsetY, this.dragY),
              set(this.offsetY, add(this.offsetY, this.dragY)),
          );

          /* Pinch Even*/
          this._baseScale = new Animated.Value(1);
          this._pinchScale = new Animated.Value(1);
          this._scale = Animated.multiply(this._baseScale, this._pinchScale);
          this._lastScale = 1;
          this._onPinchGestureEvent = Animated.event(
            [{ nativeEvent: { scale: this._pinchScale } }],
            { useNativeDriver: USE_NATIVE_DRIVER }
          );

          _onPinchHandlerStateChange = event => {
            if (event.nativeEvent.oldState === State.ACTIVE) {
              this._lastScale *= event.nativeEvent.scale;
              this._baseScale.setValue(this._lastScale);
              this._pinchScale.setValue(1);
            }
          };

          this.cacheImage = null;
    }

    changeCache(arr){
      this.cacheImage = arr;
    }

    render(){
        return (
            
              <PanGestureHandler 
                ref={this.panRef}
                maxPointers={2}
                onGestureEvent={this.onGestureEvent}
                onHandlerStateChange={this.onGestureEvent}
                >
                <Animated.View 
                  style={styles.wrapper}>
                    <PinchGestureHandler
                      ref={this.pinchRef}
                      simultaneousHandlers={this.rotationRef}
                      onGestureEvent={this._onPinchGestureEvent}
                      onHandlerStateChange={this._onPinchHandlerStateChange}>
                        <Animated.View 
                          style={
                            [{transform: [{translateX: this.transX},
                              {translateY: this.transY},
                              { scale: this._scale },
                            ]}]
                          }>
                            <Provider store={store}>
                            <MapCanvas cacheImage={this.cacheImage}
                              changeCache={this.changeCache} />
                            </Provider>
                        </Animated.View>
                      </PinchGestureHandler>
                    
                </Animated.View>    
              </PanGestureHandler>

        );
    }
}


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    overflow: 'hidden',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  pinchableImage: {
    width: 250,
    height: 250,
  },
  wrapper: {
    flex: 1,
  },
});