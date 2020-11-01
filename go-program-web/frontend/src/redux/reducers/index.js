import { combineReducers } from "redux";
import adminInventoryReducer from './adminInventoryReducer';
import adminEventsReducer from './adminEventsReducer';
import studentEventsReducer from './studentEventsReducer';
import eventsRequestsReducer from './eventsRequestsReducer';
import studentOrdersReducer from './studentOrdersReducer';
import ordersRequestsReducer from './ordersRequestsReducer';
import studentDashboardReducer from './studentDashboardReducer';
import adminDashboardReducer from './adminDashboardReducer';
import suggestedEventsReducer from './suggestedEventsReducer';
import suggestedEventsRequestsReducer from './suggestedEventsRequestsReducer';
import usersRequestsReducer from './usersRequestsReducer';
import adminUsersReducer from './adminUsersReducer'

export default combineReducers({
    inventory: adminInventoryReducer,
    adminEvents: adminEventsReducer,
    studentEvents: studentEventsReducer,
    eventsRequests: eventsRequestsReducer,
    studentOrders: studentOrdersReducer,
    ordersRequests: ordersRequestsReducer,
    studentDashboard: studentDashboardReducer,
    adminDashboard: adminDashboardReducer,
    suggestedEvents: suggestedEventsReducer,
    suggestedEventsRequests: suggestedEventsRequestsReducer,
    usersRequests: usersRequestsReducer,
    adminUsers: adminUsersReducer
});