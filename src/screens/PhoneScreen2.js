import React, { Component } from 'react';
import { View, Platform, PermissionsAndroid} from 'react-native';
import { Content, Item, Input, Button, H2, Grid, Row, Col, Text, Icon, Left, Right, Toast, Picker, Card, CardItem, Body} from 'native-base';

import Modal from "react-native-modal";

import HeaderComponent from '../components/HeaderComponent';
import LoadingComponent from '../components/LoadingComponent';

import { NetworkInfo } from 'react-native-network-info';

import { connect } from 'react-redux';
import { epPjsipAccount, epPjsipOtherState } from '../store/Actions';

class PhoneScreen2 extends Component {

    state = {
        ipv6: false,
        showModal: false
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
            if (ip.search('169.254.') >= 0) {
                this.setState({ipv6: true});
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

        this.props.epPjsipOtherState({_whatToShow: 'dialpad', countryCode: '', callNumber: ''});

    }

    //done
    makeCall = () => {

        this.setState({showModal: true});

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

        if (this.props.endpoint.callNumber != '') {
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
                <View style={{flex: 1,justifyContent: "center",alignItems: "center"}}>
                    <Modal isVisible={this.state.showModal}>
                        <Card>
                            <CardItem header bordered>
                                <Text>Insufficient balance</Text>
                            </CardItem>
                            <CardItem bordered>
                                <Text>Your current balance is $0.00, please go to Voip-Communications to add more funds to your account</Text>
                            </CardItem>
                            <CardItem footer bordered>
                                <Button block primary onPress={() => this.setState({showModal: false})}>
                                    <Text>Close</Text>
                                </Button>
                            </CardItem>
                        </Card>
                    </Modal>
                </View>
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
 
export default connect(mapStateToProps,{ epPjsipAccount, epPjsipOtherState })(PhoneScreen2);