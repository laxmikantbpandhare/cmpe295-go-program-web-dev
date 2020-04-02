import { ADMIN_CREATE_ITEM_SUCCESS, ADMIN_CREATE_ITEM_FAILED, ADMIN_GET_ITEMS_SUCCESS,
    ADMIN_GET_ITEMS_FAILED, RESET_ITEM_CREATE_RESPONSE_MESSAGE } from '../actions/types';

const initialState = {
    items: [],
    categories: [],
    createResponseMessage: "",
    responseMessage: ""
};

const adminInventoryReducer = (state = initialState, action) => {
    switch(action.type){
        case ADMIN_GET_ITEMS_SUCCESS:
            var categories = [...new Set(action.payload.items.map(item => item.category))];
            return {
                ...state,
                items: initialState.items.concat(action.payload.items),
                categories: initialState.categories.concat(categories)
            }
        case ADMIN_GET_ITEMS_FAILED:
            return {
                ...state,
                responseMessage: action.payload.message
            }
        case ADMIN_CREATE_ITEM_SUCCESS:
            var categoriesCopy = [...state.categories];
            if(categoriesCopy.indexOf(action.payload.item.category) === -1) {
                categoriesCopy.push(action.payload.item.category)
            }
            return {
                ...state,
                items: [action.payload.item, ...state.items],
                createResponseMessage: action.payload.message,
                categories: initialState.categories.concat(categoriesCopy)
            }
        case ADMIN_CREATE_ITEM_FAILED:
            return {
                ...state,
                createResponseMessage: action.payload.message
            }
        case RESET_ITEM_CREATE_RESPONSE_MESSAGE:
            return {
                ...state,
                createResponseMessage: ""
            }

        default:
            return state;
    }
}

export default adminInventoryReducer;