import React, { Component } from 'react';
import { Content, Text, Button, Form, Item, Input, Label, Toast } from 'native-base';
import LoadingComponent from '../components/LoadingComponent'

import axios from 'axios'

import { connect } from 'react-redux'
import { usrLogin, usrPassword, epSet } from '../store/Actions'

class RegisterScreen extends Component {

    static navigationOptions = {
        title: 'V-Phone :: Register',
    };
    
    state = {
        showModal: false,
        loading: false,
        user_fname: '',
        user_lname: '',
        user_email: '',
        user_pwd: '',
        user_pwd2: ''
    }
    
    doRegister = async () => {

        let formValid = true;
    
        let formErrors = [];
        if (this.state.user_fname === '') {
          formValid = false;
          formErrors.push('First name is required')
        }
        if (this.state.user_lname === '') {
          formValid = false;
          formErrors.push('Last name is required')
        }
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(this.state.user_email) === false) {
          formValid = false;
          formErrors.push('Invalid email address')
        }
        if (this.state.user_pwd == '' || this.state.user_pwd.length < 8) {
          formValid = false;
          formErrors.push('The password is required and must be at least 8 characters')
        }
        if (this.state.user_pwd !== this.state.user_pwd2) {
          formValid = false;
          formErrors.push('Password did not match')
        }
    
        if (formValid) {
          const postData = new FormData();
          postData.append('user_fname',this.state.user_fname);
          postData.append('user_lname',this.state.user_lname);
          postData.append('user_email',this.state.user_email);
          postData.append('user_password',this.state.user_pwd);
      
          this.setState({loading: true})
    
          try {
    
            const response = await axios({
              url: 'https://voip-communications.net/api-v2/index.php/cms/newuser',
              method: 'post',
              data: postData
            });
        
            this.setState({loading: false})
      
            if (response.data.error) {
              Toast.show({
                text: response.data.error_message,
                type: "danger"
              })      
            } else {
              this.props.usrLogin(response.data.user);
              this.props.usrPassword(this.state.user_pwd);
              this.props.epSet(response.data.endpoint);  
              this.props.navigation.navigate('Welcome')
            }
    
          } catch(e) {
    
            this.setState({loading: false})
    
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

        if (this.state.loading) {
            return <LoadingComponent text="Registering new user, please wait..."/>
        } 
          
        return (
            <Content padder>
                <Form>
                    <Item fixedLabel>
                        <Label>First name</Label>
                        <Input value={this.state.user_fname} onChangeText={user_fname => this.setState({user_fname})}/>
                    </Item>
                    <Item fixedLabel>
                        <Label>Last name</Label>
                        <Input value={this.state.user_lname} onChangeText={user_lname => this.setState({user_lname})}/>
                    </Item>
                    <Item fixedLabel>
                        <Label>Email</Label>
                        <Input value={this.state.user_email} onChangeText={user_email => this.setState({user_email})}/>
                    </Item>
                    <Item fixedLabel last>
                        <Label>Password</Label>
                        <Input value={this.state.user_pwd} onChangeText={user_pwd => this.setState({user_pwd})} secureTextEntry/>
                    </Item>
                    <Item fixedLabel last>
                        <Label>Confirm Password</Label>
                        <Input value={this.state.user_pwd2} onChangeText={user_pwd2 => this.setState({user_pwd2})} secureTextEntry/>
                    </Item>
                    <Text></Text>
                    <Button block rounded primary onPress={this.doRegister}>
                        <Text>Register new user</Text>
                    </Button>
                </Form>
            </Content>
        );
    }
}

export default connect(null,{usrLogin, usrPassword, epSet})(RegisterScreen);