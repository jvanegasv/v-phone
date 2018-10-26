import React, { Component } from 'react';
import { Alert, View } from 'react-native';
import {Content, List, ListItem, Left, Icon, Text, H3, Right, Thumbnail, Item} from 'native-base';

import axios from 'axios';

import { connect } from 'react-redux'
import { usrLogout, epPjsipOtherState } from '../store/Actions'

class Drawer extends Component {

    routes = [
        {
            route: 'Home',
            title: 'Home',
            icon: 'home'
        },
        {
            route: 'Rate',
            title: 'Check Rates',
            icon: 'logo-usd'
        },
        {
            route: 'Profile',
            title: 'Profile',
            icon: 'contact'
        },
        {
            route: 'Settings',
            title: 'Phone call settings',
            icon: 'construct'
        }
    ];

    logout = () => {

        Alert.alert(
            'Logout',
            'Do you want to log out?',
            [
                {
                    text: 'NO',
                    onPress: () => {
                        this.props.navigation.toggleDrawer()
                    }
                },
                {
                    text: 'YES',
                    onPress: () => {
                        const postPushData = new FormData();
                        postPushData.append('token',this.props.other.devToken);
                        axios({
                            url: 'https://voip-communications.net/api-v2/index.php/pushnotifications/unregister',
                            method: 'POST',
                            auth: {
                                username: this.props.user.user_api_key,
                                password: this.props.user.user_api_pwd
                            },
                            data: postPushData
                        });

                        this.props.usrLogout();
                        this.props.epPjsipOtherState({accountRegistered: false, account: null});
                        this.props.navigation.navigate('Welcome')
                    }
                }
            ]
        );

    }

    render() { 
        return (
            <Content
                bounces={false}
                style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
            >
                <Text></Text>
                <Text></Text>
                <View style={{flexDirection:'row', flex: 1, alignContent:'center', justifyContent:'center'}}>
                    <Thumbnail square large source={require('../assets/images/icon.png')} />
                </View>
                <Item style={{flexDirection:'column'}}>
                    <H3>V-Phone</H3>
                    <Text style={{fontSize: 10}}>v1.0.4</Text>
                </Item>
                <List
                    dataArray={this.routes}
                    renderRow={(data) => (
                        <ListItem onPress={() => this.props.navigation.navigate(data.route)}>
                            <Left>
                                <Icon name={data.icon}/>
                                <Text>{data.title}</Text>
                            </Left>
                            <Right/>
                        </ListItem>
                    )}
                />
                <List>
                    <ListItem onPress={() => this.logout()}>
                        <Left>
                            <Icon name="arrow-round-back"/>
                            <Text>Logout</Text>
                        </Left>
                        <Right/>
                    </ListItem>
                </List>
            </Content>
          );
    }
}

const mapStateToProps = (state) => {
    return {
        endpoint: state.endpoint,
        user: state.user,
        other: state.other
    }
}
 
export default connect(mapStateToProps,{usrLogout, epPjsipOtherState})(Drawer);