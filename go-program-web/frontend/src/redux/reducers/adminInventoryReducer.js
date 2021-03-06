import { ADMIN_CREATE_ITEM_SUCCESS, ADMIN_CREATE_ITEM_FAILED, ADMIN_GET_ITEMS_SUCCESS,
    ADMIN_GET_ITEMS_FAILED, RESET_ADMIN_ITEM_CREATE_RESPONSE_MESSAGE, ADMIN_ITEM_INPUT_CHANGE, 
    ADMIN_ITEM_ATTRIBUTE_CHANGE, ADMIN_ITEM_ADD_ATTRIBUTE, ADMIN_ITEM_REMOVE_ATTRIBUTE,
    ADMIN_ITEM_EDIT_CANCEL, ADMIN_UPDATE_ITEM_SUCCESS, ADMIN_UPDATE_ITEM_FAILED, 
    RESET_ADMIN_ITEM_UPDATE_RESPONSE_MESSAGE} from '../actions/types';

const initialState = {
    items: [],
    categories: [],
    createResponseMessage: "",
    createResponseStatus: "success",
    getResponseMessage: "",
    getResponseStatus: "success",
    updateResponseMessage: "",
    updateResponseStatus: "success"
};

const adminInventoryReducer = (state = initialState, action) => {
    switch(action.type){
        case ADMIN_GET_ITEMS_SUCCESS:
            var categories = [...new Set(action.payload.items.map(item => item.category))];
            return {
                ...state,
                items: initialState.items.concat(action.payload.items),
                categories: initialState.categories.concat(categories),
                getResponseMessage: "",
                getResponseStatus: "success"
            }
        case ADMIN_GET_ITEMS_FAILED:
            return {
                ...state,
                getResponseMessage: action.payload.message,
                getResponseStatus: "failed"
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
                createResponseStatus: "success",
                categories: initialState.categories.concat(categoriesCopy)
            }
        case ADMIN_CREATE_ITEM_FAILED:
            return {
                ...state,
                createResponseMessage: action.payload.message,
                createResponseStatus: "failed"
            }
        case RESET_ADMIN_ITEM_CREATE_RESPONSE_MESSAGE:
            return {
                ...state,
                createResponseMessage: "",
                createResponseStatus: "success"
            }
        case ADMIN_ITEM_INPUT_CHANGE:
            var items = state.items.map(item => {
                // Find a item with the matching id
                if(item._id === action.payload.id){
                    //Return a new object
                    return{
                        ...item, //copy the existing item
                        [action.payload.name]: action.payload.value //replace the name with new name
                    }
                }
                // Leave every other item unchanged
                return item;
            });
            return {
                ...state,
                items
            }
        case ADMIN_ITEM_ATTRIBUTE_CHANGE:
            var items = state.items.map(item => {
                if(item._id === action.payload.id){
                    let itemToUpdate = {...item};
                    const attributes = itemToUpdate.attributes.map((attribute, curr_index)=> {
                        if(curr_index === action.payload.index){
                            return{
                                ...attribute,
                                [action.payload.name]:action.payload.value
                            }
                        }
                        return attribute;
                    });
                    itemToUpdate.attributes = [...attributes];
                    return itemToUpdate;
                }
                // Leave every other item unchanged
                return item;
            });
            return {
                ...state,
                items
            }
        case ADMIN_ITEM_ADD_ATTRIBUTE:
            var items = state.items.map(item => {
                if(item._id === action.payload.id){
                    let itemToUpdate = {...item};
                    itemToUpdate.attributes = [...itemToUpdate.attributes, { size: "", quantity: 0 }];
                    return itemToUpdate;
                }
                // Leave every other item unchanged
                return item;
            });
            return {
                ...state,
                items
            }
        case ADMIN_ITEM_REMOVE_ATTRIBUTE:
            var items = state.items.map(item => {
                if(item._id === action.payload.id){
                    let itemToUpdate = {...item};
                    itemToUpdate.attributes = itemToUpdate.attributes.filter((attribute, curr_index) => {
                        return curr_index !==  action.payload.index;
                    });
                    return itemToUpdate;
                }
                // Leave every other item unchanged
                return item;
            });
            return {
                ...state,
                items
            }
        case ADMIN_ITEM_EDIT_CANCEL:
            var items = state.items.map(item => {
                if(item._id === action.payload.item._id){
                    return action.payload.item;
                }
                // Leave every other item unchanged
                return item;
            });
            return {
                ...state,
                items
            }
        case ADMIN_UPDATE_ITEM_SUCCESS:
            var items = state.items.map(item => {
                if(item._id === action.payload.item._id){
                    return action.payload.item;
                }
                // Leave every other item unchanged
                return item;
            });
            return {
                ...state,
                items,
                updateResponseMessage: action.payload.message,
                updateResponseStatus: "success"
            }
        case ADMIN_UPDATE_ITEM_FAILED:
            return {
                ...state,
                updateResponseMessage: action.payload.message,
                updateResponseStatus: "failed"
            }
        case RESET_ADMIN_ITEM_UPDATE_RESPONSE_MESSAGE:
            return {
                ...state,
                updateResponseMessage: "",
                updateResponseStatus: "success"
            }
        default:
            return state;
    }
}

export default adminInventoryReducer;