export const usrPassword = (password) => {
    return {
        type: "USR_PASSWORD",
        data: password
    }
}

export const usrLogin = (user) => {
    return {
        type: "USR_LOGIN",
        data: user
    }
}

export const usrLogout = () => {
    return {
        type: "USR_LOGOUT"
    }
}

export const epPjsipInit = (pjsip) => {
    return {
        type: "EP_PJSIPINIT",
        data: pjsip
    }
}
export const epSet = (endpoint) => {
    return {
        type: "EP_SET",
        data: endpoint
    }
}
export const epPjsipAccount = (account) => {
    return {
        type: "EP_PJSIPACCOUNT",
        data: account
    }
}

export const epPjsipOnRegistrationChanged = (account) => {
    return {
        type: "EP_PJSIPOnRegistrationChanged",
        data: account
    }
}
export const epPjsipOnConnectivityChanged = (online) => {
    return {
        type: "EP_PJSIPOnConnectivityChanged",
        data: online
    }
}
export const epPjsipOnCallReceived = (call) => {
    return {
        type: "EP_PJSIPOnCallReceived",
        data: call
    }
}
export const epPjsipOnCallChanged = (call) => {
    return {
        type: "EP_PJSIPOnCallChanged",
        data: call
    }
}
export const epPjsipOnCallTerminated = (call) => {
    return {
        type: "EP_PJSIPOnCallTerminated",
        data: call
    }
}
export const epPjsipOnCallScreenLocked = (call) => {
    return {
        type: "EP_PJSIPOnCallScreenLocked",
        data: call
    }
}
export const epPjsipOnCallDuration = (duration) => {
    return {
        type: "EP_PJSIPOnCallDuration",
        data: duration
    }
}
export const epPjsipOtherState = (newState) => {
    return {
        type: "EP_PJSIPOTHERSTATE",
        data: newState
    }
}



export const otherCountries = (countries) => {
    return {
        type: "OTHER_COUNTRIES",
        data: countries
    }
}

export const otherTimezones = (timezones) => {
    return {
        type: "OTHER_TIMEZONES",
        data: timezones
    }
}

export const otherContacts = (contacts) => {
    return {
        type: "OTHER_CONTACTS",
        data: contacts
    }
}

export const otherDevToken = (token) => {
    return {
        type: "OTHER_DEVTOKEN",
        data: token
    }
}