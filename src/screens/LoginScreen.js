import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import { Content, Text, Button, Form, Item, Input, Label, Toast, H3, Thumbnail } from 'native-base';
import LoadingComponent from '../components/LoadingComponent';

import axios from 'axios';

import { connect } from 'react-redux';
import { usrLogin, usrPassword, epSet } from '../store/Actions';


class LoginScreen extends Component {

    static navigationOptions = {
        title: 'V-Phone :: Login',
      };
    
    state = {
        loading: false,
        email: '',
        password: ''
    }

    doLogin = async () => {

        this.setState({loading: true});
    
        const postData = new FormData();
        postData.append('username',this.state.email)
        postData.append('password',this.state.password)
    
        try {
    
          const response = await axios({
            url: 'https://voip-communications.net/api-v2/index.php/cms/login',
            method: 'POST',
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
            this.props.usrPassword(this.state.password);
            this.props.epSet(response.data.endpoint);
            this.props.navigation.navigate('Welcome');
          }
        }
        catch(e) {
    
          this.setState({loading: false})
    
          Toast.show({
            text: "" + e,
            type: "danger"
          })
        }
    
    }
    
    render() { 

        if (this.state.loading) {
            return <LoadingComponent title="Login, please wait..."/>
        } else {
            return(
                <Content padder>
                <View style={{flexDirection:'row', flex: 1, alignContent:'center', justifyContent:'center'}}>
                  <Thumbnail large source={require('../assets/images/icon-login.jpg')} />
                </View>
                <Form>
                  <Item fixedLabel>
                    <Label>Email</Label>
                    <Input placeholder="user@email.com" value={this.state.email} onChangeText={email => this.setState({email})}/>
                  </Item>
                  <Item fixedLabel last>
                    <Label>Password</Label>
                    <Input value={this.state.password} onChangeText={password => this.setState({password})} secureTextEntry/>
                  </Item>
                  <Text></Text>
                  <Button block rounded primary onPress={this.doLogin}>
                    <Text>Login</Text>
                  </Button>
                  <Text></Text>
                  <Button block bordered rounded info onPress={() => this.props.navigation.navigate('Register')}>
                    <Text>No user? Register here.</Text>
                  </Button>
                  <Text></Text>
                  <Button block bordered rounded info onPress={() => Linking.openURL('https://voip-communications.net/vcw/user-lost-password')}>
                    <Text>Forgot your password?</Text>
                  </Button>
                  <Text></Text>
                  <Text></Text>
                  <Item 
                    style={{flexDirection:'column', alignContent: 'center', justifyContent: 'center'}}
                    onPress={() => Linking.openURL('https://voip-communications.net')}
                  >
                    <H3>Voip-Communications</H3>
                  </Item>
                </Form>
              </Content>
      
            );
        }

    }
}

export default connect(null,{usrLogin, usrPassword, epSet})(LoginScreen);