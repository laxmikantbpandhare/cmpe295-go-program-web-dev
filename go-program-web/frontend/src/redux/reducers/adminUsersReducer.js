import { MANAGER_CREATE_ADMIN_SUCCESS, MANAGER_CREATE_ADMIN_FAILED, MANAGER_GET_ALL_ADMINS_SUCCESS, 
    MANAGER_GET_ALL_ADMINS_FAILED, MANAGER_UPDATE_ADMIN_SUCCESS, MANAGER_UPDATE_ADMIN_FAILED, 
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