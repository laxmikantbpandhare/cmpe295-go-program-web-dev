import { combineReducers } from "redux";
import adminInventoryReducer from './adminInventoryReducer';
import adminEventsReducer from './adminEventsReducer';
import studentEventsReducer from './studentEventsReducer';
import eventsRequestsReducer from './eventsRequestsReducer';

export default combineReducers({
    inventory: adminInventoryReducer,
    adminEvents: adminEventsReducer,
    studentEvents: studentEventsReducer,
    eventsRequests: eventsRequestsReducer
});