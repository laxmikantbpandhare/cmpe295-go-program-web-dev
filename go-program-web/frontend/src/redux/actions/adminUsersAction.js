import { MANAGER_CREATE_ADMIN_SUCCESS, MANAGER_CREATE_ADMIN_FAILED, MANAGER_ADMIN_EDIT_CANCEL,
    MANAGER_GET_ALL_ADMINS_SUCCESS, MANAGER_GET_ALL_ADMINS_FAILED, MANAGER_UPDATE_ADMIN_SUCCESS,
    MANAGER_UPDATE_ADMIN_FAILED, MANAGER_ADMIN_SELECT_CHANGE, 
    RESET_MANAGER_CREATE_ADMIN_RESPONSE_MESSAGE} from './types';
import {backendUrl} from '../../config';

export const getAdmins = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/user/allAdmins`,{
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
                    type: MANAGER_GET_ALL_ADMINS_SUCCESS,
                    payload: data
                })
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: MANAGER_GET_ALL_ADMINS_FAILED,
                    payload: data
                })
            })
        }
    })
    .catch(err => {
        dispatch({
            type: MANAGER_GET_ALL_ADMINS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        })
    });  
};

export const createAdmin = data =>  dispatch => 
    new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    return fetch(`${backendUrl}/user/createAdmin`, {
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
                console.log("resdate -- ", resData);
                dispatch({
                    type: MANAGER_CREATE_ADMIN_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: MANAGER_CREATE_ADMIN_FAILED,
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
            type: MANAGER_CREATE_ADMIN_FAILED,
            payload: {
                message: `Internal Error -- ${err}`
            }
        });
        reject();
    });
});

export const resetCreateResponseMessageProps = () => {
    return{
        type: RESET_MANAGER_CREATE_ADMIN_RESPONSE_MESSAGE
    }
}

export const adminChangeHandler = (id, name, value) => {
    return{
        type: MANAGER_ADMIN_SELECT_CHANGE,
        payload: {id, name, value}
    }
}

export const adminEditCancelHandler = previousProps => {
    return{
        type: MANAGER_ADMIN_EDIT_CANCEL,
        payload: {admin: previousProps}
    }
}

export const updateAdmin = data =>  dispatch =>  
    new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    
    return fetch(`${backendUrl}/user/updateAdmin`, {
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
                    type: MANAGER_UPDATE_ADMIN_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: MANAGER_UPDATE_ADMIN_FAILED,
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
            type: MANAGER_UPDATE_ADMIN_FAILED,
            payload: {
                message: `Internal Error -- ${err}`
            }
        });
        return reject();
    });
});