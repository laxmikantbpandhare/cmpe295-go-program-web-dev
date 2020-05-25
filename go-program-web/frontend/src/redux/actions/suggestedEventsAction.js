import { STUDENT_GET_SUGGESTED_EVENTS_SUCCESS, STUDENT_GET_SUGGESTED_EVENTS_FAILED, 
    STUDENT_CREATE_SUGGESTED_EVENT_SUCCESS, STUDENT_CREATE_SUGGESTED_EVENT_FAILED, 
    RESET_STUDENT_SUGGESTED_EVENT_CREATE_RESPONSE_MESSAGE, STUDENT_SUGGESTED_EVENT_ADD_COMMENT_SUCCESS, 
    STUDENT_SUGGESTED_EVENT_ADD_COMMENT_FAILED} from './types';
import {backendUrl} from '../../config';

export const getEvents = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/ownSuggestedEvents/?id=${localStorage.getItem('id')}`,{
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
                    type: STUDENT_GET_SUGGESTED_EVENTS_SUCCESS,
                    payload: data
                })
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: STUDENT_GET_SUGGESTED_EVENTS_FAILED,
                    payload: data
                })
            })
        }
    })
    .catch(err => {
        dispatch({
            type: STUDENT_GET_SUGGESTED_EVENTS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        })
    });  
};

export const createEvent = data =>  dispatch => 
    new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    return fetch(`${backendUrl}/student/createSuggestedEvent`, {
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
                    type: STUDENT_CREATE_SUGGESTED_EVENT_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: STUDENT_CREATE_SUGGESTED_EVENT_FAILED,
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
            type: STUDENT_CREATE_SUGGESTED_EVENT_FAILED,
            payload: {
                message: `Internal Error -- ${err}`
            }
        });
        reject();
    });
});

export const resetCreateResponseMessageProps = () => {
    return{
        type: RESET_STUDENT_SUGGESTED_EVENT_CREATE_RESPONSE_MESSAGE
    }
}

export const suggestedEventAddStudentComment = data =>  dispatch =>  
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
                    type: STUDENT_SUGGESTED_EVENT_ADD_COMMENT_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: STUDENT_SUGGESTED_EVENT_ADD_COMMENT_FAILED,
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
            type: STUDENT_SUGGESTED_EVENT_ADD_COMMENT_FAILED,
            payload: {
                message: `Internal Error -- ${err}`
            }
        });
        reject();
    });
});