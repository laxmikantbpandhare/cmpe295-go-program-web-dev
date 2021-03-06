import { ADMIN_CREATE_ITEM_SUCCESS, ADMIN_CREATE_ITEM_FAILED, ADMIN_GET_ITEMS_SUCCESS,
    ADMIN_GET_ITEMS_FAILED, RESET_ADMIN_ITEM_CREATE_RESPONSE_MESSAGE, ADMIN_ITEM_INPUT_CHANGE,
    ADMIN_ITEM_ATTRIBUTE_CHANGE, ADMIN_ITEM_ADD_ATTRIBUTE, ADMIN_ITEM_REMOVE_ATTRIBUTE,
    ADMIN_ITEM_EDIT_CANCEL, ADMIN_UPDATE_ITEM_SUCCESS, ADMIN_UPDATE_ITEM_FAILED, 
    RESET_ADMIN_ITEM_UPDATE_RESPONSE_MESSAGE} from './types';
import {backendUrl} from '../../config';

export const getItems = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/admin/items`,{
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
    })
    .then(res => {
        if(res.status === 200){
            res.json().then(data => {
                dispatch({
                    type: ADMIN_GET_ITEMS_SUCCESS,
                    payload: data
                })
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: ADMIN_GET_ITEMS_FAILED,
                    payload: data
                })
            })
        }
    })
    .catch(err => {
        dispatch({
            type: ADMIN_GET_ITEMS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        })
    });  
};

const saveItemImages = (images,successcb, failurecb) => {
    const formData = new FormData();
    for(var x = 0; x<images.length; x++) {
        formData.append('image', images[x])
    }
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/upload/images/`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: formData
    })
    .then(res => {
        if(res.status === 200){
            res.json().then(resData => {
                successcb(resData.imagesName);
            });
        }else{
            res.json().then(resData => {
                failurecb(resData.message);
            }) 
        }
    })
    .catch(err => {
        failurecb(`Internal error -- ${err}`);
    });
}

export const createItem = data =>  dispatch => new Promise(function(resolve, reject) {
    saveItemImages(data.images, imagesName => {
        data.images = imagesName;
        const token = localStorage.getItem('token');
        fetch(`${backendUrl}/admin/createItem`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json,  text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },
            credentials: 'include',
            body: JSON.stringify(data)
        })
        .then(res => {
            if(res.status === 200){
                res.json().then(resData => {
                    dispatch({
                        type: ADMIN_CREATE_ITEM_SUCCESS,
                        payload: resData
                    });
                    resolve();
                });
            }else{
                res.json().then(resData => {
                    dispatch({
                        type: ADMIN_CREATE_ITEM_FAILED,
                        payload: {
                            message: resData.message
                        }
                    });
                    reject();
                }) 
            }
        })
        .catch(err => {
            dispatch({
                type: ADMIN_CREATE_ITEM_FAILED,
                payload: {
                    message: `Internal Error -- ${err}`
                }
            });
            reject();
        });

    }, failedMessage => {
        dispatch({
            type: ADMIN_CREATE_ITEM_FAILED,
            payload: {
                message: failedMessage
            }
        });
        reject();
        }
    );
});

export const resetCreateResponseMessageProps = () => {
    return{
        type: RESET_ADMIN_ITEM_CREATE_RESPONSE_MESSAGE
    }
}

export const itemInputChangeHandler = (id, name, value) => {
    return{
        type: ADMIN_ITEM_INPUT_CHANGE,
        payload: {id, name, value}
    }
}

export const itemAttributeChangeHandler = (id, index, name, value) => {
    return{
        type: ADMIN_ITEM_ATTRIBUTE_CHANGE,
        payload: {id, index, name, value}
    }
}

export const itemAddAttribute = (id) => {
    return{
        type: ADMIN_ITEM_ADD_ATTRIBUTE,
        payload: {id}
    }
}

export const itemRemoveAttribute = (id, index) => {
    return{
        type: ADMIN_ITEM_REMOVE_ATTRIBUTE,
        payload: {id, index}
    }
}

export const itemEditCancelHandler = previousProps => {
    return{
        type: ADMIN_ITEM_EDIT_CANCEL,
        payload: {item: previousProps}
    }
}

export const updateItem = data =>  dispatch =>  
    new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    return fetch(`${backendUrl}/admin/updateItem`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json,  text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
        credentials: 'include',
        body: JSON.stringify(data)
    })
    .then(res => {
        if(res.status === 200){
            res.json().then(resData => {
                dispatch({
                    type: ADMIN_UPDATE_ITEM_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: ADMIN_UPDATE_ITEM_FAILED,
                    payload: {
                        message: resData.message
                    }
                });
                reject();
            }) 
        }
    })
    .catch(err => {
        dispatch({
            type: ADMIN_UPDATE_ITEM_FAILED,
            payload: {
                message: `Internal Error -- ${err}`
            }
        });
        return reject();
    });
});

export const resetUpdateResponseMessage = () => {
    return{
        type: RESET_ADMIN_ITEM_UPDATE_RESPONSE_MESSAGE
    }
}