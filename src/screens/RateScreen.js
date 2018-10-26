import React, { Component } from 'react';
import {Content, Form, ListItem, Item, Input, Label, Button, Icon, Picker, Text, Toast, Row, Col, Card, CardItem, Thumbnail, Body, Left } from 'native-base';

import HeaderComponent from '../components/HeaderComponent';
import LoadingComponent from '../components/LoadingComponent';

import axios from 'axios';
import numeral from 'numeral';

import { connect } from 'react-redux';

class RateScreen extends Component {

    state = {
        loading: false,
        phoneNumber: '',
        countryCode: '',
        rate: {}
    }

    chkRate = async () => {

        if (this.state.phoneNumber !== '') {
            try {
        
                this.setState({loading: true});

                const numberToCheck = (this.state.countryCode != '')? '011' + this.state.countryCode + this.state.phoneNumber: this.state.phoneNumber;
    
                const response = await axios({
                    url: 'https://voip-communications.net/api-v2/index.php/ionic/callquote/' + numberToCheck,
                    method: 'GET',
                    auth: {
                        username: this.props.user.user_api_key,
                        password: this.props.user.user_api_pwd
                    }
                });
    
                console.log(response.data);
    
                this.setState({loading: false, rate: response.data});
    
            } catch(e) {
    
                this.setState({loading: false});
                Toast.show({
                    text: "" + e,
                    type: "danger"
                })
        
            }
        } else {
            Toast.show({
                text: "Enter a phone number to check the rates",
                type: "danger"
            });
        }

    }

    showRate = () => {

        if (!this.state.loading) {
            if (this.state.rate.to) {
                return (
                    <Card>
                        <CardItem header>
                        <Left>
                            <Thumbnail source={{uri: 'https://voip-communications.net/countries-flags/' + this.state.rate.country + '.png'}} />
                            <Body>
                                <Text>{this.state.rate.to}</Text>
                                <Text note>{this.state.rate.country_name}</Text>
                            </Body>
                        </Left>
                        </CardItem>
                        <CardItem>
                            <Row>
                                <Col>
                                    <Button transparent>
                                        <Icon name='call'/><Text>Phone call</Text>
                                    </Button>
                                    <Text>${numeral(this.state.rate.sale).format('0,0.00')} / Minute</Text>
                                    <Text>{numeral(this.state.rate.mins).format('0,0')} minutes available</Text>
                                </Col>
                                <Col>
                                    <Button transparent>
                                        <Icon name='paper-plane'/><Text>SMS</Text>
                                    </Button>
                                    <Text>${numeral(this.state.rate.sms.sale).format('0,0.00')} / SMS</Text>
                                </Col>
                            </Row>
                        </CardItem>
                        <CardItem>
                            <Text>Your current balance is ${numeral(this.state.rate.balance).format('0,0.00')}</Text>
                        </CardItem>
                    </Card>
                )
            } else {
                return null
            }
        } else {
            return <LoadingComponent text="Checking rates, please wait"/>
        }

    }

    render() { 
        return (  
            <Content>
                <HeaderComponent title="Check Rates" toggleDrawer navigation={this.props.navigation}/>
                <Form>
                    <Item picker>
                        <Icon name='globe'/>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="ios-arrow-down-outline" />}
                            selectedValue={this.state.countryCode}
                            onValueChange={(value) => this.setState({countryCode: value})}
                        >
                            <Picker.Item key="XX" label="Select country code" value="" />
                            {
                                this.props.countries.map((country) => <Picker.Item key={country.country_e164} label={country.country_name + '(' + country.country_e164 + ')'} value={country.country_e164} />)
                            }
                        </Picker>
                    </Item>
                    <ListItem fixedLabel>
                        <Label>Phone number:</Label>
                        <Input value={this.state.phoneNumber} onChangeText={phoneNumber => this.setState({phoneNumber: phoneNumber.replace(/\D/g, '')})} keyboardType="numeric" style={{ textAlign: 'right' }}/>
                    </ListItem>
                    <Button block onPress={() => this.chkRate()}>
                        <Icon name='logo-usd'/><Text>Check rate</Text>
                    </Button>
                </Form>
                {this.showRate()}
            </Content>
        );
    }
}

const mapStateToProps = (state) => {

    return {
        user: state.user,
        countries: state.other.countries
    }
}
 
export default connect(mapStateToProps)(RateScreen);