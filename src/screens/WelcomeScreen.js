import React, { Component } from 'react';
import { Platform } from 'react-native';
import { Content } from 'native-base';
import HeaderComponent from '../components/HeaderComponent';
import LoadingComponent from '../components/LoadingComponent';

import axios from 'axios';

import { connect } from 'react-redux';
import { usrLogin, usrLogout, epSet, otherCountries, otherTimezones } from '../store/Actions';

class WelcomeScreen extends Component {

    state = {
        _loading: true
    }

    componentDidMount() {

        if (!this.props.user._logedIn) {
            this.props.navigation.navigate('loginStack');
        } else {
            this.initialValidations();
        }
        
    }

    initialValidations = async () => {

        credentialsOk = false;

        const postData = new FormData();
        postData.append('username',this.props.user.user_email);
        postData.append('password',this.props.user.password);

        try {

            console.log('welcomesreen postdata', postData);
            const response = await axios({
                url: 'https://voip-communications.net/api-v2/index.php/cms/login',
                method: 'POST',
                data: postData
            });
    
            if (!response.data.error) {
                credentialsOk = true;
                this.props.usrLogin(response.data.user);
                this.props.epSet(response.data.endpoint);
    
                const misc = await axios({
                    url: 'https://voip-communications.net/api-v2/index.php/ionic/misc',
                    method: 'GET'
                });
                this.props.otherCountries(misc.data.countries);
                this.props.otherTimezones(misc.data.timezones);

                const postPushData = new FormData();
                postPushData.append('token',this.props.other.devToken);
                postPushData.append('platformOS',Platform.OS);
                postPushData.append('platformVersion',Platform.Version);
                axios({
                    url: 'https://voip-communications.net/api-v2/index.php/pushnotifications/register',
                    method: 'POST',
                    auth: {
                        username: this.props.user.user_api_key,
                        password: this.props.user.user_api_pwd
                    },
                    data: postPushData
                });

            } else {
                this.props.usrLogout();
            }

            
        }
        catch (e) {
            console.log('ERROR:',e);
        }
        
        if (credentialsOk) {
            this.props.navigation.navigate('appDrawer');
        } else {
            this.props.navigation.navigate('loginStack');
        }

    }

    render() { 

        return (  
            <Content>
                <HeaderComponent title="V-Phone"/>
                <LoadingComponent title="Welcome, loading data. Please wait..."/>
            </Content>
        );
    }
}
 
const mapStateToProps = (state) => {

    return {
        user: state.user,
        other: state.other
    }
}

export default connect(mapStateToProps,{usrLogin, usrLogout, epSet, otherCountries, otherTimezones})(WelcomeScreen);