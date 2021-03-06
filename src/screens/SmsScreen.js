import React, { Component } from 'react';
import { View, FlatList} from 'react-native';
import {Text, Toast, ListItem, Left, Thumbnail, Body, Icon, Header, Right, Title, Button} from 'native-base';

import LoadingComponent from '../components/LoadingComponent';

import { connect } from 'react-redux';
import {smsSummaryInit,smsSummaryAdd} from '../store/Actions';

import axios from 'axios';

import moment from 'moment';
import numeral from 'numeral';

class SmsScreen extends Component {

    state = {
        _loading: false,
        _refreshing: false,
        page: 0,
    }

    loadData = async () => {

        if (this.state.page >= 0) {
            const postData = new FormData();
            postData.append('page',this.state.page);

            this.state._loading = true;
            try {
        
                const response = await axios({
                    url: 'https://voip-communications.net/api-v2/index.php/sms/summary',
                    method: 'POST',
                    data: postData,
                    auth: {
                        username: this.props.user.user_api_key,
                        password: this.props.user.user_api_pwd
                    }
                });
    
                if (response.data.error) {
                    Toast.show({
                        text: response.data.error_message,
                        type: "danger"
                    })
                } else {
                    console.log('summary', response.data);
                    this.props.smsSummaryAdd(response.data.summary);
                    this.setState({
                        _loading: false,
                        _refreshing: false,
                        page: response.data.summary.length > 0 ? this.state.page + 1: -1
                    });
                }
            }
            catch(e) {
        
                this.setState({_loading: false, _refreshing: false});
    
                Toast.show({
                    text: "" + e,
                    type: "danger"
                })
            }
        }

    }

    componentDidMount() {

        this.loadData();
        
    }   
    
    loadChat = (contact, internal,external) => {

        console.log('nav_params: ',contact, internal, external);
        this.props.navigation.navigate('smsChat',{contact, internal, external});
    }

    renderSms = (msg) => {

        const country = msg.sms_country;
        const direction = msg.sms_status;
        const number = msg.sms_external;
        const cost = msg.sms_sale * 1;
        const contact = this.searchInContacts(number);
        return (
            <ListItem thumbnail>
                <Left>
                    <Thumbnail source={{ uri: 'https://voip-communications.net/countries-flags/' + country + '.png' }} />
                </Left>
                <Body>
                    <Text onPress={() => this.loadChat(contact,msg.sms_internal,msg.sms_external)}>{contact} ({direction})</Text>
                    <Text onPress={() => this.loadChat(contact,msg.sms_internal,msg.sms_external)} note numberOfLines={1}>{ moment(msg.sms_status_date).format('MM/DD/YYYY hh:mm A')} - ${numeral(cost).format('0,0.00')}</Text>
                    <Text onPress={() => this.loadChat(contact,msg.sms_internal,msg.sms_external)}>{msg.sms_msg}</Text>
                </Body>
            </ListItem>
        )

    }

    searchInContacts = (number) => {

        toReturn = number;
        try {
            this.props.contacts.forEach(element => {
                if (element.pnumbers.indexOf(number.slice(-7)) >= 0) {
                    toReturn = element.givenName + ' ' + element.familyName + ' (' + number + ')';
                    throw 'Encontrado';
                }
            });
        } catch(e){
            console.log('Encontrado');
        }

        return toReturn;
    }

    render() { 
        return (  
            <View>
                <Header>
                    <Left/>
                    <Body>
                        <Title>Messages</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.props.navigation.navigate('smsNew')}>
                            <Icon name='create' />
                        </Button>
                        <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
                            <Icon name='menu' />
                        </Button>
                    </Right> 
                </Header>
                <FlatList
                    data={this.props.sms.summary}
                    renderItem={({item}) => this.renderSms(item)}
                    keyExtractor={item => item.sms_id}
                    ListFooterComponent={this.state._loading? <LoadingComponent text="Loading data..."/>: null}
                    onEndReached={() => this.loadData()}
                    onRefresh={() => { 
                        this.props.smsSummaryInit();
                        this.setState({page: 0, _refreshing: true}, () => this.loadData());
                    }}
                    refreshing={this.state._refreshing}
                />
            </View>
        );
    }
}
 
const mapStateToProps = (state) => {

    return {
        user: state.user,
        sms: state.sms,
        contacts: state.other.contacts
    }
}
 
export default connect(mapStateToProps,{smsSummaryInit,smsSummaryAdd})(SmsScreen);
