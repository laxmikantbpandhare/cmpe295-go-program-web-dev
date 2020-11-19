import { ADMIN_CREATE_EVENT_SUCCESS, ADMIN_CREATE_EVENT_FAILED, ADMIN_GET_EVENTS_SUCCESS,
    ADMIN_GET_EVENTS_FAILED, RESET_ADMIN_EVENT_CREATE_RESPONSE_MESSAGE, ADMIN_EVENT_INPUT_CHANGE,
    ADMIN_EVENT_EDIT_CANCEL, ADMIN_UPDATE_EVENT_SUCCESS, ADMIN_UPDATE_EVENT_FAILED,
    ADMIN_DELETE_EVENT_SUCCESS, ADMIN_DELETE_EVENT_FAILED, ADMIN_EVENT_DATE_CHANGE, 
    ADMIN_GET_ACTIVE_EVENTS_SUCCESS, ADMIN_GET_ACTIVE_EVENTS_FAILED} from '../actions/types';

const initialState = {
    events: [],
    activeEvents:[],
    createResponseMessage: "",
    createResponseStatus: "success",
    getResponseMessage: "",
    getResponseStatus: "success",
    updateResponseMessage: "",
    updateResponseStatus: "success",
    deleteResponseMessage: ""
};

const adminEventsReducer = (state = initialState, action) => {
    switch(action.type){
        case ADMIN_GET_EVENTS_SUCCESS:
            return {
                ...state,
                events: initialState.events.concat(action.payload.events),
                getResponseMessage: "",
                getResponseStatus: "success"
            }
        case ADMIN_GET_EVENTS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message,
                getResponseStatus: "failed"
            }
        case ADMIN_GET_ACTIVE_EVENTS_SUCCESS:
            return {
                ...state,
                activeEvents: initialState.events.concat(action.payload.events),
                getResponseMessage: "",
                getResponseStatus: "success"
            }
        case ADMIN_GET_ACTIVE_EVENTS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message,
                getResponseStatus: "failed"
            }
        case ADMIN_CREATE_EVENT_SUCCESS:
            return {
                ...state,
                events: [action.payload.event, ...state.events],
                createResponseMessage: action.payload.message,
                createResponseStatus: "success"
            }
        case ADMIN_CREATE_EVENT_FAILED:
            return {
                ...state,
                createResponseMessage: action.payload.message,
                createResponseStatus: "failed"
            }
        case RESET_ADMIN_EVENT_CREATE_RESPONSE_MESSAGE:
            return {
                ...state,
                createResponseMessage: "",
                createResponseStatus: "success"
            }
        case ADMIN_EVENT_INPUT_CHANGE:
            var events = state.events.map(event => {
                // Find a event with the matching id
                if(event._id == action.payload.id){
                    //Return a new object
                    return{
                        ...event, //copy the existing event
                        [action.payload.name]: action.payload.value //replace the name with new name
                    }
                }
                // Leave every other menu unchanged
                return event;
            });
            return {
                ...state,
                events
            }
        case ADMIN_EVENT_DATE_CHANGE:
            var events = state.events.map(event => {
                // Find a event with the matching id
                if(event._id == action.payload.id){
                    //Return a new object
                    return{
                        ...event, //copy the existing event
                        ["expiryDate"]: action.payload.date //replace the name with new name
                    }
                }
                // Leave every other menu unchanged
                return event;
            });
            return {
                ...state,
                events
            }
        case ADMIN_EVENT_EDIT_CANCEL:
            var events = state.events.map(event => {
                if(event._id == action.payload.event._id){
                    return action.payload.event;
                }
                // Leave every other event unchanged
                return event;
            });
            return {
                ...state,
                events
            }
        case ADMIN_UPDATE_EVENT_SUCCESS:
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
                updateResponseStatus: "success"
            }
        case ADMIN_UPDATE_EVENT_FAILED:
            return {
                ...state,
                updateResponseMessage: action.payload.message,
                updateResponseStatus: "failed"
            }
        case ADMIN_DELETE_EVENT_SUCCESS:
            var events = state.events.filter(event => event._id !== action.payload.id);
            return {
                ...state,
                events,
                deleteResponseMessage: action.payload.message
            }
        case ADMIN_DELETE_EVENT_FAILED:
            return {
                ...state,
                deleteResponseMessage: action.payload.message
            }
        default:
            return state;
    }
}

export default adminEventsReducer;