import { combineReducers } from "redux";
import adminInventoryReducer from './adminInventoryReducer';

export default combineReducers({
    inventory: adminInventoryReducer
});