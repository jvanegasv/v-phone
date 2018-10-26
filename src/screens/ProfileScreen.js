import React, { Component } from 'react';
import { Alert } from 'react-native';
import {Content, ListItem, Label, Button, Input, Toast, Text, Icon, Picker } from 'native-base';

import HeaderComponent from '../components/HeaderComponent';
import LoadingComponent from '../components/LoadingComponent';

import axios from 'axios';
import numeral from 'numeral';

import { connect } from 'react-redux';
import { usrLogout, usrLogin } from '../store/Actions';

class ProfileScreen extends Component {

    state = {
        _loading: false,
        fname: '',
        lname: '',
        balanceWarning: '0',
        timeZone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    }

    componentDidMount() {
        this.setState({
            fname: this.props.user.user_fname, 
            lname: this.props.user.user_lname, 
            balanceWarning: numeral(this.props.user.user_balance_warning).format('0.00'),
            timeZone: this.props.user.user_timezone
        });
    }

    changePassword = async () => {

        let formValid = true;
    
        let formErrors = [];
        if (this.state.currentPassword == '') {
            formValid = false;
            formErrors.push('The current password is required');
          }
          if (this.state.newPassword == '' || this.state.newPassword.length < 8) {
          formValid = false;
          formErrors.push('The password is required and must be at least 8 characters');
        }
        if (this.state.newPassword !== this.state.confirmPassword) {
          formValid = false;
          formErrors.push('Password did not match');
        }

        if (formValid) {

            const postData = new FormData();
            postData.append('username',this.props.user.user_email);
            postData.append('password',this.state.currentPassword);
            postData.append('new_password',this.state.newPassword);
    
            try {
    
                this.setState({_loading: true});
    
                const response = await axios({
                    url: 'https://voip-communications.net/api-v2/index.php/cms/pwdchange',
                    method: 'POST',
                    data: postData
                });

                if (response.data.error) {
                    Toast.show({
                        text: response.data.error_message,
                        type: "danger"
                    })
                } else {
                    Alert.alert(
                        'Password change',
                        'Password changed successfully, you will have to login again',
                        [
                            {
                                text: 'Ok',
                                onPress: () => {
                                    this.props.usrLogout();
                                    this.props.navigation.navigate('Welcome')
                                }
                            }
                        ]
                    );            
                }
    
                this.setState({_loading: false});
    
            } catch(e) {
    
                this.setState({_loading: false});
                Toast.show({
                    text: "" + e,
                    type: "danger"
                })
        
            }
    
        } else {
            Toast.show({
                text: formErrors.join('; '),
                type: "danger"
              })
        }
    }

    changeUserInfo = async () => {

        let formValid = true;
    
        let formErrors = [];
        if (this.state.fname == '') {
            formValid = false;
            formErrors.push('First name is required');
        }
        if (this.state.lname == '') {
            formValid = false;
            formErrors.push('Last name is required');
        }
        if (this.state.balanceWarning == '') {
            formValid = false;
            formErrors.push('Balance warning is required');
        }

        if (formValid) {

            const postData = new FormData();
            postData.append('user_id',this.props.user.user_id);
            postData.append('user_fname',this.state.fname);
            postData.append('user_lname',this.state.lname);
            postData.append('user_balance_warning',this.state.balanceWarning);
            postData.append('user_timezone',this.state.timeZone);
    
            try {
    
                this.setState({_loading: true});
    
                const response = await axios({
                    url: 'https://voip-communications.net/api-v2/index.php/cms/user',
                    method: 'POST',
                    auth: {
                        username: this.props.user.user_api_key,
                        password: this.props.user.user_api_pwd
                    },
                    data: postData
                });

                console.log('respuesta: ', response.data);
                if (response.data.error) {
                    Toast.show({
                        text: response.data.error_message,
                        type: "danger"
                    });
                } else {
                    this.props.usrLogin(response.data.user);
                }
    
                this.setState({_loading: false});
    
            } catch(e) {
    
                this.setState({_loading: false});
                Toast.show({
                    text: "" + e,
                    type: "danger"
                })
        
            }
    
        } else {
            Toast.show({
                text: formErrors.join('; '),
                type: "danger"
              })
        }
    }

    render() { 
        if (this.state._loading) {
            return <LoadingComponent text="Please wait..."/>
        }
        return (  
            <Content>
                <HeaderComponent title="Profile" toggleDrawer navigation={this.props.navigation}/>
                    <ListItem fixedLabel>
                        <Label>First name:</Label>
                        <Input value={this.state.fname} onChangeText={fname => this.setState({fname})} style={{ textAlign: 'right' }}/>
                    </ListItem>
                    <ListItem fixedLabel>
                        <Label>Last name:</Label>
                        <Input value={this.state.lname} onChangeText={lname => this.setState({lname})} style={{ textAlign: 'right' }}/>
                    </ListItem>
                    <ListItem fixedLabel>
                        <Label>Low balance warning: $</Label>
                        <Input value={this.state.balanceWarning} onChangeText={balanceWarning => this.setState({balanceWarning: balanceWarning.replace(/\D/g, '')})} keyboardType="numeric" style={{ textAlign: 'right' }}/>
                    </ListItem>
                    <ListItem picker>
                        <Label>Time zone: </Label>
                        <Icon name='globe'/>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="ios-arrow-down-outline" />}
                            selectedValue={this.state.timeZone}
                            onValueChange={(value) => this.setState({timeZone: value})}
                        >
                            {
                                this.props.timezones.map((tz) => <Picker.Item key={tz.tmz_value} label={tz.tmz_value} value={tz.tmz_value} />)
                            }
                        </Picker>
                    </ListItem>
                    <Button block onPress={() => this.changeUserInfo()}>
                        <Text>Save changes</Text>
                    </Button>
                    <ListItem fixedLabel>
                        <Label>Current Password:</Label>
                        <Input value={this.state.currentPassword} onChangeText={currentPassword => this.setState({currentPassword})} secureTextEntry style={{ textAlign: 'right' }}/>
                    </ListItem>
                    <ListItem fixedLabel>
                        <Label>New Password:</Label>
                        <Input value={this.state.newPassword} onChangeText={newPassword => this.setState({newPassword})} secureTextEntry style={{ textAlign: 'right' }}/>
                    </ListItem>
                    <ListItem fixedLabel>
                        <Label>Confirm Password:</Label>
                        <Input value={this.state.confirmPassword} onChangeText={confirmPassword => this.setState({confirmPassword})} secureTextEntry style={{ textAlign: 'right' }}/>
                    </ListItem>
                    <Button block danger onPress={() => this.changePassword()}>
                        <Text>Change password</Text>
                    </Button>
            </Content>
        );
    }
}
 
const mapStateToProps = state => {

    return {
        user: state.user,
        timezones: state.other.timezones
    }
}
export default connect(mapStateToProps,{usrLogout, usrLogin})(ProfileScreen);