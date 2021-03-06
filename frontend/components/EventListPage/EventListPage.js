import React from 'react';
import { Card, CardItem, Text, Body, Badge, DatePicker, Item, Label, Button, Picker } from 'native-base';
import axios from 'axios';
import moment from 'moment';
import { ActivityIndicator, View, StyleSheet, FlatList, Dimensions, Modal, Platform, Linking, SafeAreaView } from 'react-native';
import { Actions } from 'react-native-router-flux';
/**
 * childrenView: 
 */

const API_KEY = '5d0c4f23de394e0001045b5da1f540293ed5430d87d47e6003b9f0b9';
const BASEPATH = 'https://hkust.cloud.tyk.io/hkust-event-calendar';

export default class EventListPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            event_list: [],
            isLoading: false,
            page: 1,
            now: moment().format('YYYY-MM-DD'),
            totalNumOfItems: 0,
            keepLoading: true,
            isModalVisible: false,
            dateFrom: moment().format('YYYY-MM-DD'),
            dateTo: null,
            selectedCategory: '',
            selectedPostingUnit: '',
            categories: [],
            postingUnits: [],
            is_filter: false
        }
        this.setFromDate = this.setFromDate.bind(this);
        this.setToDate = this.setToDate.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.fetchCategory = this.fetchCategory.bind(this);
        this.filter = this.filter.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
        this.setSelectedCategory = this.setSelectedCategory.bind(this);
        this.setSelectedPostingUnit = this.setSelectedPostingUnit.bind(this);
        this.onPressVenue = this.onPressVenue.bind(this);
        this.checkIsClickable = this.checkIsClickable.bind(this);
    }

    async componentWillMount() {
        try {
            this.setState({isLoading: true})
            await this.fetchCategory();
            await this.fetchPostUnit();
            await this.fetchData();
        } catch (err) {
            alert(JSON.stringify(err, null, 2))
        }
    }

    processEventList(list) {
        let processedList = []
        if(!list || list.length === 0) return processedList;
        processedList = list.filter(event=>!event.events_en_title.toLowerCase().includes('cancelled'))
        processedList.forEach(event=>{
            event['events_en_title'] = event['events_en_title'].replace(/<\/?[^>]+(>|$)/g, "")
        });
        return processedList;
    }

    async fetchCategory() {
        const url = `${BASEPATH}/getEventCat.php`
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${API_KEY}`
            }
        })
        this.setState({
            categories: res['data']
        })
    }

    async fetchPostUnit() {
        const url = `${BASEPATH}/getEventPostingunit.php`
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${API_KEY}`
            }
        })
        this.setState({
            postingUnits: res['data']
        })
    }

    async fetchData(date_from=null, date_to=null, cat_id=null, posting_unit=null, is_filter=false) {
        try {
            let { page, event_list } = this.state;
            if(!this.state.keepLoading && !is_filter) return;
            const url = `${BASEPATH}/getEvent.php?date_from=${date_from?date_from:this.state.now}${date_to?`&date_to=${date_to}`:''}${cat_id?`&cat_id=${cat_id}`:''}${posting_unit?`&posting_unit=${posting_unit}`:''}&sort=A${is_filter?'':`&page_size=10&page_num=${page}`}`
            let res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`
                }
            })
            if(res['data']['total_cnt'] === 0) {
                this.setState({
                    event_list: [],
                    totalNumOfItems: 0,
                    isLoading: false,
                    keepLoading: false
                })
                return;
            }
            const new_list = this.processEventList(res['data']['event']);
            event_list = event_list.concat(new_list)
            event_list.map(e=> {
                let res = this.state.postingUnits.find(unit => unit['unit_id'] === e['events_dept'])
                e['events_dept'] = res ? res['unit_en_name']: e['events_dept']
            })
            this.setState({
                event_list: event_list,
                totalNumOfItems: res['data']['total_cnt'],
                isLoading: false,
                keepLoading: res['data']['total_cnt'] > 0
            })
        } catch (err) {
            alert(err)
        }
    }

    infiniteScroll() {
        if (this.state.is_filter) return;
        this.setState((prevState, nextProps)=>({
            page: prevState.page + 1,
            isLoading: true
        }),
        ()=>{
            this.fetchData();
        })
    }

    openModal = () => {
        this.setState({ isModalVisible: true });
    };

    closeModal = () => {
        this.setState({ isModalVisible: false });
    }

    async filter() {
        await this.setState({
            event_list: [],
            isLoading: true,
            page: 1,
            totalNumOfItems: 0,
            keepLoading: false,
            isModalVisible: !this.state.isModalVisible,
            is_filter: true
        });
        await this.fetchData(this.state.dateFrom, this.state.dateTo?this.state.dateTo:null, this.state.selectedCategory?this.state.selectedCategory:null, this.state.selectedPostingUnit?this.state.selectedPostingUnit:null, true);
    }

    async clearFilter() {
        await this.setState({
            selectedPostingUnit: null,
            selectedCategory: null,
            dateFrom: moment().format('YYYY-MM-DD'),
            dateTo: null,
            is_filter: false
        });
        // await this.fetchData();
    }

    setFromDate(newDate) {
        this.setState({ dateFrom: moment(newDate).format('YYYY-MM-DD') });
    }

    setToDate(newDate) {
        this.setState({ dateTo: moment(newDate).format('YYYY-MM-DD') });
    }

    setSelectedCategory(category) {
        this.setState({ selectedCategory: category });
    }

    setSelectedPostingUnit(unit) {
        this.setState({ selectedPostingUnit: unit });
    }

    async onPressVenue(venue) {
        if (venue === '' || venue === null || venue.toLowerCase().includes('online') || venue.toLowerCase().includes('zoom')) {
            if (venue.includes('http')) {
                let testUrl = venue.match(/\bhttps?:\/\/\S+/gi);
                Linking.canOpenURL(testUrl[0]).then(supported => {
                    if(supported) Linking.openURL(testUrl[0])
                }).catch(err => {})
            } else {
                return;
            }
        } else {
            Actions.push('NavigatorPage', {
                searchKeyword: venue || ''
            })
        }
    }

    checkIsClickable(venue) {
        if (venue === '' || venue === null || venue.toLowerCase().includes('online') || venue.toLowerCase().includes('zoom')) {
            if (venue.includes('http')) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
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
                            <Text style={styles.itemDetailLabel}>Posting Unit : </Text><Text>{item.events_dept || '-'}</Text>
                        </View>
                        <View style={styles.itemDetailRow}>
                            <Text style={styles.itemDetailLabel}>Category : </Text><Text>{item.events_category || '-'}</Text>
                        </View>
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
                            <Text style={styles.itemDetailLabel}>Venue : </Text>
                            <Text style={
                                    this.checkIsClickable(item.events_en_venue) ? styles.link : null
                                } 
                                onPress={()=>this.onPressVenue(item.events_en_venue)}>
                                {item.events_en_venue || '-'}
                            </Text>
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
                <Badge style={styles.filterBadge}>
                    <Text 
                        style={styles.filterBadgeText}
                        onPress={this.openModal}
                    >
                        Filter
                    </Text>
                </Badge>
                <Modal visible={this.state.isModalVisible}>
                    <SafeAreaView>
                        <View>
                            <View style={styles.headerBar}>
                                <Text style={styles.modalTitle}>Filter</Text>
                                <Text style={styles.modalBackButton} onPress={this.closeModal}>X</Text>
                            </View>
                            <Item fixedLabel>
                                <Label>Date From:</Label>
                                <DatePicker
                                    locale={'en'}
                                    defaultDate={new Date()} 
                                    maximumDate={this.state.dateTo?new Date(this.state.dateTo.split('-')[0], Number(this.state.dateTo.split('-')[1])-1, this.state.dateTo.split('-')[2]):new Date(2999,11,31)}
                                    onDateChange={this.setFromDate}
                                />
                            </Item>
                            <Item fixedLabel>
                                <Label>Date To:</Label>
                                <DatePicker
                                    locale={'en'}
                                    minimumDate={new Date(this.state.dateFrom.split('-')[0], Number(this.state.dateFrom.split('-')[1])-1, this.state.dateFrom.split('-')[2])}
                                    onDateChange={this.setToDate}
                                />
                            </Item>
                            <Item fixedLabel>
                                <Label>Category:</Label>
                                <Picker
                                    mode="dropdown"
                                    placeholder="Select Category"
                                    selectedValue={this.state.selectedCategory}
                                    onValueChange={this.setSelectedCategory}
                                >
                                    {this.state.categories.map(category => {
                                        return (<Picker.Item label={category.cat_en_name} value={category.cat_id} key={category.cat_id}></Picker.Item>)
                                    })}
                                </Picker>
                            </Item>
                            <Item fixedLabel>
                                <Label>Posting Unit:</Label>
                                <Picker
                                    mode="dropdown"
                                    placeholder="Select Posting Unit"
                                    selectedValue={this.state.selectedPostingUnit}
                                    onValueChange={this.setSelectedPostingUnit}
                                >
                                    {this.state.postingUnits.map(unit => {
                                        return (<Picker.Item label={unit.unit_en_name} value={unit.unit_id} key={unit.unit_id}></Picker.Item>)
                                    })}
                                </Picker>
                            </Item>
                            <Button style={styles.modalClearFilterButton} block onPress={this.clearFilter}>
                                <Text>Clear Filter</Text>
                            </Button>
                            <Button style={styles.modalFilterButton} block onPress={this.filter}>
                                <Text>Filter</Text>
                            </Button>
                        </View>
                    </SafeAreaView>
                </Modal>
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

    headerBar: {
        ...Platform.select({
            ios: {
              height: 64,
            },
            android: {
              height: 54,
            },
            windows: {
              height: 54,
            },
        }),
        backgroundColor: '#003366',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    modalTitle: {
        fontSize: 20,
        color: 'white',
        left: 2,
        paddingLeft: 12,
        flexDirection: 'row',
        fontWeight: '500'
    },

    modalBackButton: {
        fontSize: 24,
        color: 'white',
        right: 2,
        paddingRight: 8,
        flexDirection: 'row'
    },

    modalFilterButton: {
        marginTop: 24,
        backgroundColor: '#003366',
        marginRight: 8,
        marginLeft: 8,
    },

    modalClearFilterButton: {
        marginTop: 24,
        backgroundColor: 'red',
        marginRight: 8,
        marginLeft: 8,
    },

    filterBadge: {
        margin: 5,
        backgroundColor: '#003366'
    },

    filterBadgeText: {
        color: 'white',
        transform: [
            { translateY: 3 }
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
    },

    link: {
        color: '#003366',
        textDecorationLine: 'underline'
    }
})
  