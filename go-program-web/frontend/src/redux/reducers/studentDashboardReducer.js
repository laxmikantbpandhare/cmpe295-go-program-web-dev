import { STUDENT_DASHBOARD_GET_POINTS_SUCCESS, STUDENT_DASHBOARD_GET_POINTS_FAILED,
    STUDENT_DASHBOARD_GET_EVENTS_SUCCESS, STUDENT_DASHBOARD_GET_EVENTS_FAILED,
    STUDENT_DASHBOARD_GET_APPROVED_EVENTS_SUCCESS, STUDENT_DASHBOARD_GET_APPROVED_EVENTS_FAILED, 
    STUDENT_DASHBOARD_GET_ORDERS_SUCCESS, STUDENT_DASHBOARD_GET_ORDERS_FAILED, 
    STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_SUCCESS, STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_FAILED, 
    STUDENT_DASHBOARD_GET_SUGGESTED_EVENTS_SUCCESS, STUDENT_DASHBOARD_GET_SUGGESTED_EVENTS_FAILED, 
    STUDENT_DASHBOARD_GET_APPROVED_SUGGESTED_EVENTS_SUCCESS, 
    STUDENT_DASHBOARD_GET_APPROVED_SUGGESTED_EVENTS_FAILED } from '../actions/types';

const initialState = {
    pointsAccumulated: 0,
    pointsSpent: 0,
    getPointsResponseMessage: "",
    getPointsResponseStatus: "success",
    events: [],
    getEventsResponseMessage: "",
    getEventsResponseStatus: "success",
    approvedEvents: [],
    getApprovedEventsResponseMessage: "",
    getApprovedEventsResponseStatus: "success",
    orders: [],
    getOrdersResponseMessage: "",
    getOrdersResponseStatus: "success",
    deliveredOrders: [],
    getDeliveredOrdersResponseMessage: "",
    getDeliveredOrdersResponseStatus: "success",
    suggestedEvents: [],
    getSuggestedEventsResponseMessage: "",
    getSuggestedEventsResponseStatus: "success",
    approvedSuggestedEvents: [],
    getApprovedSuggestedEventsResponseMessage: "",
    getApprovedSuggestedEventsResponseStatus: "success"
};

const studentDashboardReducer = (state = initialState, action) => {
    switch(action.type){
        case STUDENT_DASHBOARD_GET_POINTS_SUCCESS:
            return {
                ...state,
                pointsAccumulated: action.payload.pointsAccumulated,
                pointsSpent: action.payload.pointsSpent,
                getPointsResponseMessage: "",
                getPointsResponseStatus: "success"
            }
        case STUDENT_DASHBOARD_GET_POINTS_FAILED:
            return {
                ...state,
                getPointsResponseMessage: action.payload.message,
                getPointsResponseStatus: "failed"
            }
        case STUDENT_DASHBOARD_GET_EVENTS_SUCCESS:
            return {
                ...state,
                events: initialState.events.concat(action.payload.events),
                getEventsResponseMessage: "",
                getEventsResponseStatus: "success"
            }
        case STUDENT_DASHBOARD_GET_EVENTS_FAILED:
            return {
                ...state,
                getEventsResponseMessage: action.payload.message,
                getEventsResponseStatus: "failed"
            }
        case STUDENT_DASHBOARD_GET_APPROVED_EVENTS_SUCCESS:
            return {
                ...state,
                approvedEvents: initialState.approvedEvents.concat(action.payload.events),
                getApprovedEventsResponseMessage: "",
                getApprovedEventsResponseStatus: "success"
            }
        case STUDENT_DASHBOARD_GET_APPROVED_EVENTS_FAILED:
            return {
                ...state,
                getApprovedEventsResponseMessage: action.payload.message,
                getApprovedEventsResponseStatus: "failed"
            }
        case STUDENT_DASHBOARD_GET_ORDERS_SUCCESS:
            return {
                ...state,
                orders: initialState.orders.concat(action.payload.orders),
                getOrdersResponseMessage: "",
                getOrdersResponseStatus: "success"
            }
        case STUDENT_DASHBOARD_GET_ORDERS_FAILED:
            return {
                ...state,
                getOrdersResponseMessage: action.payload.message,
                getOrdersResponseStatus: "failed"
            }
        case STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_SUCCESS:
            return {
                ...state,
                deliveredOrders: initialState.deliveredOrders.concat(action.payload.orders),
                getDeliveredOrdersResponseMessage: "",
                getDeliveredOrdersResponseStatus: "success"
            }
        case STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_FAILED:
            return {
                ...state,
                getDeliveredOrdersResponseMessage: action.payload.message,
                getDeliveredOrdersResponseStatus: "failed"
            }
        case STUDENT_DASHBOARD_GET_SUGGESTED_EVENTS_SUCCESS:
            return {
                ...state,
                suggestedEvents: initialState.suggestedEvents.concat(action.payload.events),
                getSuggestedEventsResponseMessage: "",
                getSuggestedEventsResponseStatus: "success"
            }
        case STUDENT_DASHBOARD_GET_SUGGESTED_EVENTS_FAILED:
            return {
                ...state,
                getSuggestedEventsResponseMessage: action.payload.message,
                getSuggestedEventsResponseStatus: "failed"

            }
        case STUDENT_DASHBOARD_GET_APPROVED_SUGGESTED_EVENTS_SUCCESS:
            return {
                ...state,
                approvedSuggestedEvents: initialState.approvedSuggestedEvents.concat(action.payload.events),
                getApprovedSuggestedEventsResponseMessage: "",
                getApprovedSuggestedEventsResponseStatus: "success"
            }
        case STUDENT_DASHBOARD_GET_APPROVED_SUGGESTED_EVENTS_FAILED:
            return {
                ...state,
                getApprovedSuggestedEventsResponseMessage: action.payload.message,
                getApprovedSuggestedEventsResponseStatus: "failed"
            }
        default:
            return state;
    }
}

export default studentDashboardReducer;