import React from 'react';
import axios from 'axios';
import moment from 'moment';
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
    Text
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Button } from "native-base";
import { SliderBox } from "react-native-image-slider-box";
import { TabView, SceneMap } from 'react-native-tab-view';
import ScrollableTabView from 'react-native-scrollable-tab-view';
/**
 * childrenView: 
 */

const { width } = Dimensions.get("window");


const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);

const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

const initialLayout = { width: Dimensions.get('window').width };


export default class FacilityInfoPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            // page: 1,
            // now: moment().format('YYYY-MM-DD'),
            // totalNumOfItems: 0,
            keepLoading: true,
            mock_images: [
                "http://lbnx29.ust.hk/blog/wp-content/uploads/2019/04/1f-touchfree-water-taps-350x212.png",
                "https://hk.on.cc/hk/bkn/cnt/news/20160410/photo/bkn-20160410114318213-0410_00822_001_01p.jpg?20160410140430",
                "https://lbnx29.ust.hk/blog/wp-content/uploads/2019/04/touchfree-tap-188x250.jpg",
                "https://source.unsplash.com/1024x768/?tree"
            ],

            active: 0,
            xTabOne: 0,
            xTabTwo: 0,
            translateX: new Animated.Value(0),
            translateXTabOne: new Animated.Value(0),
            translateXTabTwo: new Animated.Value(width),
            translateY: -1000

        }
    }

    async componentWillMount() {
        try {
            this.setState({ isLoading: true })
            await this.fetchData(1);
        } catch (err) {
            alert(JSON.stringify(err, null, 2))
        }
    }
    handleSlide = type => {
        active = this.state.active
        xTabOne = this.state.xTabOne
        xTabTwo = this.state.xTabTwo
        translateX = this.state.translateX
        translateXTabOne = this.state.translateXTabOne
        translateXTabTwo = this.state.translateXTabTwo
        translateY = this.state.translateY


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
        const { height } = Dimensions.get('window');
        active = this.state.active
        xTabOne = this.state.xTabOne
        xTabTwo = this.state.xTabTwo
        translateX = this.state.translateX
        translateXTabOne = this.state.translateXTabOne
        translateXTabTwo = this.state.translateXTabTwo
        translateY = this.state.translateY
        return (
            <View style={{ flex: 1, height: height }}>
                <SliderBox images={this.state.mock_images} />
                <Text>{this.props.selectedNode}</Text>
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
                                    backgroundColor: "#007aff",
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
                                    borderColor: "#007aff",
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
                                    this.setState({ active: 0 }, () =>
                                        this.handleSlide(xTabOne)
                                    )
                                }
                            >
                                <Text
                                    style={{
                                        color: active === 0 ? "#fff" : "#007aff"
                                    }}
                                >
                                    OVERVIEW
                            </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: "#007aff",
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
                                    this.setState({ active: 1 }, () =>
                                        this.handleSlide(xTabTwo)
                                    )
                                }
                            >
                                <Text
                                    style={{
                                        color: active === 1 ? "#fff" : "#007aff"
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
                                <Text>Hi, I am a cute cat</Text>

                                <View style={{ marginTop: 20 }}>
                                    <View style={{ marginTop: 20 }}>
                                        <Image
                                            source={{ uri: 'data:image/jpeg;base64,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' }}
                                            style={{ width: 400, height: 400 }}
                                        />
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
                                <Text>Hi, I am a cute dog</Text>
                                <View style={{ marginTop: 20 }}>
                                    <Image
                                        source={{ uri: 'https://cdn11.bigcommerce.com/s-oe2q4reh/images/stencil/2048x2048/products/732/1325/Golden_Retriever_Puppy__29083.1568518945.jpg?c=2' }}
                                        style={{ width: 400, height: 400 }}
                                    />
                                </View>
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
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        left: '50%',
        top: '50%',
        transform: [
            { translateX: -15 },
            { translateY: -50 }
        ]
    },

    item: {
        marginLeft: 5,
        marginRight: 5,
        shadowColor: "#003366"
    },

    itemTitle: {
        fontSize: 16,
        color: '#003366'
    },

    itemDetailRow: {
        flexDirection: 'column'
    },

    itemDetailLabel: {
        fontWeight: "bold"
    }
})
