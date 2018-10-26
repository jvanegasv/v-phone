import React, { Component } from 'react';

import { Header, Left, Right, Body, Button, Icon, Title } from 'native-base';

class HeaderComponent extends Component {

    toggleDrawer(){

        const toggle = this.props.toggleDrawer || false
        
        if (toggle) {
            return(
                <Right>
                    <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
                        <Icon name='menu' />
                    </Button>
                </Right> 
            );
        } else {
            return (
                <Right/>
            );
        }
    }


    render() { 
        return (
            <Header>
                <Left/>
                <Body>
                    <Title>{this.props.title}</Title>
                </Body>
                {this.toggleDrawer()}
            </Header>
        );
    }
}
 
export default HeaderComponent;