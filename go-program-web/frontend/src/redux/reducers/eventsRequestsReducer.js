import { ADMIN_GET_ALL_EVENTS_REQUESTS_SUCCESS, ADMIN_GET_ACTIVE_EVENTS_FAILED, ADMIN_GET_ALL_EVENTS_REQUESTS_FAILED} from '../actions/types';

const initialState = {
    events: [],
    getResponseMessage: "",
    updateResponseMessage: ""
};

const eventsRequestsReducer = (state = initialState, action) => {
    switch(action.type){
        case ADMIN_GET_ALL_EVENTS_REQUESTS_SUCCESS:
            return {
                ...state,
                events: initialState.events.concat(action.payload.events),
                getResponseMessage: ""
            }
        case ADMIN_GET_ALL_EVENTS_REQUESTS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message
            }
        default:
            return state;
    }
}

export default eventsRequestsReducer;