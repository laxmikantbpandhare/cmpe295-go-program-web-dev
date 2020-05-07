import { REQUESTS_GET_ALL_ORDERS_SUCCESS, REQUESTS_GET_ALL_ORDERS_FAILED, 
    REQUESTS_UPDATE_ORDER_STATUS_SUCCESS, REQUESTS_UPDATE_ORDER_STATUS_FAILED, 
    REQUESTS_ORDER_ADD_COMMENT_SUCCESS, REQUESTS_ORDER_ADD_COMMENT_FAILED, 
    REQUESTS_ORDER_SELECT_CHANGE } from '../actions/types';

const initialState = {
    orders: [],
    getResponseMessage: "",
    updateResponseMessage: "",
    updatedOrder: "",
    addCommentResponseMessage: ""
};

const ordersRequestsReducer = (state = initialState, action) => {
    switch(action.type){
        case REQUESTS_GET_ALL_ORDERS_SUCCESS:
            return {
                ...state,
                orders: initialState.orders.concat(action.payload.orders),
                getResponseMessage: ""
            }
        case REQUESTS_GET_ALL_ORDERS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message
            }
        case REQUESTS_ORDER_SELECT_CHANGE:
            var orders = state.orders.map(order => {
                // Find a item with the matching id
                if(order._id == action.payload.id){
                    //Return a new object
                    return{
                        ...order, //copy the existing item
                        ["status"]: action.payload.value //replace the name with new name
                    }
                }
                // Leave every other item unchanged
                return order;
            });
            return {
                ...state,
                orders
            }
        case REQUESTS_UPDATE_ORDER_STATUS_SUCCESS:
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
                updateResponseMessage: action.payload.message,
                updatedOrder: action.payload.order._id
            }
        case REQUESTS_UPDATE_ORDER_STATUS_FAILED:
            return {
                ...state,
                updateResponseMessage: action.payload.message,
                updatedOrder: action.payload.id
            }
        case REQUESTS_ORDER_ADD_COMMENT_SUCCESS:
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
                addCommentResponseMessage: action.payload.message
            }
        case REQUESTS_ORDER_ADD_COMMENT_FAILED:
            return {
                ...state,
                addCommentResponseMessage: action.payload.message
            }
        default:
            return state;
    }
}

export default ordersRequestsReducer;