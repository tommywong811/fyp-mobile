import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Dimensions } from 'react-native';
import allReducers from '../../reducer';
import MapCanvas from './mapCanvas';
import Animated from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const {Value, event, cond, eq, add, set, interpolate} = Animated;

const store = createStore(allReducers);

const { width, height } = Dimensions.get("window");

export default class MapCanvasWrapper extends React.Component{
    dragX = new Value(0);
    dragY = new Value(0);
    offsetX = new Value(0);
    offsetY = new Value(0);
    gestureState = new Value(-1);
    onGestureEvent = event([
        {
          nativeEvent: {
            translationX: this.dragX,
            translationY: this.dragY,
            state: this.gestureState
          }
        }
    ]);
    transX = cond(
        eq(this.gestureState, State.ACTIVE),
        add(this.offsetX, this.dragX),
        set(this.offsetX, add(this.offsetX, this.dragX)),
      );
    
      transY = cond(
        eq(this.gestureState, State.ACTIVE),
        add(this.offsetY, this.dragY),
        set(this.offsetY, add(this.offsetY, this.dragY)),
    );

    render(){
        return (
            <Provider store={store}>
              <PanGestureHandler 
                maxPointers={1}
                onGestureEvent={this.onGestureEvent}
                onHandlerStateChange={this.onGestureEvent}
                >
                <Animated.View 
                  style={{transform: [
                    {translateX: this.transX},
                    {translateY: this.transY}
                  ]}}>
                  <MapCanvas />
                </Animated.View>    
              </PanGestureHandler>
            </Provider>
        );
    }
}

