import { REQUESTS_GET_ALL_EVENTS_SUCCESS, REQUESTS_GET_ALL_EVENTS_FAILED,
    REQUESTS_EVENT_SELECT_CHANGE, REQUESTS_UPDATE_EVENT_STATUS_SUCCESS, 
    REQUESTS_UPDATE_EVENT_STATUS_FAILED, 
    REQUESTS_EVENT_ADD_COMMENT_SUCCESS,
    REQUESTS_EVENT_ADD_COMMENT_FAILED} from '../actions/types';

const initialState = {
    events: [],
    getResponseMessage: "",
    updateResponseMessage: "",
    updatedEvent: "",
    addCommentResponseMessage: ""
};

const eventsRequestsReducer = (state = initialState, action) => {
    switch(action.type){
        case REQUESTS_GET_ALL_EVENTS_SUCCESS:
            return {
                ...state,
                events: initialState.events.concat(action.payload.events),
                getResponseMessage: ""
            }
        case REQUESTS_GET_ALL_EVENTS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message
            }
        case REQUESTS_EVENT_SELECT_CHANGE:
            var events = state.events.map(event => {
                // Find a item with the matching id
                if(event._id == action.payload.id){
                    //Return a new object
                    return{
                        ...event, //copy the existing item
                        ["status"]: action.payload.value //replace the name with new name
                    }
                }
                // Leave every other item unchanged
                return event;
            });
            return {
                ...state,
                events
            }
        case REQUESTS_UPDATE_EVENT_STATUS_SUCCESS:
            var events = state.events.map(event => {
                if(event._id == action.payload.event._id){
                    return action.payload.event;
                }
                // Leave every other item unchanged
                return event;
            });
            return {
                ...state,
                events,
                updateResponseMessage: action.payload.message,
                updatedEvent: action.payload.event._id
            }
        case REQUESTS_UPDATE_EVENT_STATUS_FAILED:
            return {
                ...state,
                updateResponseMessage: action.payload.message,
                updatedEvent: action.payload.id
            }
        case REQUESTS_EVENT_ADD_COMMENT_SUCCESS:
            var events = state.events.map(event => {
                if(event._id == action.payload.event._id){
                    return action.payload.event;
                }
                // Leave every other item unchanged
                return event;
            });
            return {
                ...state,
                events,
                addCommentResponseMessage: action.payload.message
            }
        case REQUESTS_EVENT_ADD_COMMENT_FAILED:
            return {
                ...state,
                addCommentResponseMessage: action.payload.message
            }
        default:
            return state;
    }
}

export default eventsRequestsReducer;