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
        case "SMS_CHAT_INIT":
        return {...state,chatKey: data.chatKey, chatMessages: data.messages};
        case "SMS_CHAT_EARLIER":
        return {...state,chatMessages: [...state.chatMessages,...data]}
        case "SMS_CHAT_ADD":
        return{...state,chatMessages: [data,...state.chatMessages]}
        default:
        return state;
    }

}