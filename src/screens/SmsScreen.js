import React, { Component } from 'react';
import { View, FlatList} from 'react-native';
import {Text, Toast, ListItem, Left, Thumbnail, Body, Icon, Fab} from 'native-base';

import HeaderComponent from '../components/HeaderComponent';
import LoadingComponent from '../components/LoadingComponent';

import { connect } from 'react-redux';

import axios from 'axios';

import moment from 'moment';
import numeral from 'numeral';

class SmsScreen extends Component {

    state = {
        data: [],
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
                    this.setState({
                        data: [...this.state.data,...response.data.summary], 
                    },() => {
                        this.setState({
                            _loading: false,
                            _refreshing: false,
                            page: response.data.summary.length > 0 ? this.state.page + 1: -1
                        });
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

    renderSms = (msg) => {

        const country = msg.sms_country;
        const direction = msg.sms_status;
        const number = msg.sms_external;
        const cost = msg.sms_sale * 1;
        return (
            <ListItem thumbnail>
                <Left>
                    <Thumbnail source={{ uri: 'https://voip-communications.net/countries-flags/' + country + '.png' }} />
                </Left>
                <Body>
                    <Text onPress={() => this.props.navigation.navigate('smsChat')}>{this.searchInContacts(number)} ({direction})</Text>
                    <Text onPress={() => this.props.navigation.navigate('smsChat')} note numberOfLines={1}>{ moment(msg.sms_status_date).format('MM/DD/YYYY hh:mm A')} - ${numeral(cost).format('0,0.00')}</Text>
                    <Text onPress={() => this.props.navigation.navigate('smsChat')}>{msg.sms_msg}</Text>
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
            <View style={{ flex: 1 }}>
                <HeaderComponent title="Messages" toggleDrawer navigation={this.props.navigation}/>
                <Fab
                    active={true}
                    direction="up"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    >
                    <Icon name="create" />
                </Fab>
                <FlatList
                    data={this.state.data}
                    renderItem={({item}) => this.renderSms(item)}
                    keyExtractor={item => item.sms_id}
                    ListFooterComponent={this.state._loading? <LoadingComponent text="Loading data..."/>: null}
                    onEndReached={() => this.loadData()}
                    onRefresh={() => { 
                        this.setState({page: 0, data: [], _refreshing: true}, () => this.loadData());
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
        contacts: state.other.contacts
    }
}
 
export default connect(mapStateToProps)(SmsScreen);
