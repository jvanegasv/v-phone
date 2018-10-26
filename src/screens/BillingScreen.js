import React, { Component } from 'react';
import { WebView } from 'react-native';
import { Content } from 'native-base';

import HeaderComponent from '../components/HeaderComponent'
import LoadingComponent from '../components/LoadingComponent'

import { connect } from 'react-redux';

class BillingScreen extends Component {

    state = {
        _loading: true
    }

    render() {

        return (
            <Content contentContainerStyle={{ flex: 1 }}>
                <HeaderComponent title="Billing" toggleDrawer navigation={this.props.navigation}/>
                {this.state._loading? <LoadingComponent/>: null}
                <WebView 
                    source={{ uri: 'https://voip-communications.net/api-v2/index.php/rnpaypal/step1/' + this.props.user.user_api_key + '/' + this.props.user.user_api_pwd }} 
                    onLoadEnd={() => this.setState({_loading: false})}
                />
            </Content>
        )
    }

}

const mapStateToProps = (state) => {

    return {
        user: state.user
    }
}
export default connect(mapStateToProps)(BillingScreen);