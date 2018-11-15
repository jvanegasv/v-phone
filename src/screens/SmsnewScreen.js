import React, { Component } from 'react';
import { View } from 'react-native';
import { Header, Left, Right, Body, Button, Icon, Title, Text } from 'native-base';

// import HeaderComponent from '../components/HeaderComponent';

class SmsnewScreen extends Component {
    render() { 
        return (
            <View>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                            <Text>Messages</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Chat</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
                            <Icon name='menu' />
                        </Button>
                    </Right> 
                </Header>
                <Text>SmsnewScreen</Text>
            </View>
        );
    }
}
 
export default SmsnewScreen;