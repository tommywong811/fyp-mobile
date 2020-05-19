import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
  Text,
  Linking
} from "react-native";
import { WebView } from "react-native-webview";
import { Button } from "native-base";
import { SliderBox } from "react-native-image-slider-box";
import { TabView, SceneMap } from "react-native-tab-view";
import ScrollableTabView from "react-native-scrollable-tab-view";
import Pdf from "react-native-pdf";
// import { Constants } from 'expo';
/**
 * childrenView:
 */

const { width } = Dimensions.get("window");

const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: "#ff4081" }]} />
);

const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: "#673ab7" }]} />
);

export default class FacilityInfoPage extends React.Component {

  restaurantDetailList = 
    {
      'Starbucks Coffee': {
        images: [
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/starbucks-01_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/starbucks-02.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/starbucks-03.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/starbucks-04.jpg"
        ],
        menu: 'https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-11/starbucks_menu.pdf',
        style: {
          flex: 1,
          width: Dimensions.get("window").width,
          minHeight: Dimensions.get("window").height
        }
      },
      "Pacific Coffee": {
        images: [
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lskc_01.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lskc_02.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lskc_03.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lskc_04_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lskc_05_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lskc_06_0.jpg",
        ],
        menu: "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/LSK_pacificcoffee_menu.pdf",
        style: {
          flex: 1,
          width: Dimensions.get("window").width,
          height: 1100
        }
      },
      'Chinese Restaurant': {
        images: [
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-07/_dsc2704.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-07/_dsc2794.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-07/_dsc2679_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-07/_dsc2929.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-07/_dsc2938.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-07/_dsc3013.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-07/_dsc3031.jpg",
        ],
        menu: "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-12/menu_GF2017.PDF",
        style: {
          flex: 1,
          width: Dimensions.get("window").width,
          height: 10000
        }
      },
      'UC Bistro': {
        images: [
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-02/ucb_01_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-02/ucb_02.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-02/ucb_03.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-02/ucb_04.jpg"
        ],
        menu: "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-11/UniBistro_Menu_Nov_2019.pdf",
        style: {
          flex: 1,
          width: Dimensions.get("window").width,
          height: 4200
        }
      },
      'McDonalds': {
        images: [
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg5-01_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg5-02.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg5-03.jpg"
        ],
        menu: "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-03/menu_McD_2012-1.pdf",
        style: {
          flex: 1,
          width: Dimensions.get("window").width - 50,
          minHeight: 1500
        }
      },
      'Passion': {
        images: [
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-01/cc_01_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-01/cc_02.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-01/cc_03.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-01/cc_04.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-01/cc_05_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-01/cc_06_0.jpg"
        ],
        menu: "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-12/res_cc_cafe_menu-1.pdf",
        style: {
          flex: 1,
          width: Dimensions.get("window").width - 50,
          height: 7600
        }
      },
      'Subway': {
        images: [
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/subway-01.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/subway-02.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/subway-03_0.jpg"
        ],
        menu: "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-01/ann_cat_sw_come_menu.pdf",
        style: {
          flex: 1,
          width: Dimensions.get("window").width - 100,
          height: 900
        }
      },
      'LG1 canteen': {
        images: [
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg1-01_2.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg1-02_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg1-03_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg1-04_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg1-05_0.jpg"
        ],
        menu: "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-12/res_can.teenII_menu.pdf",
        style: {
          flex: 1,
          width: Dimensions.get("window").width,
          height: 13000
        }
      },
      'Gold Rice Bowl': {
        images: [
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg7-k2-01_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg7-k2-02.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg7-k2-03.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg7-k2-04.jpg"
        ],
        menu: "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-08/GRB%20Menu_2019.pdf",
        style: {
          flex: 1,
          width: Dimensions.get("window").width,
          height: 3300
        }
      },
      'Asia Pacific': {
        images: [
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-07/IMG_4068_0.JPG",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg7-k1-01.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg7-k1-02.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lg7-k1-04.jpg"
        ],
        menu: 'https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-08/APC%20Menu_2019.pdf',
        style: {
          flex: 1,
          width: Dimensions.get("window").width,
          height: 12650
        }
      },
      'Seafront Cafeteria': {
        images: [
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-03/sf_01_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-03/sf_03.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-03/sf_02.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-03/sf_04.jpg"
        ],
        menu: 'https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-12/res_seafront_menu.pdf',
        style: {
          flex: 1,
          width: Dimensions.get("window").width,
          height: 4400
        }
      },
      'Halal Food Counter': {
        images: [
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lsk-hl-01_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/lsk-hl-02_0.jpg"
        ],
        menu: 'https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-01/Halal_menu.pdf',
        style: {
          flex: 1,
          width: Dimensions.get("window").width - 75,
          height: Dimensions.get("window").height
        }
      },
      'UniBar': {
        images: [
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-02/unb_01.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-02/unb_02_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-02/unb_03.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-02/unb_04.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-02/unb_05.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2019-02/unb_06.jpg"
        ],
        menu: 'https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-12/menu_bar2017.pdf',
        style: {
          flex: 1,
          width: Dimensions.get("window").width,
          height: 2200
        }
      },
      'Food Truck': {
        images: [
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/04621_0.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/4713.jpg",
          "https://cso.ust.hk/sites/cso862-prod.sites2.ust.hk/files/2018-09/4713.jpg"
        ],
        menu: null,
        style: {
          flex: 1,
          width: Dimensions.get("window").width,
          minHeight: Dimensions.get("window").height
        }
      }
    }
  ;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      keepLoading: true,
      mock_images: this.restaurantDetailList[this.props.selectedNode]['images'],

