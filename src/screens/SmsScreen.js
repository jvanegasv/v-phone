import React, { Component } from 'react';
import { View} from 'react-native';

import HeaderComponent from '../components/HeaderComponent';
import LoadingComponent from '../components/LoadingComponent';

class SmsScreen extends Component {

    render() { 
        return (  
            <View>
                <HeaderComponent title="Messages" toggleDrawer navigation={this.props.navigation}/>
            </View>
        );
    }
}
 
export default SmsScreen;