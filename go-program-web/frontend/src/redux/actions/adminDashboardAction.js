import { ADMIN_DASHBOARD_GET_PENDING_APPROVAL_EVENTS_SUCCESS, ADMIN_DASHBOARD_GET_PENDING_APPROVAL_EVENTS_FAILED, 
    ADMIN_DASHBOARD_GET_SUBMITTED_ORDERS_SUCCESS, ADMIN_DASHBOARD_GET_SUBMITTED_ORDERS_FAILED } from './types';
import {backendUrl} from '../../config';

export const getPendingApprovalEvents = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/admin/dashboardPendingApprovalEvents`,{
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
                    type: ADMIN_DASHBOARD_GET_PENDING_APPROVAL_EVENTS_SUCCESS,
                    payload: data
                });
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: ADMIN_DASHBOARD_GET_PENDING_APPROVAL_EVENTS_FAILED,
                    payload: data
                });
            })
        }
    })
    .catch(err => {
        dispatch({
            type: ADMIN_DASHBOARD_GET_PENDING_APPROVAL_EVENTS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        });
    });  
};

export const getSubmittedOrders = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/admin/dashboardSubmittedOrders`,{
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
                    type: ADMIN_DASHBOARD_GET_SUBMITTED_ORDERS_SUCCESS,
                    payload: data
                });
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: ADMIN_DASHBOARD_GET_SUBMITTED_ORDERS_FAILED,
                    payload: data
                });
            })
        }
    })
    .catch(err => {
        dispatch({
            type: ADMIN_DASHBOARD_GET_SUBMITTED_ORDERS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        });
    });  
};