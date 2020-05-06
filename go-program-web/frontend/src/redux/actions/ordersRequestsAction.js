import { REQUESTS_GET_ALL_ORDERS_SUCCESS, REQUESTS_GET_ALL_ORDERS_FAILED, REQUESTS_ORDER_SELECT_CHANGE,
    REQUESTS_UPDATE_ORDER_STATUS_SUCCESS, REQUESTS_UPDATE_ORDER_STATUS_FAILED, 
    REQUESTS_ORDER_ADD_COMMENT_SUCCESS, REQUESTS_ORDER_ADD_COMMENT_FAILED } from './types';
import {backendUrl} from '../../config';

export const getAllOrders = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/allOrders`,{
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
                    type: REQUESTS_GET_ALL_ORDERS_SUCCESS,
                    payload: data
                })
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: REQUESTS_GET_ALL_ORDERS_FAILED,
                    payload: data
                })
            })
        }
    })
    .catch(err => {
        dispatch({
            type: REQUESTS_GET_ALL_ORDERS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        })
    });  
};

export const orderSelectChangeHandler = (id, value) => {
    return{
        type: REQUESTS_ORDER_SELECT_CHANGE,
        payload: {id, value}
    }
}

export const updateOrderStatus = data =>  dispatch =>  
    new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    return fetch(`${backendUrl}/student/updateOrderStatus`, {
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
                    type: REQUESTS_UPDATE_ORDER_STATUS_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: REQUESTS_UPDATE_ORDER_STATUS_FAILED,
                    payload: {
                        id: data.id,
                        message: resData.message
                    }
                });
                reject();
            }) 
        }
    })
    .catch(err => {
        dispatch({
            type: REQUESTS_UPDATE_ORDER_STATUS_FAILED,
            payload: {
                id: data.id,
                message: `Internal Error -- ${err}`
            }
        });
        reject();
    });
});

export const orderAddAdminComment = data =>  dispatch =>  
    new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    return fetch(`${backendUrl}/student/addOrderComment`, {
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
                    type: REQUESTS_ORDER_ADD_COMMENT_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: REQUESTS_ORDER_ADD_COMMENT_FAILED,
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
            type: REQUESTS_ORDER_ADD_COMMENT_FAILED,
            payload: {
                message: `Internal Error -- ${err}`
            }
        });
        reject();
    });
});