import React, { Component } from 'react';
import { View } from 'react-native';
import { Header, Left, Right, Body, Button, Icon, Title, Text, Subtitle, Toast } from 'native-base';

import { connect } from 'react-redux';

import axios from 'axios';

import moment from 'moment';
import numeral from 'numeral';

class SmschatScreen extends Component {

    
    state = {
        _loading: false,
        _refreshing: false,
        internal: '',
        external: '',
        contact: '',
        page: 0,
        data: []
    }

    componentDidMount() {

        console.log('didmount');

        this.getParams();

    }

    getParams = () => {

        const contact = this.props.navigation.getParam('contact', '');
        const internal = this.props.navigation.getParam('internal', 'XXXXXXXXXX');
        const external = this.props.navigation.getParam('external', 'XXXXXXXXXX');
        if (internal != 'XXXXXXXXXX' || external != 'XXXXXXXXXX') {
            this.props.navigation.setParams({contact: '', internal: 'XXXXXXXXXX', external: 'XXXXXXXXXX'});
            this.setState({contact, internal, external},() => this.loadData());
        }

    }

    loadData = async () => {

        if (this.state.page >= 0) {
            const postData = new FormData();
            postData.append('internal',this.state.internal);
            postData.append('external',this.state.external);
            postData.append('page',this.state.page);

            this.state._loading = true;
            try {
        
                const response = await axios({
                    url: 'https://voip-communications.net/api-v2/index.php/sms/chat',
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
                    console.log('chat', response.data);
                    this.setState({
                        data: [...this.state.data,...response.data.chat], 
                    },() => {
                        this.setState({
                            _loading: false,
                            _refreshing: false,
                            page: response.data.chat.length > 0 ? this.state.page + 1: -1
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

    render() { 

        return (
            <View>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                            <Text>Messages</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Chat</Title>
                        <Subtitle>{this.state.contact}</Subtitle>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
                            <Icon name='menu' />
                        </Button>
                    </Right> 
                </Header>
                <Text>SmschatScreen between {this.state.internal} and {this.state.external}</Text>
            </View>
        );
    }
}

const mapStateToProps = (state) => {

    return {
        user: state.user,
    }
}
 
export default connect(mapStateToProps)(SmschatScreen);
