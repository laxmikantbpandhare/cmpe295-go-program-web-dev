import { combineReducers } from "redux";
import adminInventoryReducer from './adminInventoryReducer';
import adminEventsReducer from './adminEventsReducer';

export default combineReducers({
    inventory: adminInventoryReducer,
    events: adminEventsReducer
});