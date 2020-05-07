import { STUDENT_GET_ORDERS_SUCCESS, STUDENT_GET_ORDERS_FAILED, STUDENT_ORDER_ADD_COMMENT_SUCCESS, 
    STUDENT_ORDER_ADD_COMMENT_FAILED, } from '../actions/types';

const initialState = {
    orders: [],
    getResponseMessage: "",
    addCommentResponseMessage: "",
    updatedOrder: ""
};

const studentOrdersReducer = (state = initialState, action) => {
    switch(action.type){
        case STUDENT_GET_ORDERS_SUCCESS:
            return {
                ...state,
                orders: initialState.orders.concat(action.payload.orders),
                getResponseMessage: ""
            }
        case STUDENT_GET_ORDERS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message
            }
        case STUDENT_ORDER_ADD_COMMENT_SUCCESS:
            var orders = state.orders.map(order => {
                if(order._id == action.payload.order._id){
                    return action.payload.order;
                }
                // Leave every other item unchanged
                return order;
            });
            return {
                ...state,
                orders,
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

export default studentOrdersReducer;