import React, { Component } from 'react';
import {View, PermissionsAndroid, Platform, FlatList} from 'react-native';
import { ListItem, Text, Button, Icon, Body, Card, CardItem} from 'native-base';

import Contacts from 'react-native-contacts';

import HeaderComponent from '../components/HeaderComponent';
import LoadingComponent from '../components/LoadingComponent';

import underscore from 'underscore';

import { connect } from 'react-redux';
import { otherContacts } from '../store/Actions';

class ContactsScreen extends Component {

    state = {
        _permissions: false,
        _loading: false,
        contacts: []
    }

    componentDidMount() {

        if (this.state.contacts.length == 0) {
            this.chkPermissions();
        }

    }

    chkPermissions = async () => {

        if (Platform.OS !== 'ios') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    'title': 'V-Phone contacts permission',
                    'message': 'V-Phone App needs access to your contacts '
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.setState({_permissions: true});
                this.loadContacts();
            }
        } else {
            Contacts.checkPermission((err, iosgranted) => {
                if (iosgranted == 'authorized') {
                    this.setState({_permissions: true});
                    this.loadContacts();
                } else {
                    Contacts.requestPermission((err, permission) => {
                        if (permission == 'authorized') {
                            this.setState({_permissions: true});
                            this.loadContacts();
                        }
                    });
                }
            });
        }

    }

    loadContacts = async () => {

        await this.setState({_loading: true});

        Contacts.getAll((err, contacts) => {
            contactsTemp = [];
            contacts.forEach(element => {
                if (element.phoneNumbers && element.phoneNumbers.length > 0) {
                    allpnumbers = "";
                    element.phoneNumbers.forEach(pnumber => {
                        allpnumbers = allpnumbers + "|" + pnumber.number.replace(/\D/g, '');
                    });
                    contactsTemp.push({...element,pnumbers: allpnumbers});
                }
            });
            const orderedContacts = underscore.sortBy(contactsTemp,'givenName');
            this.setState({contacts: orderedContacts},() => {
                this.props.otherContacts(orderedContacts);
                this.setState({_loading: false});
            });
        });
    }

    showGiveMePermissions = () => {

        if (this.state._permissions) {
            return null;
        }

        return (
            <Card>
                <CardItem header>
                    <Text style={{color:'red'}}>Contacts access</Text>
                </CardItem>
                <CardItem>
                <Body>
                    <Text>
                    Access to your contacs is required.
                    </Text>
                    <Text/>
                    <Text>
                    If you want to call/text your contacts, please give access to your contacts to V-phone.
                    </Text>
                </Body>
                </CardItem>
                <CardItem footer>
                    <Text>V-Phone</Text>
                </CardItem>
            </Card>
        )
    }

    renderContact = (contact) => {

        return (
            <ListItem>
                <Body>
                    <Text>{contact.givenName} {contact.familyName}</Text>
                    {
                        contact.phoneNumbers.map((pnumber,index) => {
                            return (
                                <View key={index}>
                                    <Button transparent onPress={() => this.props.navigation.navigate('Phone',{callTo: pnumber.number.replace(/\D/g, '')})}>
                                        <Icon name='call'/>
                                        <Text>
                                            {pnumber.label}: {pnumber.number}
                                        </Text>
                                    </Button>
                                </View>
                            )
                        })
                    }
                </Body>
            </ListItem>
        )
    }

    showContacts = () => {

        if (this.state._loading) {
            return <LoadingComponent text="Loading contacs..."/>
        }

        return (
            <FlatList 
                data={this.state.contacts}
                renderItem={({item}) => this.renderContact(item)}
                keyExtractor={(item,index) => index.toString()}
            />            
        );
    }

    render() { 
        return (  
            <View>
                <HeaderComponent title="Contacts" toggleDrawer navigation={this.props.navigation}/>
                {this.showGiveMePermissions()}        
                {this.showContacts()}
            </View>
        );
    }
}
 
export default connect(null,{otherContacts})(ContactsScreen);