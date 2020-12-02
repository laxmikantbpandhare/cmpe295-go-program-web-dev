import { STUDENT_CREATE_EVENT_SUCCESS, STUDENT_CREATE_EVENT_FAILED, STUDENT_GET_EVENTS_SUCCESS,
    STUDENT_GET_EVENTS_FAILED, RESET_STUDENT_EVENT_CREATE_RESPONSE_MESSAGE, STUDENT_EVENT_INPUT_CHANGE, 
    STUDENT_EVENT_EDIT_CANCEL, STUDENT_UPDATE_EVENT_SUCCESS, STUDENT_UPDATE_EVENT_FAILED, 
    STUDENT_EVENT_ADD_COMMENT_SUCCESS, STUDENT_EVENT_ADD_COMMENT_FAILED,
    RESET_STUDENT_EVENT_ADD_COMMENT_RESPONSE, RESET_STUDENT_EVENT_UPDATE_RESPONSE_MESSAGE} from '../actions/types';

const initialState = {
    events: [],
    createResponseMessage: "",
    createResponseStatus: "success",
    getResponseMessage: "",
    getResponseStatus: "success",
    updateResponseMessage: "",
    updateResponseStatus: "success",
    addCommentResponseMessage: "",
    addCommentResponseStatus: "success",
    updatedEvent: ""
};

const studentEventsReducer = (state = initialState, action) => {
    switch(action.type){
        case STUDENT_GET_EVENTS_SUCCESS:
            return {
                ...state,
                events: initialState.events.concat(action.payload.events),
                getResponseMessage: "",
                getResponseStatus: "success"
            }
        case STUDENT_GET_EVENTS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message,
                getResponseStatus: "failed"
            }
        case STUDENT_CREATE_EVENT_SUCCESS:
            return {
                ...state,
                events: [action.payload.event, ...state.events],
                createResponseMessage: action.payload.message,
                createResponseStatus: "success"
            }
        case STUDENT_CREATE_EVENT_FAILED:
            return {
                ...state,
                createResponseMessage: action.payload.message,
                createResponseStatus: "failed"
            }
        case RESET_STUDENT_EVENT_CREATE_RESPONSE_MESSAGE:
            return {
                ...state,
                createResponseMessage: "",
                createResponseStatus: "success"
            }
        case STUDENT_EVENT_INPUT_CHANGE:
            var events = state.events.map(event => {
                // Find a event with the matching id
                if(event._id === action.payload.id){
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
        case STUDENT_EVENT_EDIT_CANCEL:
            var events = state.events.map(event => {
                if(event._id === action.payload.id){
                    return{
                        ...event, //copy the existing event
                        ["description"]: action.payload.description //replace the name with new name
                    }
                }
                // Leave every other event unchanged
                return event;
            });
            return {
                ...state,
                events
            }
        case STUDENT_UPDATE_EVENT_SUCCESS:
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
                updateResponseStatus: "success"
            }
        case STUDENT_UPDATE_EVENT_FAILED:
            return {
                ...state,
                updateResponseMessage: action.payload.message,
                updateResponseStatus: "failed"
            }
        case RESET_STUDENT_EVENT_UPDATE_RESPONSE_MESSAGE:
            return {
                ...state,
                updateResponseMessage: "",
                updateResponseStatus: "success"
            }
        case STUDENT_EVENT_ADD_COMMENT_SUCCESS:
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
        case STUDENT_EVENT_ADD_COMMENT_FAILED:
            return {
                ...state,
                addCommentResponseMessage: action.payload.message,
                addCommentResponseStatus: "failed"
            }
        case RESET_STUDENT_EVENT_ADD_COMMENT_RESPONSE:
            return {
                ...state,
                addCommentResponseMessage: "",
                addCommentResponseStatus: "success"
            }
        default:
            return state;
    }
}

export default studentEventsReducer;