import { MANAGER_CREATE_ADMIN_SUCCESS, MANAGER_CREATE_ADMIN_FAILED, MANAGER_ADMIN_EDIT_CANCEL,
    MANAGER_GET_ALL_ADMINS_SUCCESS, MANAGER_GET_ALL_ADMINS_FAILED, MANAGER_UPDATE_ADMIN_SUCCESS,
    MANAGER_UPDATE_ADMIN_FAILED, MANAGER_ADMIN_SELECT_CHANGE, 
    RESET_MANAGER_CREATE_ADMIN_RESPONSE_MESSAGE} from '../actions/types';

const initialState = {
    admins: [],
    createResponseMessage: "",
    getResponseMessage: "",
    updateResponseMessage: ""
};

const adminUsersReducer = (state = initialState, action) => {
    switch(action.type){
        case MANAGER_CREATE_ADMIN_SUCCESS:
            return {
                ...state,
                admins: [action.payload.admin, ...state.admins],
                createResponseMessage: action.payload.message
            }
        case MANAGER_CREATE_ADMIN_FAILED:
            return {
                ...state,
                createResponseMessage: action.payload.message
            }
        case RESET_MANAGER_CREATE_ADMIN_RESPONSE_MESSAGE:
            return {
                ...state,
                createResponseMessage: ""
            }
        case MANAGER_GET_ALL_ADMINS_SUCCESS:
            return {
                ...state,
                admins: initialState.admins.concat(action.payload.admins),
                getResponseMessage: ""
            }
        case MANAGER_GET_ALL_ADMINS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message
            }
        case MANAGER_ADMIN_SELECT_CHANGE:
            var admins = state.admins.map(admin => {
                // Find as admin with the matching id
                if(admin._id == action.payload.id){
                    //Return a new object
                    return{
                        ...admin, //copy the existing admin
                        [action.payload.name]: action.payload.value
                    }
                }
                // Leave every other admin unchanged
                return admin;
            });
            return {
                ...state,
                admins
            }
        case MANAGER_ADMIN_EDIT_CANCEL:
            var admins = state.admins.map(admin => {
                if(admin._id == action.payload.admin._id){
                    return action.payload.admin;
                }
                // Leave every other admin unchanged
                return admin;
            });
            return {
                ...state,
                admins
            }
        case MANAGER_UPDATE_ADMIN_SUCCESS:
            var admins = state.admins.map(admin => {
                if(admin._id == action.payload.admin._id){
                    return action.payload.admin;
                }
                // Leave every other admin unchanged
                return admin;
            });
            return {
                ...state,
                admins,
                updateResponseMessage: action.payload.message
            }
        case MANAGER_UPDATE_ADMIN_FAILED:
            return {
                ...state,
                updateResponseMessage: action.payload.message
            }
        default:
            return state;
    }
}

export default adminUsersReducer;