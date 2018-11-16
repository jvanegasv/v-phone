const INITIAL_STATE = {
    summary: [],
    chatMessages: [],
    chatKey: ''
}

export default (state = INITIAL_STATE, action) => {

    const { type, data} = action;
    switch(type) {
        case "SMS_INIT":
        return INITIAL_STATE;
        case "SMS_SUMMARY_INIT":
        return {...state,summary: []};
        case "SMS_SUMMARY_ADD":
        return {...state,summary: [...state.summary,...data]}
        default:
        return state;
    }

}