import { REQUESTS_GET_ALL_SUGGESTED_EVENTS_SUCCESS, REQUESTS_GET_ALL_SUGGESTED_EVENTS_FAILED, 
    REQUESTS_UPDATE_SUGGESTED_EVENT_STATUS_SUCCESS, REQUESTS_UPDATE_SUGGESTED_EVENT_STATUS_FAILED, 
    REQUESTS_SUGGESTED_EVENT_ADD_COMMENT_SUCCESS, REQUESTS_SUGGESTED_EVENT_ADD_COMMENT_FAILED,
    RESET_REQUESTS_SUGGESTED_EVENT_ADD_COMMENT_RESPONSE} from '../actions/types';

const initialState = {
    events: [],
    getResponseMessage: "",
    getResponseStatus: "success",
    updateResponseMessage: "",
    updateResponseStatus: "success",
    updatedEvent: "",
    addCommentResponseMessage: "",
    addCommentResponseStatus: "success"
};

const suggestedEventsRequestsReducer = (state = initialState, action) => {
    switch(action.type){
        case REQUESTS_GET_ALL_SUGGESTED_EVENTS_SUCCESS:
            return {
                ...state,
                events: initialState.events.concat(action.payload.events),
                getResponseMessage: "",
                getResponseStatus: "success"
            }
        case REQUESTS_GET_ALL_SUGGESTED_EVENTS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message,
                getResponseStatus: "failed"
            }
        case REQUESTS_UPDATE_SUGGESTED_EVENT_STATUS_SUCCESS:
            var events = state.events.map(event => {
                if(event._id === action.payload.event._id){
                    return action.payload.event;
                }
                // Leave every other item unchanged
                return event;
            });
            return {
                ...state,
                events,
                updateResponseMessage: action.payload.message,
                updateResponseStatus: "success",
                updatedEvent: action.payload.event._id
            }
        case REQUESTS_UPDATE_SUGGESTED_EVENT_STATUS_FAILED:
            return {
                ...state,
                updateResponseMessage: action.payload.message,
                updateResponseStatus: "failed",
                updatedEvent: action.payload.id
            }
        case REQUESTS_SUGGESTED_EVENT_ADD_COMMENT_SUCCESS:
            var events = state.events.map(event => {
                if(event._id === action.payload.event._id){
                    return action.payload.event;
                }
                // Leave every other item unchanged
                return event;
            });
            return {
                ...state,
                events,
                addCommentResponseMessage: action.payload.message,
                addCommentResponseStatus: "success"
            }
        case REQUESTS_SUGGESTED_EVENT_ADD_COMMENT_FAILED:
            return {
                ...state,
                addCommentResponseMessage: action.payload.message,
                addCommentResponseStatus: "failed"
            }
        case RESET_REQUESTS_SUGGESTED_EVENT_ADD_COMMENT_RESPONSE:
            return {
                ...state,
                addCommentResponseMessage: "",
                addCommentResponseStatus: "success"
            }
        default:
            return state;
    }
}

export default suggestedEventsRequestsReducer;