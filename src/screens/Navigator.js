import React from 'react';

import { createSwitchNavigator, createStackNavigator, createBottomTabNavigator, createDrawerNavigator } from 'react-navigation';
import { Icon } from 'native-base';

import Drawer from './Drawer';

import BillingScreen from './BillingScreen';
import CdrScreen from './CdrScreen';
import ContactsScreen from './ContactsScreen';
import LoginScreen from './LoginScreen';
import PhoneScreen from './PhoneScreen';
import PhoneScreen2 from './PhoneScreen2';
import RegisterScreen from './RegisterScreen';
import SettingsScreen from './SettingsScreen';
import SmsScreen from './SmsScreen';
import SmschatScreen from './SmschatScreen';
import WelcomeScreen from './WelcomeScreen';
import RateScreen from './RateScreen';
import ProfileScreen from './ProfileScreen';

const loginNavigation = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen
});

const smsNavigation = createStackNavigator({
    smsSummary: SmsScreen,
    smsChat: SmschatScreen
},{
    initialRouteName: "smsSummary",
    headerMode: "none"
});

const mainTabsNavigation = createBottomTabNavigator({
    // Phone: PhoneScreen2,
    Phone: PhoneScreen,
    Messages: smsNavigation,
    History: CdrScreen,
    Contacts: ContactsScreen
},
{
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch(routeName) {
            case "Phone":
            iconName = 'call';
            break;
            case "Messages":
            iconName = 'chatbubbles';
            break;
            case "History":
            iconName = 'paper';
            break;
            case "Contacts":
            iconName = 'person';
            break;
        }
        iconColor = focused? 'blue' : 'gray';
  
        return <Icon name={iconName} style={{color:iconColor}} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'blue',
      inactiveTintColor: 'gray',
    },
  }
);

const mainNavigation = createDrawerNavigator({
    Home: mainTabsNavigation,
    Rate: RateScreen,
    Billing: BillingScreen,
    Profile: ProfileScreen,
    Settings: SettingsScreen
},{
   initialRouteName: 'Home',
   contentComponent: props => <Drawer navigation={props.navigation}/>
});

const Navigator = createSwitchNavigator({
    Welcome: WelcomeScreen,
    loginStack: loginNavigation,
    appDrawer: mainNavigation
}, {
    initialRouteName: 'Welcome',
});

export default Navigator;