import { combineReducers } from "redux";
import adminInventoryReducer from './adminInventoryReducer';
import adminEventsReducer from './adminEventsReducer';
import studentEventsReducer from './studentEventsReducer';
import eventsRequestsReducer from './eventsRequestsReducer';
import studentOrdersReducer from './studentOrdersReducer';
import ordersRequestsReducer from './ordersRequestsReducer';
import studentDashboardReducer from './studentDashboardReducer';

export default combineReducers({
    inventory: adminInventoryReducer,
    adminEvents: adminEventsReducer,
    studentEvents: studentEventsReducer,
    eventsRequests: eventsRequestsReducer,
    studentOrders: studentOrdersReducer,
    ordersRequests: ordersRequestsReducer,
    studentDashboard: studentDashboardReducer
});