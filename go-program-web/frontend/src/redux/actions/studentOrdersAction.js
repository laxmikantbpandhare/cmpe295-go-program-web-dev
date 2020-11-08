import { STUDENT_GET_ORDERS_SUCCESS, STUDENT_GET_ORDERS_FAILED, STUDENT_ORDER_ADD_COMMENT_SUCCESS,
    STUDENT_ORDER_ADD_COMMENT_FAILED} from './types';
import {backendUrl} from '../../config';

export const getOrders = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/ownOrders`,{
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
                    type: STUDENT_GET_ORDERS_SUCCESS,
                    payload: data
                })
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: STUDENT_GET_ORDERS_FAILED,
                    payload: data
                })
            })
        }
    })
    .catch(err => {
        dispatch({
            type: STUDENT_GET_ORDERS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        })
    });  
};

export const orderAddStudentComment = data =>  dispatch =>  
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
                    type: STUDENT_ORDER_ADD_COMMENT_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: STUDENT_ORDER_ADD_COMMENT_FAILED,
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
            type: STUDENT_ORDER_ADD_COMMENT_FAILED,
            payload: {
                message: `Internal Error -- ${err}`
            }
        });
        reject();
    });
});