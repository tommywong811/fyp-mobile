import React from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body } from 'native-base';
import axios from 'axios';
import moment from 'moment'
/**
 * childrenView: 
 */

const API_KEY = '5d0c4f23de394e0001045b5da1f540293ed5430d87d47e6003b9f0b9';
const BASEPATH = 'https://hkust.cloud.tyk.io/hkust-event-calendar/getEvent.php';

export default class EventListPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            event_list: []
        }
    }

    async componentWillMount() {
        try {
            const now = moment().format('YYYY-MM-DD');
            const url = `${BASEPATH}?date_from=${now}`
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`
                }
            })
            this.setState({
                event_list: res['data']['event']
            })
        } catch (err) {
            alert(JSON.stringify(err, null, 2))
        }
    }

    render(){
        return(
            <Container>
                {/* TODO: Add filter and search */}
                <Content>
                    {this.state.event_list.map((event, key) => {
                        return (
                            <Card key = {key}>
                                <CardItem header>
                                    <Text>
                                        {event.events_en_title}
                                    </Text>
                                </CardItem>

                                <CardItem>
                                    <Body>
                                        <Text>
                                            Speaker : {event.events_en_candidate}
                                        </Text>
                                        <Text>
                                            Date : {moment(event.events_start_dt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')}
                                        </Text>
                                        <Text>
                                            Time : {moment(event.events_start_dt, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')} - {moment(event.events_end_dt, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}
                                        </Text>
                                        <Text>
                                            Venue : {event.events_en_venue}
                                        </Text>
                                        <Text>
                                            {/* {event.events_en_abstract} */}
                                        </Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        )
                    })}
                </Content>
            </Container>
        );
    }
}