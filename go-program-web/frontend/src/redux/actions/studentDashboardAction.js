import { STUDENT_DASHBOARD_GET_POINTS_SUCCESS, STUDENT_DASHBOARD_GET_POINTS_FAILED,
    STUDENT_DASHBOARD_GET_EVENTS_SUCCESS, STUDENT_DASHBOARD_GET_EVENTS_FAILED,
    STUDENT_DASHBOARD_GET_APPROVED_EVENTS_SUCCESS, STUDENT_DASHBOARD_GET_APPROVED_EVENTS_FAILED, 
    STUDENT_DASHBOARD_GET_ORDERS_SUCCESS, STUDENT_DASHBOARD_GET_ORDERS_FAILED, 
    STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_SUCCESS, STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_FAILED } from './types';
import {backendUrl} from '../../config';

export const getPoints = () => dispatch => new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/points/?id=${localStorage.getItem('id')}`,{
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
                    type: STUDENT_DASHBOARD_GET_POINTS_SUCCESS,
                    payload: data
                });
                resolve();
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: STUDENT_DASHBOARD_GET_POINTS_FAILED,
                    payload: data
                });
                reject();
            })
        }
    })
    .catch(err => {
        dispatch({
            type: STUDENT_DASHBOARD_GET_POINTS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        });
        reject();
    });  
});

export const getEvents = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/dashboardEvents/?id=${localStorage.getItem('id')}`,{
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
                    type: STUDENT_DASHBOARD_GET_EVENTS_SUCCESS,
                    payload: data
                });
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: STUDENT_DASHBOARD_GET_EVENTS_FAILED,
                    payload: data
                });
            })
        }
    })
    .catch(err => {
        dispatch({
            type: STUDENT_DASHBOARD_GET_EVENTS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        });
    });  
};

export const getApprovedEvents = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/dashboardApprovedEvents/?id=${localStorage.getItem('id')}`,{
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
                    type: STUDENT_DASHBOARD_GET_APPROVED_EVENTS_SUCCESS,
                    payload: data
                });
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: STUDENT_DASHBOARD_GET_APPROVED_EVENTS_FAILED,
                    payload: data
                });
            })
        }
    })
    .catch(err => {
        dispatch({
            type: STUDENT_DASHBOARD_GET_APPROVED_EVENTS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        });
    });  
};

export const getOrders = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/dashboardOrders/?id=${localStorage.getItem('id')}`,{
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
                    type: STUDENT_DASHBOARD_GET_ORDERS_SUCCESS,
                    payload: data
                });
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: STUDENT_DASHBOARD_GET_ORDERS_FAILED,
                    payload: data
                });
            })
        }
    })
    .catch(err => {
        dispatch({
            type: STUDENT_DASHBOARD_GET_ORDERS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        });
    });  
};

export const getDeliveredOrders = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/dashboardDeliveredOrders/?id=${localStorage.getItem('id')}`,{
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
                    type: STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_SUCCESS,
                    payload: data
                });
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_FAILED,
                    payload: data
                });
            })
        }
    })
    .catch(err => {
        dispatch({
            type: STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        });
    });  
};