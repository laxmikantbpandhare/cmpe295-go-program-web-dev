import { REQUESTS_GET_ALL_SUGGESTED_EVENTS_SUCCESS, REQUESTS_GET_ALL_SUGGESTED_EVENTS_FAILED, 
    REQUESTS_SUGGESTED_EVENT_SELECT_CHANGE, REQUESTS_UPDATE_SUGGESTED_EVENT_STATUS_SUCCESS,
     REQUESTS_UPDATE_SUGGESTED_EVENT_STATUS_FAILED, REQUESTS_SUGGESTED_EVENT_ADD_COMMENT_SUCCESS,
     REQUESTS_SUGGESTED_EVENT_ADD_COMMENT_FAILED } from './types';
import {backendUrl} from '../../config';

export const getAllEvents = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/allSuggestedEvents`,{
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
                    type: REQUESTS_GET_ALL_SUGGESTED_EVENTS_SUCCESS,
                    payload: data
                })
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: REQUESTS_GET_ALL_SUGGESTED_EVENTS_FAILED,
                    payload: data
                })
            })
        }
    })
    .catch(err => {
        dispatch({
            type: REQUESTS_GET_ALL_SUGGESTED_EVENTS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        })
    });  
};

export const eventSelectChangeHandler = (id, value) => {
    return{
        type: REQUESTS_SUGGESTED_EVENT_SELECT_CHANGE,
        payload: {id, value}
    }
}

export const updateEventStatus = data =>  dispatch =>  
    new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    return fetch(`${backendUrl}/student/updateSuggestedEventStatus`, {
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
                    type: REQUESTS_UPDATE_SUGGESTED_EVENT_STATUS_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: REQUESTS_UPDATE_SUGGESTED_EVENT_STATUS_FAILED,
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
            type: REQUESTS_UPDATE_SUGGESTED_EVENT_STATUS_FAILED,
            payload: {
                id: data.id,
                message: `Internal Error -- ${err}`
            }
        });
        reject();
    });
});

export const suggestedEventAddAdminComment = data =>  dispatch =>  
    new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    return fetch(`${backendUrl}/student/addSuggestedEventComment`, {
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
                    type: REQUESTS_SUGGESTED_EVENT_ADD_COMMENT_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: REQUESTS_SUGGESTED_EVENT_ADD_COMMENT_FAILED,
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
            type: REQUESTS_SUGGESTED_EVENT_ADD_COMMENT_FAILED,
            payload: {
                message: `Internal Error -- ${err}`
            }
        });
        reject();
    });
});