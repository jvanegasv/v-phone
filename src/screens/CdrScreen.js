import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import {Text, Toast, ListItem, Left, Thumbnail, Body, Right, Button, Icon, Card, CardItem, Row, Col} from 'native-base';
import Modal from "react-native-modal";

var Sound = require('react-native-sound');

import HeaderComponent from '../components/HeaderComponent';
import LoadingComponent from '../components/LoadingComponent';

import { connect } from 'react-redux';

import axios from 'axios';

import moment from 'moment';
import numeral from 'numeral';

class CdrScreen extends Component {

    state = {
        data: [],
        _loading: false,
        page: 0,
        showModal: false,
        pcall: {},
        playState: 'EMPTY'
    }

    player = null;

    loadData = async () => {

        if (this.state.page >= 0) {
            const postData = new FormData();
            postData.append('page',this.state.page);
            postData.append('pcall_date_from','2000-01-01');
            postData.append('pcall_date_to','2100-12-31');

            console.log('postdata: ',postData);

            this.state._loading = true;
            try {
        
                const response = await axios({
                    url: 'https://voip-communications.net/api-v2/index.php/ionic/callcdr',
                    method: 'POST',
                    data: postData,
                    auth: {
                        username: this.props.user.user_api_key,
                        password: this.props.user.user_api_pwd
                    }
                });
    
                if (response.data.error) {
                    Toast.show({
                        text: response.data.error_message,
                        type: "danger"
                    })
                } else {
                    this.setState({
                        data: [...this.state.data,...response.data.cdr], 
                    },() => {
                        this.setState({
                            _loading: false,
                            page: response.data.cdr.length > 0 ? this.state.page + 1: -1
                        });
                    });
                }
            }
            catch(e) {
        
                this.setState({_loading: false});
    
                Toast.show({
                    text: "" + e,
                    type: "danger"
                })
            }
        }

    }

    componentDidMount() {

        this.loadData();
        
    }

    renderCdr = (cdrItem) => {

        const country = cdrItem.pcall_from_country != ''? cdrItem.pcall_from_country : cdrItem.pcall_to_country;
        const direction = (cdrItem.pcall_from.length > cdrItem.pcall_to.length)? 'OUT': 'IN';
        const number = (direction == 'OUT')? cdrItem.pcall_to: cdrItem.pcall_from;
        const duration = (cdrItem.pcall_billed / 60);
        const cost = (cdrItem.pcall_sale * 1) + (cdrItem.pcall_sale_child * 1);
        return (
            <ListItem thumbnail>
                <Left>
                    <Thumbnail source={{ uri: 'https://voip-communications.net/countries-flags/' + country + '.png' }} />
                </Left>
                <Body>
                    <Text>{this.searchInContacts(number)} (Call {direction == 'IN'? 'from': 'to'})</Text>
                    <Text note numberOfLines={1}>{ moment(cdrItem.pcall_date_start).format('MM/DD/YYYY hh:mm A')}</Text>
                    <Text note numberOfLines={1}>{duration} Min - ${numeral(cost).format('0,0.00')}</Text>
                </Body>
                <Right style={{flexDirection:'row'}}>
                    {this.renderPlayRecBtn(cdrItem)}
                    <Button transparent onPress={() => this.props.navigation.navigate('Phone',{callTo: number})}>
                        <Icon name='call'/>
                    </Button>
                </Right>
            </ListItem>
        )

    }

    renderPlayRecBtn = (cdrItem) => {

        if (cdrItem.pcall_rec_url !== '') {
            return (
                <Button transparent onPress={() => this.setState({showModal: true, playing: false, pcall: cdrItem})}>
                    <Icon name='play'/>
                </Button>
            )
        }
        return null;

    }

    renderPlayRecControls = () => {

        if (this.state.pcall.pcall_id) {
            return (
                <Row>
                    {this.state.playState == 'EMPTY' || this.state.playState == 'PAUSED' || this.state.playState == 'STOPED'? (
                        <Col>
                            <Button block rounded bordered onPress={() => this.playPauseRecord()}>
                                <Icon name='play'/>
                            </Button>
                        </Col>
                    ) : null}
                    {this.state.playState == 'PLAYING'? (
                        <Col>
                            <Button block rounded bordered warning onPress={() => this.playPauseRecord()}>
                                <Icon name='pause'/>
                            </Button>
                        </Col>
                    ) : null}
                    {this.state.playState == 'PLAYING' || this.state.playState == 'PAUSED'? (
                        <Col>
                            <Button block rounded bordered danger onPress={() => this.stopRecord()}>
                                <Icon name='square'/>
                            </Button>
                        </Col>
                    ) : null}
                </Row>
            );
        }
        return null;
    }

    playPauseRecord = () => {

        switch(this.state.playState) {
            case 'PLAYING':
            this.player.pause();
            this.setState({playState: 'PAUSED'});
            break;
            case 'PAUSED':
            this.player.play();
            this.setState({playState: 'PLAYING'});
            break;
            case 'STOPED':
            this.player.play();
            this.setState({playState: 'PLAYING'});
            case 'EMPTY':
            this.player = new Sound(this.state.pcall.pcall_rec_url, null, (error) => {
                if (error) {
                    // do something
                }
                // play when loaded
                this.player.play(() => {
                    console.log('esta fiesta se acabo.');
                    this.closeModal();
                });
                this.setState({playState: 'PLAYING'});
            });
            break;
        }

    }    

    stopRecord = () => {

        if (this.state.playState != 'EMPTY') {
            this.player.stop();
            this.setState({playState: 'STOPED'});
        }
    }

    closeModal = () => {

        this.player.stop();
        this.setState({showModal: false, playState: 'EMPTY', pcall: {}});
    }

    searchInContacts = (number) => {

        toReturn = number;
        try {
            this.props.contacts.forEach(element => {
                if (element.pnumbers.indexOf(number.slice(-7)) >= 0) {
                    toReturn = element.givenName + ' ' + element.familyName + ' (' + number + ')';
                    throw 'Encontrado';
                }
            });
        } catch(e){
            console.log('Encontrado');
        }

        return toReturn;
    }

    render() { 

        return (
            <View>
                <HeaderComponent title="History" toggleDrawer navigation={this.props.navigation}/>
                <FlatList
                    data={this.state.data}
                    renderItem={({item}) => this.renderCdr(item)}
                    keyExtractor={item => item.pcall_id}
                    ListFooterComponent={this.state._loading? <LoadingComponent text="Loading data..."/>: null}
                    onEndReached={() => this.loadData()}
                />
                <View style={{flex: 1,justifyContent: "center",alignItems: "center"}}>
                    <Modal isVisible={this.state.showModal}>
                        <Card>
                            <CardItem header bordered>
                                <Text>Play call recording</Text>
                            </CardItem>
                            <CardItem bordered>
                                {this.renderPlayRecControls()}
                            </CardItem>
                            <CardItem footer bordered>
                                <Button block primary onPress={() => this.closeModal()}>
                                    <Text>Close</Text>
                                </Button>
                            </CardItem>
                        </Card>
                    </Modal>
                </View>
            </View>  
        );
    }
}

const mapStateToProps = (state) => {

    return {
        user: state.user,
        contacts: state.other.contacts
    }
}
 
export default connect(mapStateToProps)(CdrScreen);