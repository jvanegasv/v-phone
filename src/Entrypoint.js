import React, { Component } from 'react';
import { Platform } from 'react-native';
import { Root, Container } from 'native-base';

import Navigator from './screens/Navigator';

import {Endpoint} from 'react-native-pjsip';

import axios from 'axios';

import firebase from 'react-native-firebase'

import { connect } from 'react-redux';
import { epPjsipInit, epPjsipOnRegistrationChanged, epPjsipOnConnectivityChanged, epPjsipOnCallReceived, epPjsipOnCallChanged, epPjsipOnCallTerminated, epPjsipOnCallScreenLocked, epPjsipOnCallDuration, otherDevToken } from './store/Actions';

import moment from 'moment';

class Entrypoint extends Component {

    callDurationInterval;

    componentWillMount() {

        this.registerPjSip();
        this.fbGetToken();
    }

    componentDidMount() {

        this.fbNotificationsPermissions();
        this.fbNotificationsListeners();
    }

    fbNotificationsPermissions = async () => {

        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            // user has permissions
        } else {

            try {
                await firebase.messaging().requestPermission();
            } catch (error) {
                // User has rejected permissions
            }
        }        
    }

    fbNotificationsListeners = async () => {

        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            // App was opened by a notification
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification = notificationOpen.notification;
        }        

        this.messageListener = firebase.messaging().onMessage((message) => {
        });  
        
        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
        });

        this.notificationListener = firebase.notifications().onNotification((notification) => {
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        });

    }

    componentWillUnmount() {
        this.messageListener();
        this.notificationDisplayedListener();
        this.notificationListener();
        this.notificationOpenedListener();
        this.onTokenRefreshListener();
    }

    fbGetToken = async () => {

        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            console.log('Mi token es: ',fcmToken);
            this.props.otherDevToken(fcmToken);
        }
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(newFcmToken => {
            console.log('update token... new token: ', newFcmToken);

            const postPushData = new FormData();
            postPushData.append('old_token',this.props.other.devToken);
            postPushData.append('new_token',newFcmToken);
            axios({
                url: 'https://voip-communications.net/api-v2/index.php/pushnotifications/refresh',
                method: 'POST',
                data: postPushData
            });

            this.props.otherDevToken(newFcmToken);
        });        

    }

    registerPjSip = async () => {

        pjendpoint = new Endpoint();
        this.props.epPjsipInit(pjendpoint);

        let pjendpointState = await pjendpoint.start({
                                                        service: {
                                                            ua: Platform.select({ios: "RnSIP iOS", android: "RnSIP Android"})
                                                        },
                                                        network: {
                                                            useWifi: true,
                                                            useOtherNetworks: true
                                                        }
                                                        }); // List of available accounts and calls when RN context is started, could not be empty because Background service is working on Android                                                        
        let {accounts, calls, settings, connectivity} = pjendpointState;

        pjendpointState.accounts.forEach(element => {
            console.log('elimando cuenta: ',element);
            pjendpoint.deleteAccount(element);
        });

        // REGISTRATION
        pjendpoint.on("registration_changed", (account) => {
            console.log("registration_changed:",account);
            if (account._registration._status == "OK" || account._registration._reason == "OK") {
                this.props.epPjsipOnRegistrationChanged({_whatToShow: 'dialpad', epStatus: 'onLine'});
            }
        });

        pjendpoint.on("connectivity_changed", (online) => {
            console.log("connectivity_changed:", online);
            this.props.epPjsipOnConnectivityChanged(online);
        });

        pjendpoint.on("call_received", (call) => {
            console.log("call_received:",call);
            this.props.epPjsipOnCallReceived(call);
        });

        pjendpoint.on("call_changed", (call) => {

            console.log("call_changed:",call);

            switch(call._lastStatusCode) {
                case "PJSIP_SC_OK":
                if (this.props.endpoint.epCallStatus == 'ringing') {
                    const callStartTime = moment();
                    this.callDurationInterval = setInterval(() => {
                        this.callDuration(callStartTime);
                    },1000);
                }
                this.props.epPjsipOnCallChanged({ epCallStatus: 'oncall'});
                break;
                default: 
                this.props.epPjsipOnCallChanged({ epCallStatus: 'ringing', epCallDirection: 'OUT', call});
                break;
            }

        });

        pjendpoint.on("call_terminated", (call) => {

            console.log("call_terminated:",call);

            this.props.epPjsipOnCallTerminated({
                _whatToShow: 'dialpad',
                epCallStatus: 'idle',
                epCallDirection:'idle',
                epCallDuration: '0:0:0',
                callNumber: '',
                countryCode: '',
                call: null,
                mute: false,
                speaker: false,
                hold: false
            });
            clearInterval(this.callDurationInterval);
        });

        pjendpoint.on("call_screen_locked", (call) => {
            console.log("call_screen_locked:",call);
            this.props.epPjsipOnCallScreenLocked(call);
        }); // Android only

    }

    callDuration = (callStartTime) => {

        const toB = moment();
        const duration = moment(toB.diff(callStartTime));
        this.props.epPjsipOnCallDuration({epCallDuration: duration.format('mm:ss')});

    }

    render() { 
        return (
            <Root>
                <Container>
                    <Navigator/>
                </Container>
            </Root>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        endpoint: state.endpoint,
        other: state.other
    }
}
export default connect(mapStateToProps,{epPjsipInit, epPjsipOnRegistrationChanged, epPjsipOnConnectivityChanged, epPjsipOnCallReceived, epPjsipOnCallChanged, epPjsipOnCallTerminated, epPjsipOnCallScreenLocked, epPjsipOnCallDuration, otherDevToken })(Entrypoint);