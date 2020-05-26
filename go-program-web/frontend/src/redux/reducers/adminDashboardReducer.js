import { ADMIN_DASHBOARD_GET_PENDING_APPROVAL_EVENTS_SUCCESS, ADMIN_DASHBOARD_GET_PENDING_APPROVAL_EVENTS_FAILED, 
    ADMIN_DASHBOARD_GET_SUBMITTED_ORDERS_SUCCESS, ADMIN_DASHBOARD_GET_SUBMITTED_ORDERS_FAILED, 
    ADMIN_DASHBOARD_GET_PENDING_APPROVAL_SUGGESTED_EVENTS_SUCCESS, 
    ADMIN_DASHBOARD_GET_PENDING_APPROVAL_SUGGESTED_EVENTS_FAILED } from '../actions/types';

const initialState = {
    pendingApprovalEvents: [],
    getPendingApprovalEventsResponseMessage: "",
    submittedOrders: [],
    getSubmittedOrdersResponseMessage: "",
    pendingApprovalSuggestedEvents: [],
    getPendingApprovalSuggestedEventsResponseMessage: ""
};

const adminDashboardReducer = (state = initialState, action) => {
    switch(action.type){
        case ADMIN_DASHBOARD_GET_PENDING_APPROVAL_EVENTS_SUCCESS:
            return {
                ...state,
                pendingApprovalEvents: initialState.pendingApprovalEvents.concat(action.payload.events),
                getPendingApprovalEventsResponseMessage: ""
            }
        case ADMIN_DASHBOARD_GET_PENDING_APPROVAL_EVENTS_FAILED:
            return {
                ...state,
                getPendingApprovalEventsResponseMessage: action.payload.message
            }
        case ADMIN_DASHBOARD_GET_SUBMITTED_ORDERS_SUCCESS:
            return {
                ...state,
                submittedOrders: initialState.submittedOrders.concat(action.payload.orders),
                getSubmittedOrdersResponseMessage: ""
            }
        case ADMIN_DASHBOARD_GET_SUBMITTED_ORDERS_FAILED:
            return {
                ...state,
                getSubmittedOrdersResponseMessage: action.payload.message
            }
        case ADMIN_DASHBOARD_GET_PENDING_APPROVAL_SUGGESTED_EVENTS_SUCCESS:
            return {
                ...state,
                pendingApprovalSuggestedEvents: initialState.pendingApprovalSuggestedEvents.concat(action.payload.events),
                getPendingApprovalSuggestedEventsResponseMessage: ""
            }
        case ADMIN_DASHBOARD_GET_PENDING_APPROVAL_SUGGESTED_EVENTS_FAILED:
            return {
                ...state,
                getPendingApprovalSuggestedEventsResponseMessage: action.payload.message
            }
        default:
            return state;
    }
}

export default adminDashboardReducer;