import { ADMIN_GET_ALL_EVENTS_REQUESTS_SUCCESS, ADMIN_GET_ALL_EVENTS_REQUESTS_FAILED} from './types';
import {backendUrl} from '../../config';

export const getAllEventsRequests = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/allEvents`,{
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
                    type: ADMIN_GET_ALL_EVENTS_REQUESTS_SUCCESS,
                    payload: data
                })
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: ADMIN_GET_ALL_EVENTS_REQUESTS_FAILED,
                    payload: data
                })
            })
        }
    })
    .catch(err => {
        dispatch({
            type: ADMIN_GET_ALL_EVENTS_REQUESTS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        })
    });  
};