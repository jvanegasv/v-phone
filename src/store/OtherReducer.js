const INITIAL_STATE = {
    countries: [],
    contacts: [],
    devToken: '',
    timezones: []
}

export default (state = INITIAL_STATE, action) => {

    const { type, data} = action;
    switch(type) {
        case "OTHER_COUNTRIES":
        return {...state, countries: data};
        case "OTHER_TIMEZONES":
        return {...state, timezones: data};
        case "OTHER_CONTACTS":
        return {...state, contacts: data};
        case "OTHER_DEVTOKEN":
        return {...state, devToken: data};
        default:
        return state;
    }

}