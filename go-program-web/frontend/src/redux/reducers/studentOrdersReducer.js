import { STUDENT_GET_ORDERS_SUCCESS, STUDENT_GET_ORDERS_FAILED, STUDENT_ORDER_ADD_COMMENT_SUCCESS, STUDENT_ORDER_ADD_COMMENT_FAILED, } from '../actions/types';

const initialState = {
    orders: [],
    getResponseMessage: "",
    addCommentResponseMessage: "",
    updatedOrder: ""
};

const studentEventsReducer = (state = initialState, action) => {
    switch(action.type){
        case STUDENT_GET_ORDERS_SUCCESS:
            return {
                ...state,
                events: initialState.events.concat(action.payload.events),
                getResponseMessage: ""
            }
        case STUDENT_GET_ORDERS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message
            }
        case STUDENT_ORDER_ADD_COMMENT_SUCCESS:
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
                addCommentResponseMessage: action.payload.message,
            }
        case STUDENT_ORDER_ADD_COMMENT_FAILED:
            return {
                ...state,
                addCommentResponseMessage: action.payload.message
            }
        default:
            return state;
    }
}

export default studentEventsReducer;