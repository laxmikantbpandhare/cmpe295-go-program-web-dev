import { STUDENT_CREATE_EVENT_SUCCESS, STUDENT_CREATE_EVENT_FAILED, STUDENT_GET_EVENTS_SUCCESS,
    STUDENT_GET_EVENTS_FAILED, RESET_STUDENT_EVENT_CREATE_RESPONSE_MESSAGE, STUDENT_EVENT_INPUT_CHANGE, STUDENT_EVENT_EDIT_CANCEL, STUDENT_UPDATE_EVENT_SUCCESS, STUDENT_UPDATE_EVENT_FAILED} from '../actions/types';

const initialState = {
    events: [],
    createResponseMessage: "",
    getResponseMessage: "",
    updateResponseMessage: "",
    deleteResponseMessage: ""
};

const studentEventsReducer = (state = initialState, action) => {
    switch(action.type){
        case STUDENT_GET_EVENTS_SUCCESS:
            return {
                ...state,
                events: initialState.events.concat(action.payload.events),
                getResponseMessage: ""
            }
        case STUDENT_GET_EVENTS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message
            }
        case STUDENT_CREATE_EVENT_SUCCESS:
            return {
                ...state,
                events: [action.payload.event, ...state.events],
                createResponseMessage: action.payload.message
            }
        case STUDENT_CREATE_EVENT_FAILED:
            return {
                ...state,
                createResponseMessage: action.payload.message
            }
        case RESET_STUDENT_EVENT_CREATE_RESPONSE_MESSAGE:
            return {
                ...state,
                createResponseMessage: ""
            }
        case STUDENT_EVENT_INPUT_CHANGE:
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
        case STUDENT_EVENT_EDIT_CANCEL:
            var events = state.events.map(event => {
                if(event._id == action.payload.id){
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
                if(event._id == action.payload.event._id){
                    return action.payload.event;
                }
                // Leave every other item unchanged
                return event;
            });
            return {
                ...state,
                events,
                updateResponseMessage: action.payload.message
            }
        case STUDENT_UPDATE_EVENT_FAILED:
            return {
                ...state,
                updateResponseMessage: action.payload.message
            }
        default:
            return state;
    }
}

export default studentEventsReducer;