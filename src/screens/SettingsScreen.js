import React, { Component } from 'react';
import { View } from 'react-native';
import { Content, H2, Text, Button, ListItem, Body, Left, Right, CheckBox, Radio, Item, Picker, Icon, Label, Input, Toast } from 'native-base';

import HeaderComponent from '../components/HeaderComponent'
import LoadingComponent from '../components/LoadingComponent';

import { connect } from 'react-redux';
import { usrLogout, epSet } from '../store/Actions';

import axios from 'axios';

class SettingsScreen extends Component {

    state = {
        _loading: false,
        playBalance: 'Y',
        playMinutes: 'Y',
        record:'ALWAYS',
        countryCode: '',
        areaCode: '',
        callerId: ''
    }

    componentDidMount() {

        this.setState({
            playBalance: this.props.endpoint.outbound.outbound.play_balance,
            playMinutes: this.props.endpoint.outbound.outbound.play_minutes,
            record: this.props.endpoint.outbound.outbound.rec,
            countryCode: this.props.endpoint.endpoint_country,
            areaCode: this.props.endpoint.endpoint_areacode,
            callerId: this.props.endpoint.endpoint_callerid
        })
    }

    phoneSettings = () => {

        if (this.state._loading) {
            return <LoadingComponent text="Saving data, please wait"/>
        }
        return (
            <View>
                <ListItem>
                    <H2>Outbound Calls</H2>
                </ListItem>
                <ListItem>
                    <CheckBox checked={this.state.playBalance == 'Y'? true: false} onPress={() => this.setState({playBalance: this.state.playBalance == 'Y'? 'N' : 'Y'})} />
                    <Body>
                        <Text>Play balance</Text>
                    </Body>
                </ListItem>                    
                <ListItem>
                    <CheckBox checked={this.state.playMinutes == 'Y'? true: false} onPress={() => this.setState({playMinutes: this.state.playMinutes == 'Y'? 'N': 'Y'})} />
                    <Body>
                        <Text>Play minutes available</Text>
                    </Body>
                </ListItem> 
                <ListItem>
                    <H2>Record phone call</H2>
                </ListItem>                   
                <ListItem onPress={() => this.setState({record: 'NEVER'})} >
                    <Left>
                        <Text>Never</Text>
                    </Left>
                    <Right>
                        <Radio selected={this.state.record == 'NEVER'? true: false}/>
                    </Right>
                </ListItem>
                <ListItem onPress={() => this.setState({record: 'ALWAYS'})} >
                    <Left>
                        <Text>Always</Text>
                    </Left>
                    <Right>
                        <Radio selected={this.state.record == 'ALWAYS'? true: false}/>
                    </Right>
                </ListItem>
                <ListItem onPress={() => this.setState({record: 'ON-DEMAND'})} >
                    <Left>
                        <Text>On-Demand (*)</Text>
                    </Left>
                    <Right>
                    <Radio selected={this.state.record == 'ON-DEMAND'? true: false}/>
                    </Right>
                </ListItem>
                <ListItem>
                    <H2>Calls as:</H2>
                </ListItem>
                <ListItem picker>
                    <Text>Country:</Text>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                        selectedValue={this.state.countryCode}
                        onValueChange={(value) => this.setState({countryCode: value})}
                    >
                        <Picker.Item key="XX" label="Select a country" value="" />
                        {
                            this.props.countries.map((country) => <Picker.Item key={country.country_code_2} label={country.country_name + '(' + country.country_e164 + ')'} value={country.country_code_2} />)
                        }
                    </Picker>
                </ListItem>
                <ListItem fixedLabel>
                    <Label>Area code:</Label>
                    <Input value={this.state.areaCode} onChangeText={areaCode => this.setState({areaCode: areaCode.replace(/\D/g, '')})} maxLength={3} keyboardType="numeric" style={{ textAlign: 'right' }}/>
                </ListItem>
                <ListItem fixedLabel>
                    <Label>Caller Id:</Label>
                    <Input value={this.state.callerId} onChangeText={callerId => this.setState({callerId: callerId.replace(/\D/g, '')})} maxLength={10} keyboardType="numeric" style={{ textAlign: 'right' }}/>
                </ListItem>
                <Button block onPress={() => this.phoneSave()}>
                    <Text>Save changes</Text>
                </Button>
            </View>
        )
    }

    phoneSave = async () => {

        const postData = new FormData();
        postData.append('endpoint_id',this.props.endpoint.endpoint_id);
        postData.append('play_balance',this.state.playBalance);
        postData.append('play_minutes',this.state.playMinutes);
        postData.append('rec',this.state.record);
        postData.append('country',this.state.countryCode);
        postData.append('areacode',this.state.areaCode);
        postData.append('callerid',this.state.callerId);

        try {

            this.setState({_loading: true});

            const response = await axios({
                url: 'https://voip-communications.net/api-v2/index.php/ionic/endpointoutbound',
                method: 'POST',
                data: postData,
                auth: {
                    username: this.props.user.user_api_key,
                    password: this.props.user.user_api_pwd
                }
            });

            this.props.epSet(response.data.endpoint);
            this.setState({_loading: false});

        } catch(e) {

            this.setState({_loading: false});
            Toast.show({
                text: "" + e,
                type: "danger"
            })
    
        }

    }

    render() { 
        return (  
            <Content>
                <HeaderComponent title="Phone call settings" toggleDrawer navigation={this.props.navigation}/>
                {this.phoneSettings()}
            </Content>
        );
    }
}
 
const mapStateToProps = (state) => {

    return {
        endpoint: state.endpoint,
        countries: state.other.countries,
        user: state.user
    }
}
export default connect(mapStateToProps,{usrLogout,epSet})(SettingsScreen);