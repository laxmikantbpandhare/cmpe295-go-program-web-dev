import { STUDENT_DASHBOARD_GET_POINTS_SUCCESS, STUDENT_DASHBOARD_GET_POINTS_FAILED,
    STUDENT_DASHBOARD_GET_EVENTS_SUCCESS, STUDENT_DASHBOARD_GET_EVENTS_FAILED,
    STUDENT_DASHBOARD_GET_APPROVED_EVENTS_SUCCESS, STUDENT_DASHBOARD_GET_APPROVED_EVENTS_FAILED, 
    STUDENT_DASHBOARD_GET_ORDERS_SUCCESS, STUDENT_DASHBOARD_GET_ORDERS_FAILED, 
    STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_SUCCESS, STUDENT_DASHBOARD_GET_DELIVERED_ORDERS_FAILED, 
    STUDENT_DASHBOARD_GET_SUGGESTED_EVENTS_SUCCESS, STUDENT_DASHBOARD_GET_SUGGESTED_EVENTS_FAILED, 
    STUDENT_DASHBOARD_GET_APPROVED_SUGGESTED_EVENTS_SUCCESS, 
    STUDENT_DASHBOARD_GET_APPROVED_SUGGESTED_EVENTS_FAILED } from './types';
import {backendUrl} from '../../config';

export const getPoints = () => dispatch => new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/points`,{
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
    fetch(`${backendUrl}/student/dashboardEvents`,{
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
    fetch(`${backendUrl}/student/dashboardApprovedEvents`,{
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
    fetch(`${backendUrl}/student/dashboardOrders`,{
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
    fetch(`${backendUrl}/student/dashboardDeliveredOrders`,{
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

export const getSuggestedEvents = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/dashboardSuggestedEvents`,{
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
                    type: STUDENT_DASHBOARD_GET_SUGGESTED_EVENTS_SUCCESS,
                    payload: data
                });
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: STUDENT_DASHBOARD_GET_SUGGESTED_EVENTS_FAILED,
                    payload: data
                });
            })
        }
    })
    .catch(err => {
        dispatch({
            type: STUDENT_DASHBOARD_GET_SUGGESTED_EVENTS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        });
    });  
};

export const getApprovedSuggestedEvents = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/dashboardApprovedSuggestedEvents`,{
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
                    type: STUDENT_DASHBOARD_GET_APPROVED_SUGGESTED_EVENTS_SUCCESS,
                    payload: data
                });
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: STUDENT_DASHBOARD_GET_APPROVED_SUGGESTED_EVENTS_FAILED,
                    payload: data
                });
            })
        }
    })
    .catch(err => {
        dispatch({
            type: STUDENT_DASHBOARD_GET_APPROVED_SUGGESTED_EVENTS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        });
    });  
};