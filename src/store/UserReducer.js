const INITIAL_STATE = {
    _logedIn: false,
    password: ''
}

export default (state = INITIAL_STATE, action) => {

    const { type, data} = action;
    switch(type) {
        case "USR_LOGIN":
        return {...state, _logedIn: true, ...data};
        case "USR_PASSWORD":
        return {...state, password: data}
        case "USR_LOGOUT":
        return INITIAL_STATE;
        default:
        return state;
    }

}