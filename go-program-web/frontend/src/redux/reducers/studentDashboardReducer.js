import { STUDENT_DASHBOARD_GET_POINTS_SUCCESS, STUDENT_DASHBOARD_GET_POINTS_FAILED,
    STUDENT_DASHBOARD_GET_EVENTS_SUCCESS, STUDENT_DASHBOARD_GET_EVENTS_FAILED,
    STUDENT_DASHBOARD_GET_APPROVED_EVENTS_SUCCESS, STUDENT_DASHBOARD_GET_APPROVED_EVENTS_FAILED, 
    STUDENT_DASHBOARD_GET_ORDERS_SUCCESS, STUDENT_DASHBOARD_GET_ORDERS_FAILED, 
    STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_SUCCESS, STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_FAILED } from '../actions/types';

const initialState = {
    pointsAccumulated: 0,
    pointsSpent: 0,
    getPointsResponseMessage: "",
    events: [],
    getEventsResponseMessage: "",
    approvedEvents: [],
    getApprovedEventsResponseMessage: "",
    orders: [],
    getOrdersResponseMessage: "",
    deliveredOrders: [],
    getDeliveredOrdersResponseMessage: ""
};

const studentDashboardReducer = (state = initialState, action) => {
    switch(action.type){
        case STUDENT_DASHBOARD_GET_POINTS_SUCCESS:
            return {
                ...state,
                pointsAccumulated: action.payload.pointsAccumulated,
                pointsSpent: action.payload.pointsSpent,
                getPointsResponseMessage: ""
            }
        case STUDENT_DASHBOARD_GET_POINTS_FAILED:
            return {
                ...state,
                getPointsResponseMessage: action.payload.message
            }
        case STUDENT_DASHBOARD_GET_EVENTS_SUCCESS:
            return {
                ...state,
                events: initialState.events.concat(action.payload.events),
                getEventsResponseMessage: ""
            }
        case STUDENT_DASHBOARD_GET_EVENTS_FAILED:
            return {
                ...state,
                getEventsResponseMessage: action.payload.message
            }
        case STUDENT_DASHBOARD_GET_APPROVED_EVENTS_SUCCESS:
            return {
                ...state,
                approvedEvents: initialState.approvedEvents.concat(action.payload.events),
                getApprovedEventsResponseMessage: ""
            }
        case STUDENT_DASHBOARD_GET_APPROVED_EVENTS_FAILED:
            return {
                ...state,
                getApprovedEventsResponseMessage: action.payload.message
            }
        case STUDENT_DASHBOARD_GET_ORDERS_SUCCESS:
            return {
                ...state,
                orders: initialState.orders.concat(action.payload.orders),
                getOrdersResponseMessage: ""
            }
        case STUDENT_DASHBOARD_GET_ORDERS_FAILED:
            return {
                ...state,
                getOrdersResponseMessage: action.payload.message
            }
        case STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_SUCCESS:
            return {
                ...state,
                deliveredOrders: initialState.deliveredOrders.concat(action.payload.orders),
                getDeliveredOrdersResponseMessage: ""
            }
        case STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_FAILED:
            return {
                ...state,
                getDeliveredOrdersResponseMessage: action.payload.message
            }
        default:
            return state;
    }
}

export default studentDashboardReducer;