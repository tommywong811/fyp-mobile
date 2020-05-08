import React, { Component } from "react";
import { Item, Label, Picker } from "native-base";
import axios from "axios";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import Collapsible from "react-native-collapsible";

// import Constants from "expo-constants";
import * as Animatable from "react-native-animatable";
// import Collapsible from "react-native-collapsible";
// import Accordion from "react-native-collapsible/Accordion";

/**
 * childrenView:
 */

const BARN_A_GENERAL_AREA_URL =
  "http://itsc.ust.hk/apps/realcam/barna_g1_000M.jpg";
const BARN_A_TEACHING_AREA_URL =
  "http://itsc.ust.hk/apps/realcam/barna_t1_000M.jpg";
const BARN_B_FAR_END_1_URL = "http://itsc.ust.hk/apps/realcam/barnb_1_000M.jpg";
const BARN_B_FAR_END_2_URL = "http://itsc.ust.hk/apps/realcam/barnb_2_000M.jpg";
const BARN_C_GENERAL_AREA_URL =
  "http://itsc.ust.hk/apps/realcam/barnc_g1_000M.jpg";
const BARN_C_TEACHING_AREA_URL =
  "http://itsc.ust.hk/apps/realcam/barnc_t1_000M.jpg";

const BACON_IPSUM =
  "Bacon ipsum dolor amet chuck turducken landjaeger tongue spare ribs. Picanha beef prosciutto meatball turkey shoulder shank salami cupim doner jowl pork belly cow. Chicken shankle rump swine tail frankfurter meatloaf ground round flank ham hock tongue shank andouille boudin brisket. ";

const SELECTORS = [
  {
    title: "First",
    value: 0,
  },
  {
    title: "Third",
    value: 2,
  },
  {
    title: "None",
  },
];

const CONTENT = [
  {
    title: "First",
    content: BACON_IPSUM,
  },
  {
    title: "Second",
    content: BACON_IPSUM,
  },
  {
    title: "Third",
    content: BACON_IPSUM,
  },
  {
    title: "Fourth",
    content: BACON_IPSUM,
  },
  {
    title: "Fifth",
    content: BACON_IPSUM,
  },
];

export default class BarnHeatMapPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectBarn: "a",
      selectedBarnUrl_a: BARN_A_GENERAL_AREA_URL,
      selectedBarnUrl_b: BARN_A_TEACHING_AREA_URL,
      activeSections: [],
      collapsedA: true,
      collapsedB: true,
      collapsedC: true,
      multipleSelect: false,
    };
    this.selectBarn = this.selectBarn.bind(this);
  }

  async componentWillMount() {}

  selectBarn(value) {
    this.setState({ selectBarn: value });
    switch (value) {
      case "a":
        this.setState({
          selectedBarnUrl_a: BARN_A_GENERAL_AREA_URL,
          selectedBarnUrl_b: BARN_A_TEACHING_AREA_URL,
        });
        break;
      case "b":
        this.setState({
          selectedBarnUrl_a: BARN_B_FAR_END_1_URL,
          selectedBarnUrl_b: BARN_B_FAR_END_2_URL,
        });
        break;
      case "c":
        this.setState({
          selectedBarnUrl_a: BARN_C_GENERAL_AREA_URL,
          selectedBarnUrl_b: BARN_C_TEACHING_AREA_URL,
        });
        break;
    }
  }

  _renderSectionTitle = (section) => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  };

  renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.header, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        <Text style={styles.headerText}>{section.title}</Text>
      </Animatable.View>
    );
  };

  renderContent(section, _, isActive) {
    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        <Animatable.Text animation={isActive ? "bounceIn" : undefined}>
          {section.content}
        </Animatable.Text>
      </Animatable.View>
    );
  }

  toggleExpandedA = () => {
    this.setState({
      collapsedA: !this.state.collapsedA,
      collapsedB: true,
      collapsedC: true,
    });
    this.selectBarn("a");
  };

  toggleExpandedB = () => {
    this.setState({
      collapsedA: true,
      collapsedB: !this.state.collapsedB,
      collapsedC: true,
    });
    this.selectBarn("b");
  };

  toggleExpandedC = () => {
    this.setState({
      collapsedA: true,
      collapsedB: true,
      collapsedC: !this.state.collapsedC,
    });
    this.selectBarn("c");
  };

  render() {
    const { multipleSelect, activeSections } = this.state;
    return (
      <View style={styles.container}>
        {/* <Item fixedLabel>
                    <Label>Barn:</Label>
                    <Picker
                        mode="dropdown"
                        selectedValue={this.state.selectBarn}
                        placeholder="Select Barn"
                        onValueChange={this.selectBarn}
                    >
                        <Picker.Item label='Barn A' value='a' key='a'></Picker.Item>
                        <Picker.Item label='Barn B' value='b' key='b'></Picker.Item>
                        <Picker.Item label='Barn C' value='c' key='c'></Picker.Item>
                    </Picker>
                </Item>

                <View style={styles.imageContainer}>
                    <Image source={{uri: this.state.selectedBarnUrl_a}} resizeMode='contain' style={styles.barnImage}></Image>
                </View>

                <View style={styles.imageContainer}>
                    <Image source={{uri: this.state.selectedBarnUrl_b}} resizeMode='contain' style={styles.barnImage}></Image>
                </View> */}

        <ScrollView contentContainerStyle={{ paddingTop: 30 }}>
          <TouchableOpacity onPress={this.toggleExpandedA} style={styles.c_bar}>
            <View style={styles.header} >
              <Text style={styles.headerText}>Barn A: Busy</Text>
              <View style={styles.statusBarR}></View>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={this.state.collapsedA} align="center">
            <View style={styles.content}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: this.state.selectedBarnUrl_a }}
                  resizeMode="contain"
                  style={styles.barnImage}
                ></Image>
              </View>

              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: this.state.selectedBarnUrl_b }}
                  resizeMode="contain"
                  style={styles.barnImage}
                ></Image>
              </View>
            </View>
          </Collapsible>

          <TouchableOpacity onPress={this.toggleExpandedB} style={styles.c_bar}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Barn B: Not Busy</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={this.state.collapsedB} align="center">
            <View style={styles.content}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: this.state.selectedBarnUrl_a }}
                  resizeMode="contain"
                  style={styles.barnImage}
                ></Image>
              </View>

              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: this.state.selectedBarnUrl_b }}
                  resizeMode="contain"
                  style={styles.barnImage}
                ></Image>
              </View>
            </View>
          </Collapsible>
          <TouchableOpacity onPress={this.toggleExpandedC} style={styles.c_bar}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Barn C: Very Busy</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={this.state.collapsedC} align="center">
            <View style={styles.content}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: this.state.selectedBarnUrl_a }}
                  resizeMode="contain"
                  style={styles.barnImage}
                ></Image>
              </View>

              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: this.state.selectedBarnUrl_b }}
                  resizeMode="contain"
                  style={styles.barnImage}
                ></Image>
              </View>
            </View>
          </Collapsible>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "column",
  },
  imageContainer: {
    padding: 10,
  },
  barnImage: {
    width: 300,
    height: 200,
    alignSelf: "center",
  },

  title: {
    textAlign: "left",
    fontSize: 22,
    fontWeight: "300",
    marginBottom: 20,
  },

  c_bar: {
    marginLeft: 40,
    marginRight: 40,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },

  header: {
    backgroundColor: "#003366",
    color: "white",
    padding: 10,
  },
  headerText: {
    textAlign: "left",
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    paddingLeft: 30
  },
  content: {
    padding: 10,
    backgroundColor: "#fff",
  },
});
