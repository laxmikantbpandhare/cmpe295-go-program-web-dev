import { REQUESTS_GET_ALL_ORDERS_SUCCESS, REQUESTS_GET_ALL_ORDERS_FAILED, 
    REQUESTS_UPDATE_ORDER_STATUS_SUCCESS, REQUESTS_UPDATE_ORDER_STATUS_FAILED, REQUESTS_ORDER_ADD_COMMENT_SUCCESS, 
    REQUESTS_ORDER_ADD_COMMENT_FAILED, RESET_REQUESTS_ORDER_ADD_COMMENT_RESPONSE} from '../actions/types';

const initialState = {
    orders: [],
    getResponseMessage: "",
    getResponseStatus: "success",
    updateResponseMessage: "",
    updateResponseStatus: "success",
    updatedOrder: "",
    addCommentResponseMessage: "",
    addCommentResponseStatus: "success"
};

const ordersRequestsReducer = (state = initialState, action) => {
    switch(action.type){
        case REQUESTS_GET_ALL_ORDERS_SUCCESS:
            return {
                ...state,
                orders: initialState.orders.concat(action.payload.orders),
                getResponseMessage: "",
                getResponseStatus: "success"
            }
        case REQUESTS_GET_ALL_ORDERS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message,
                getResponseStatus: "failed"
            }
        case REQUESTS_UPDATE_ORDER_STATUS_SUCCESS:
            var orders = state.orders.map(order => {
                if(order._id === action.payload.order._id){
                    return action.payload.order;
                }
                // Leave every other item unchanged
                return order;
            });
            return {
                ...state,
                orders,
                updateResponseMessage: action.payload.message,
                updateResponseStatus: "success",
                updatedOrder: action.payload.order._id
            }
        case REQUESTS_UPDATE_ORDER_STATUS_FAILED:
            return {
                ...state,
                updateResponseMessage: action.payload.message,
                updateResponseStatus: "failed",
                updatedOrder: action.payload.id
            }
        case REQUESTS_ORDER_ADD_COMMENT_SUCCESS:
            var orders = state.orders.map(order => {
                if(order._id === action.payload.order._id){
                    return action.payload.order;
                }
                // Leave every other item unchanged
                return order;
            });
            return {
                ...state,
                orders,
                addCommentResponseMessage: action.payload.message,
                addCommentResponseStatus: "success"
            }
        case REQUESTS_ORDER_ADD_COMMENT_FAILED:
            return {
                ...state,
                addCommentResponseMessage: action.payload.message,
                addCommentResponseStatus: "failed"
            }
        case RESET_REQUESTS_ORDER_ADD_COMMENT_RESPONSE:
            return {
                ...state,
                addCommentResponseMessage: "",
                addCommentResponseStatus: "success"
            }
        default:
            return state;
    }
}

export default ordersRequestsReducer;