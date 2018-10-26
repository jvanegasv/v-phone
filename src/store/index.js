import { combineReducers } from 'redux';

import UserReducer from './UserReducer';
import EndpointReducer from './EndpointReducer';
import OtherReducer from './OtherReducer';

export default combineReducers({
    endpoint: EndpointReducer,
    user: UserReducer,
    other: OtherReducer
});
