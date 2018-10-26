import React, { Component } from 'react';
import { View, Platform, PermissionsAndroid} from 'react-native';
import { Content, Item, Input, Button, H2, Grid, Row, Col, Text, Icon, Left, Right, Toast, Picker, Card, CardItem, Body} from 'native-base';

import HeaderComponent from '../components/HeaderComponent';
import LoadingComponent from '../components/LoadingComponent';

import { NetworkInfo } from 'react-native-network-info';

import { connect } from 'react-redux';
import { epPjsipAccount, epPjsipOtherState } from '../store/Actions';

class PhoneScreen extends Component {

    state = {
        ip: '0.0.0.0'
    }

    componentDidUpdate(){

        const callTo = this.props.navigation.getParam('callTo', 'XXXXXXXXXX');
        if (callTo != 'XXXXXXXXXX') {
            this.props.navigation.setParams({callTo: 'XXXXXXXXXX'});
            this.props.epPjsipOtherState({callNumber: callTo, countryCode: ''});
            Toast.show({
                text: "Tap on 'Call' to make the phone call",
                duration: 4000
            })
        }

    }
    
    componentDidMount() {

        NetworkInfo.getIPAddress(ip => {
            this.setState({ip});
            if (ip.search('169.254.') >= 0) {
                this.props.epPjsipOtherState({_whatToShow: 'error'});
            } else {
                this.checkPermissions();
            }
        });        

    }

