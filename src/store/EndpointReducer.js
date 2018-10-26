const INITIAL_STATE = {
    accountRegistered: false
}

export default (state = INITIAL_STATE, action) => {

    const { type, data} = action;
    switch(type) {
        case "EP_PJSIPINIT":
        return {accountRegistered: false, pjsip: data}
        case "EP_SET":
        return {...state,...data}
        case "EP_PJSIPACCOUNT":
        return {...state, 
            accountRegistered: true,
            account: data,
            _whatToShow: 'loading',
            epStatus:'offLine',
            epCallStatus: 'idle',
            epCallDirection:'idle',
            epCallDuration: '0:0:0',
            callNumber: '',
            countryCode: '',
            call: null,
            mute: false,
            speaker: false,
            hold: false}
        case "EP_PJSIPOnRegistrationChanged":
        return {...state,...data}
        case "EP_PJSIPOnConnectivityChanged":
        return {...state}
        case "EP_PJSIPOnCallReceived":
        return {...state}
        case "EP_PJSIPOnCallChanged":
        return {...state,...data}
        case "EP_PJSIPOnCallTerminated":
        return {...state,...data}
        case "EP_PJSIPOnCallScreenLocked":
        return {...state}
        case "EP_PJSIPOnCallDuration":
        return {...state,...data}
        case "EP_PJSIPOTHERSTATE":
        return {...state,...data}
        default:
        return state;
    }
    
}