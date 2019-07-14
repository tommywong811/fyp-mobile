import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";


const { width, height } = Dimensions.get("window");


const {Value, event, cond, eq, add, set, interpolate} = Animated;



export class Mainbox extends React.Component {
  dragX = new Value(0);
  dragY = new Value(0);
  offsetX = new Value(width / 2);
  offsetY = new Value(height / 2);
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
      <View style={styles.container}>
        <PanGestureHandler
          maxPointers={1}
          onGestureEvent={this.onGestureEvent}
          onHandlerStateChange={this.onGestureEvent}
        >
        <Animated.View
          style={[
            styles.box,
            { opacity: this.opacity,  
              transform: [
                {
                  translateX: this.transX,
                },
                {
                  translateY: this.transY,
                },
              ],
            },
          ]}
        />
      </PanGestureHandler>
    </View>
    );
  }
}

export default Mainbox;

const CIRCLE_SIZE = 70;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    backgroundColor: "tomato",
    marginLeft: -(CIRCLE_SIZE / 2),
    marginTop: -(CIRCLE_SIZE / 2),
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderColor: "#000"
  },
});

opacity = interpolate(this.transY, {
  inputRange: [0, height],
  outputRange: [0.1, 1],
});