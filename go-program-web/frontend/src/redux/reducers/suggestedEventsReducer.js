import { STUDENT_GET_SUGGESTED_EVENTS_SUCCESS, STUDENT_GET_SUGGESTED_EVENTS_FAILED, 
    STUDENT_CREATE_SUGGESTED_EVENT_SUCCESS, STUDENT_CREATE_SUGGESTED_EVENT_FAILED, 
    RESET_STUDENT_SUGGESTED_EVENT_CREATE_RESPONSE_MESSAGE, STUDENT_SUGGESTED_EVENT_ADD_COMMENT_SUCCESS,
    STUDENT_SUGGESTED_EVENT_ADD_COMMENT_FAILED, RESET_STUDENT_SUGGESTED_EVENT_ADD_COMMENT_RESPONSE } 
    from '../actions/types';

const initialState = {
    events: [],
    createResponseMessage: "",
    createResponseStatus: "success",
    getResponseMessage: "",
    getResponseStatus: "success",
    addCommentResponseMessage: "",
    addCommentResponseStatus: "success"
};

const suggestedEventsReducer = (state = initialState, action) => {
    switch(action.type){
        case STUDENT_GET_SUGGESTED_EVENTS_SUCCESS:
            return {
                ...state,
                events: initialState.events.concat(action.payload.events),
                getResponseMessage: "",
                getResponseStatus: "success"
            }
        case STUDENT_GET_SUGGESTED_EVENTS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message,
                getResponseStatus: "failed"
            }
        case STUDENT_CREATE_SUGGESTED_EVENT_SUCCESS:
            return {
                ...state,
                events: [action.payload.event, ...state.events],
                createResponseMessage: action.payload.message,
                createResponseStatus: "success"
            }
        case STUDENT_CREATE_SUGGESTED_EVENT_FAILED:
            return {
                ...state,
                createResponseMessage: action.payload.message,
                createResponseStatus: "failed"
            }
        case RESET_STUDENT_SUGGESTED_EVENT_CREATE_RESPONSE_MESSAGE:
            return {
                ...state,
                createResponseMessage: "",
                createResponseStatus: "success"
            }
        case STUDENT_SUGGESTED_EVENT_ADD_COMMENT_SUCCESS:
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
        case STUDENT_SUGGESTED_EVENT_ADD_COMMENT_FAILED:
            return {
                ...state,
                addCommentResponseMessage: action.payload.message,
                addCommentResponseStatus: "failed"
            }
        case RESET_STUDENT_SUGGESTED_EVENT_ADD_COMMENT_RESPONSE:
            return {
                ...state,
                addCommentResponseMessage: "",
                addCommentResponseStatus: "success"
            }
        default:
            return state;
    }
}

export default suggestedEventsReducer;