    checkPermissions = async () => {

        hasRecordAudioPermissions = false;

        if (Platform.OS !== 'ios') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    'title': 'V-Phone mic permission',
                    'message': 'V-Phone App needs access to your mic to make phone calls'
                }
            )

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                hasRecordAudioPermissions = true;
            } 
        } else {
            hasRecordAudioPermissions = true;
        }

        if (hasRecordAudioPermissions) {
            this.pjsipInit();
        }

    }

    pjsipInit = async () => {

        if (!this.props.endpoint.accountRegistered) {

            console.log('no deberia estar aqui');
            let configuration = {
                "name": null,
                "username": this.props.endpoint.endpoint_username,
                "domain": "phone.plivo.com",
                "password": this.props.endpoint.endpoint_pwd,
                "proxy": null,
                "transport": null, // Default TCP
                "regServer": null, // Default wildcard
                "regTimeout": null, // Default 3600
                "regHeaders": {
                    "X-Custom-Header": "Value"
                },
                "regContactParams": ";unique-device-token-id=XXXXXXXXX"
            };
    
            this.props.endpoint.pjsip.createAccount(configuration).then((account) => {
                this.props.epPjsipAccount(account);
            }).catch((e) => {
                console.log('Error en creacion de cuenta ',e);
                this.props.epPjsipOtherState({_whatToShow: 'error'});
            });
        }

    }

    //done
    makeCall = () => {

        if (this.props.endpoint.callNumber != '' && this.props.endpoint.epStatus == 'onLine') {
            let options = {
                headers: {
                    "P-Assserted-Identity": "Header example",
                    "X-UA": "React native"
                }
            }
            this.props.endpoint.pjsip.makeCall(this.props.endpoint.account,this.props.endpoint.countryCode + this.props.endpoint.callNumber,{});
        }

    }

    //done
    cancelCall = () => {

        this.props.endpoint.pjsip.declineCall(this.props.endpoint.call);

    }
    //done
    endCall = () => {

        this.props.endpoint.pjsip.hangupCall(this.props.endpoint.call);

    }

    //done
    muteOnOff = () => {

        if (!this.props.endpoint.mute) {
            this.props.endpoint.pjsip.muteCall(this.props.endpoint.call);
            this.props.epPjsipOtherState({mute: true});
        } else {
            this.props.endpoint.pjsip.unMuteCall(this.props.endpoint.call);
            this.props.epPjsipOtherState({mute: false});
        }

    }

    //done
    speakerOnOff = () => {

        if (!this.props.endpoint.speaker) {
            this.props.endpoint.pjsip.useSpeaker(this.props.endpoint.call);
            this.props.epPjsipOtherState({speaker: true});
        } else {
            this.props.endpoint.pjsip.useEarpiece(this.props.endpoint.call);
            this.props.epPjsipOtherState({speaker: false});
        }
    }

    //done
    holdOnOff = () => {
      
        if (!this.props.endpoint.hold) {
            this.props.endpoint.pjsip.holdCall(this.props.endpoint.call);
            this.props.epPjsipOtherState({hold: true});
        } else {
            this.props.endpoint.pjsip.unholdCall(this.props.endpoint.call);
            this.props.epPjsipOtherState({hold: false});
        }
        
    }

    //done
    sendDigit = (digitPressed) => {

        this.props.epPjsipOtherState({callNumber: this.props.endpoint.callNumber + digitPressed});
        if (this.props.endpoint.epCallStatus == "oncall") {
            this.props.endpoint.pjsip.dtmfCall(this.props.endpoint.call,digitPressed);
        }

    }

    //done
    deleteCallNumber = () => {

        if (this.props.endpoint.callNumber.length == 1) {
            this.props.epPjsipOtherState({callNumber: '', countryCode: ''});
        } else {
            this.props.epPjsipOtherState({callNumber: this.props.endpoint.callNumber.slice(0,-1)});
        }
    }

    //done
    setCountryCode = (value) => {

        this.props.epPjsipOtherState({countryCode: value});
    }

    //done
    whatToShow = () => {

        switch(this.props.endpoint._whatToShow){
            case 'dialpad':
            return this.showDialPad();
            case 'error':
            return this.showError();
            default:
            return <LoadingComponent/>
        }

    }

    showError = () => {

        return (
            <Card>
                <CardItem>
                    <Left>
                        <Icon name="alert" style={{color:'red'}}/>
                        <Body>
                            <Text style={{color:'red'}}>Connection ERROR</Text>
                        </Body>
                    </Left>                    
                </CardItem>
                <CardItem style={{flexDirection:'column'}}>
                    <Text>Oops, this is embarrassing, there has been an error contacting our phone server, please check your internet connection.</Text>
                    <Text/>
                    <Text>Note: Our phone server does not support for Ipv6 at this time.</Text>
                </CardItem>
            </Card>
        );

    }

    //done
    showDialPad = () => {

        return (
                <View>
                    <View>
                        <Item>
                            <Left>
                                <Input disabled placeholder="Phone number" value={this.props.endpoint.countryCode + this.props.endpoint.callNumber} />
                            </Left>
                            <Right>
                                {this.showDelete()}
                            </Right>
                        </Item>
                    </View>
                    <Grid>
                        <Row><Col><Text></Text></Col></Row>
                        <Row>
                            <Col>
                                <Button block rounded light onPress={() => this.sendDigit('1')}>
                                    <H2>1</H2>
                                </Button>
                            </Col>
                            <Col>
                                <Button block rounded light onPress={() => this.sendDigit('2')}>
                                    <H2>2</H2>
                                </Button>
                            </Col>
                            <Col>
                                <Button block rounded light onPress={() => this.sendDigit('3')}>
                                    <H2>3</H2>
                                </Button>
                            </Col>
                        </Row>
                        <Row><Col><Text></Text></Col></Row>
                        <Row>
                            <Col>
                                <Button block rounded light onPress={() => this.sendDigit('4')}>
                                    <H2>4</H2>
                                </Button>
                            </Col>
                            <Col>
                                <Button block rounded light onPress={() => this.sendDigit('5')}>
                                    <H2>5</H2>
                                </Button>
                            </Col>
                            <Col>
                                <Button block rounded light onPress={() => this.sendDigit('6')}>
                                    <H2>6</H2>
                                </Button>
                            </Col>
                        </Row>
                        <Row><Col><Text></Text></Col></Row>
                        <Row>
                            <Col>
                                <Button block rounded light onPress={() => this.sendDigit('7')}>
                                    <H2>7</H2>
                                </Button>
                            </Col>
                            <Col>
                                <Button block rounded light onPress={() => this.sendDigit('8')}>
                                    <H2>8</H2>
                                </Button>
                            </Col>
                            <Col>
                                <Button block rounded light onPress={() => this.sendDigit('9')}>
                                    <H2>9</H2>
                                </Button>
                            </Col>
                        </Row>
                        <Row><Col><Text></Text></Col></Row>
                        <Row>
                            <Col>
                                <Button block rounded light onPress={() => this.sendDigit('*')}>
                                    <H2>*</H2>
                                </Button>
                            </Col>
                            <Col>
                                <Button block rounded light onPress={() => this.sendDigit('0')}>
                                    <H2>0</H2>
                                </Button>
                            </Col>
                            <Col>
                                <Button block rounded light onPress={() => this.sendDigit('#')}>
                                    <H2>*</H2>
                                </Button>
                            </Col>
                        </Row>
                        <Row><Col><Text></Text></Col></Row>
                    </Grid>
                    {this.showCallControls()}
                </View>
            
        )

    }

    //done
    showDelete = () => {

        if (this.props.endpoint.callNumber != '' && this.props.endpoint.epCallStatus == 'idle') {
            return (
                <Col>
                    <Button transparent info onPress={() => this.deleteCallNumber()}>
                        <Icon name="backspace"/>
                    </Button>
                </Col>
            )
        }
    }

    //done
    showCallControls = () => {

        switch(this.props.endpoint.epCallStatus) {
            case 'ringing':
            return(
                <View>
                    <Button block danger onPress={() => this.cancelCall()}>
                        <H2 style={{color:'white'}}>End</H2>
                    </Button>
                </View>
            )
            case 'oncall':
            return(
                <View>
                    <Row>
                        <Col>
                            <Button 
                                block 
                                info={this.props.endpoint.speaker? false: true} 
                                warning={this.props.endpoint.speaker? true: false} 
                                onPress={() => this.speakerOnOff()}
                            >
                                <Icon name={this.props.endpoint.speaker? "volume-off": "volume-mute"}/>
                            </Button>
                        </Col>
                        <Col>
                            <Button block danger onPress={() => this.endCall()}><H2 style={{color:'white'}}>End</H2></Button>
                        </Col>
                        <Col>
                            <Button 
                                block 
                                info={this.props.endpoint.mute? false: true} 
                                warning={this.props.endpoint.mute? true: false} 
                                onPress={() => this.muteOnOff()}
                            >
                                <Icon name={this.props.endpoint.mute? "mic": "mic-off"}/>
                            </Button>
                        </Col>
                    </Row>
                    <View style={{flexDirection:'row', flex:1, alignContent:'center', justifyContent:'center'}}>
                        <Text>Call duration: {this.props.endpoint.epCallDuration}</Text>
                    </View>
                </View>
            )
            default:
            return(
                <View>
                    <Row>
                        <Col>
                            <Button block success onPress={() => this.makeCall()}>
                                <H2 style={{color:'white'}}>Call</H2>
                            </Button>
                        </Col>
                    </Row>
                    <Item picker>
                        <Icon name='globe'/>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="ios-arrow-down-outline" />}
                            selectedValue={this.props.endpoint.countryCode}
                            onValueChange={(value) => this.setCountryCode(value)}
                        >
                            <Picker.Item key="XX" label="Add country code" value="" />
                            {
                                this.props.countries.map((country) => <Picker.Item key={country.country_e164} label={country.country_name + '(' + country.country_e164 + ')'} value={country.country_e164} />)
                            }
                        </Picker>
                    </Item>
                </View>
            )
        }
    }

    render() { 

        return (
            <Content>
                <HeaderComponent title="Phone" toggleDrawer navigation={this.props.navigation}/>
                { this.whatToShow() }
                <Text>IP Address: {this.state.ip}</Text>
            </Content>
        );

    }
}

const mapStateToProps = (state) => {

    return {
        endpoint: state.endpoint,
        user: state.user,
        countries: state.other.countries
    }
}
 
export default connect(mapStateToProps,{ epPjsipAccount, epPjsipOtherState })(PhoneScreen);