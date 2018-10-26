import React, { Component } from 'react';
import { WebView } from 'react-native';
import { Content } from 'native-base';

import HeaderComponent from '../components/HeaderComponent';
import LoadingComponent from '../components/LoadingComponent';

import { connect } from 'react-redux';

class AboutScreen extends Component {

    state = {
        _loading: true,
        appCode: 'MasterDial',
        appVersion: 'v1.0.0'
    }

    render() { 
        return (  
            <Content contentContainerStyle={{ flex: 1 }}>
                <HeaderComponent title="About" toggleDrawer navigation={this.props.navigation}/>
                {this.state._loading? <LoadingComponent/>: null}
                <WebView 
                    source={{ uri: 'https://voip-communications.net/api-v2/index.php/appinfo/about/'+ this.props.user.user_api_key +'/'+ this.props.user.user_api_pwd +'/' + this.state.appCode + '/' + this.state.appVersion }} 
                    onLoadEnd={() => this.setState({_loading: false})}
                />
            </Content>
        );
    }
}
 
const mapStateToProps = (state) => {

    return {
        user: state.user
    }
}
export default connect(mapStateToProps)(AboutScreen);