      menuSource: {
        uri: this.restaurantDetailList[this.props.selectedNode]['menu'],
        cache: true
      },

      active: 0,
      xTabOne: 0,
      xTabTwo: 0,
      translateX: new Animated.Value(0),
      translateXTabOne: new Animated.Value(0),
      translateXTabTwo: new Animated.Value(width),
      translateY: -1000
    };
  }

  async componentWillMount() {
    try {
      this.setState({ isLoading: true });
      await this.fetchData(1);
    } catch (err) {
      // alert(JSON.stringify(err, null, 2));
    }
  }
  handleSlide = type => {
    active = this.state.active;
    xTabOne = this.state.xTabOne;
    xTabTwo = this.state.xTabTwo;
    translateX = this.state.translateX;
    translateXTabOne = this.state.translateXTabOne;
    translateXTabTwo = this.state.translateXTabTwo;
    translateY = this.state.translateY;

    Animated.spring(translateX, {
      toValue: type,
      duration: 100
    }).start();
    if (active === 0) {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: 0,
          duration: 100
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: width,
          duration: 100
        }).start()
      ]);
    } else {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: -width,
          duration: 100
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: 0,
          duration: 100
        }).start()
      ]);
    }
  };

  render() {
    const { height } = Dimensions.get("window");
    active = this.state.active;
    xTabOne = this.state.xTabOne;
    xTabTwo = this.state.xTabTwo;
    translateX = this.state.translateX;
    translateXTabOne = this.state.translateXTabOne;
    translateXTabTwo = this.state.translateXTabTwo;
    translateY = this.state.translateY;
    return (
      <View style={{ flex: 1, height: height }}>
        <SliderBox images={this.state.mock_images} dotColor='#003366'/>
        <Text style={{
          paddingTop: 5,
          textAlign: 'center',
          fontSize: 22,
          fontWeight: 'bold'
        }}>{this.props.selectedNode}</Text>
        <View style={{ flex: 1 }}>
          <View
            style={{
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginTop: 40,
                marginBottom: 20,
                height: 36,
                position: "relative"
              }}
            >
              <Animated.View
                style={{
                  position: "absolute",
                  width: "50%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  backgroundColor: "#003366",
                  borderRadius: 4,
                  transform: [
                    {
                      translateX
                    }
                  ]
                }}
              />
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#003366",
                  borderRadius: 4,
                  borderRightWidth: 0,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0
                }}
                onLayout={event =>
                  this.setState({
                    xTabOne: event.nativeEvent.layout.x
                  })
                }
                onPress={() =>
                  this.setState({ active: 0 }, () => this.handleSlide(xTabOne))
                }
              >
                <Text
                  style={{
                    color: active === 0 ? "#fff" : "#003366"
                  }}
                >
                  Comment &#38; Rating
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#003366",
                  borderRadius: 4,
                  borderLeftWidth: 0,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0
                }}
                onLayout={event =>
                  this.setState({
                    xTabTwo: event.nativeEvent.layout.x
                  })
                }
                onPress={() =>
                  this.setState({ active: 1 }, () => this.handleSlide(xTabTwo))
                }
              >
                <Text
                  style={{
                    color: active === 1 ? "#fff" : "#003366"
                  }}
                >
                  MENU
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Animated.View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  transform: [
                    {
                      translateX: translateXTabOne
                    }
                  ]
                }}
                onLayout={event =>
                  this.setState({
                    translateY: event.nativeEvent.layout.height
                  })
                }
              >
                <View style={{ marginTop: 20 }}>
                  <View style={{ marginTop: 20 }}>
                    <Text>
                      Food ★★★☆☆
                    </Text>
                    <Text>
                      Hygiene ★★★☆☆
                    </Text>
                    <Text>
                      Service ★★★☆☆
                    </Text>
                  </View>
                </View>
              </Animated.View>

              <Animated.View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  transform: [
                    {
                      translateX: translateXTabTwo
                    },
                    {
                      translateY: -translateY
                    }
                  ]
                }}
              >
                {this.state.menuSource.uri === null ? 
                  <View style={styles.container}>
                    <Text>Menu unavailable</Text>
                  </View> :
                  <View style={styles.container}>
                    <Pdf source={this.state.menuSource} style={this.restaurantDetailList[this.props.selectedNode]['style']} />
                  </View>
                }


              </Animated.View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    left: "50%",
    top: "50%",
    transform: [{ translateX: -15 }, { translateY: -50 }]
  },

  item: {
    marginLeft: 5,
    marginRight: 5,
    shadowColor: "#003366"
  },

  itemTitle: {
    fontSize: 16,
    color: "#003366"
  },

  itemDetailRow: {
    flexDirection: "column"
  },

  itemDetailLabel: {
    fontWeight: "bold"
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    minHeight: Dimensions.get("window").height
  }
});
