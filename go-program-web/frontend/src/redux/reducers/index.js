import { combineReducers } from "redux";
import adminInventoryReducer from './adminInventoryReducer';
import adminEventsReducer from './adminEventsReducer';
import studentEventsReducer from './studentEventsReducer';

export default combineReducers({
    inventory: adminInventoryReducer,
    adminEvents: adminEventsReducer,
    studentEvents: studentEventsReducer
});