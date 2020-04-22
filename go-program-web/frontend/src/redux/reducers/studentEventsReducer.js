import { STUDENT_CREATE_EVENT_SUCCESS, STUDENT_CREATE_EVENT_FAILED, STUDENT_GET_EVENTS_SUCCESS,
    STUDENT_GET_EVENTS_FAILED, RESET_STUDENT_EVENT_CREATE_RESPONSE_MESSAGE} from '../actions/types';

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
        default:
            return state;
    }
}

export default studentEventsReducer;