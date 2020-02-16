import React from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body } from 'native-base';
import axios from 'axios';
import moment from 'moment';
import { ActivityIndicator, View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
/**
 * childrenView: 
 */

const API_KEY = '5d0c4f23de394e0001045b5da1f540293ed5430d87d47e6003b9f0b9';
const BASEPATH = 'https://hkust.cloud.tyk.io/hkust-event-calendar/getEvent.php';

export default class EventListPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            event_list: [],
            isLoading: false,
            page: 1,
            now: moment().format('YYYY-MM-DD'),
            totalNumOfItems: 0,
            keepLoading: true
        }
    }

    async componentWillMount() {
        try {
            this.setState({isLoading: true})
            await this.fetchData(1);
        } catch (err) {
            alert(JSON.stringify(err, null, 2))
        }
    }

    processEventList(list) {
        let processedList = []
        processedList = list.filter(event=>!event.events_en_title.toLowerCase().includes('cancelled'))
        processedList.forEach(event=>{
            event['events_en_title'] = event['events_en_title'].replace(/<\/?[^>]+(>|$)/g, "")
        });
        return processedList;
    }

    async fetchData() {
        try {
            let { page, event_list } = this.state;
            if(!this.state.keepLoading) return;
            const url = `${BASEPATH}?date_from=${this.state.now}&sort=A&page_size=10&page_num=${page}`
            let res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`
                }
            })
            const new_list = this.processEventList(res['data']['event']);
            event_list = event_list.concat(new_list)
            this.setState({
                event_list: event_list,
                totalNumOfItems: res['data']['total_cnt'],
                isLoading: false,
                keepLoading: res['data']['event'].length > 0
            })
        } catch (err) {
            alert(err)
        }
    }

    infiniteScroll() {
        this.setState((prevState, nextProps)=>({
            page: prevState.page + 1,
            isLoading: true
        }),
        ()=>{
            this.fetchData();
        })
    }

    renderCard(item) {
        return (
            <Card style={styles.item}>
                <CardItem header>
                    <Text style={styles.itemTitle}>
                        {item.events_en_title}
                    </Text>
                </CardItem>

                <CardItem>
                    <Body>
                        <View style={styles.itemDetailRow}>
                            <Text style={styles.itemDetailLabel}>Speaker : </Text><Text>{item.events_en_candidate || '-'}</Text>
                        </View>
                        <View style={styles.itemDetailRow}>
                            <Text style={styles.itemDetailLabel}>Date : </Text><Text>{moment(item.events_start_dt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') || '-'}</Text>
                        </View>
                        <View style={styles.itemDetailRow}>
                            <Text style={styles.itemDetailLabel}>Time : </Text><Text>{moment(item.events_start_dt, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')} - {moment(item.events_end_dt, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}</Text>
                        </View>
                        <View style={styles.itemDetailRow}>
                            <Text style={styles.itemDetailLabel}>Venue : </Text><Text>{item.events_en_venue || '-'}</Text>
                        </View>
                        {/* event.events_en_abstract */}
                    </Body>
                </CardItem>
            </Card>
        )
    }

    render() {
        const {height} = Dimensions.get('window');
        return(
            <View style={{flex:1, height:height}}>
                {                
                    this.state.isLoading &&
                    <View style={[styles.loading]}>
                        <ActivityIndicator size="large" color="#003366" />
                    </View>
                }
                <FlatList
                    data={this.state.event_list}
                    keyExtractor={(item, index) => `item-${index}`}
                    onEndReached={()=>{this.infiniteScroll()}}
                    onEndReachedThreshold={0.75}
                    renderItem={({item}) => (this.renderCard(item))}
                />
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
  