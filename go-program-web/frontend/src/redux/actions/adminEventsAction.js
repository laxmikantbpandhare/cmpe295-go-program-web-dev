import { ADMIN_CREATE_EVENT_SUCCESS, ADMIN_CREATE_EVENT_FAILED, ADMIN_GET_EVENTS_SUCCESS,
    ADMIN_GET_EVENTS_FAILED, ADMIN_GET_ACTIVE_EVENTS_SUCCESS, ADMIN_GET_ACTIVE_EVENTS_FAILED, 
    RESET_ADMIN_EVENT_CREATE_RESPONSE_MESSAGE, ADMIN_EVENT_INPUT_CHANGE, ADMIN_EVENT_EDIT_CANCEL, 
    ADMIN_UPDATE_EVENT_SUCCESS, ADMIN_UPDATE_EVENT_FAILED, ADMIN_EVENT_DATE_CHANGE, 
    RESET_ADMIN_EVENT_UPDATE_RESPONSE_MESSAGE} from './types';
import {backendUrl} from '../../config';

export const getEvents = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/admin/events`,{
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
                    type: ADMIN_GET_EVENTS_SUCCESS,
                    payload: data
                })
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: ADMIN_GET_EVENTS_FAILED,
                    payload: data
                })
            })
        }
    })
    .catch(err => {
        dispatch({
            type: ADMIN_GET_EVENTS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        })
    });  
};

export const getActiveEvents = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/admin/ActiveEvents`,{
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
                    type: ADMIN_GET_ACTIVE_EVENTS_SUCCESS,
                    payload: data
                })
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: ADMIN_GET_ACTIVE_EVENTS_FAILED,
                    payload: data
                })
            })
        }
    })
    .catch(err => {
        dispatch({
            type: ADMIN_GET_ACTIVE_EVENTS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        })
    });  
};

export const createEvent = data =>  dispatch => 
    new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    return fetch(`${backendUrl}/admin/createEvent`, {
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
                    type: ADMIN_CREATE_EVENT_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: ADMIN_CREATE_EVENT_FAILED,
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
            type: ADMIN_CREATE_EVENT_FAILED,
            payload: {
                message: `Internal Error -- ${err}`
            }
        });
        reject();
    });
});

export const resetCreateResponseMessageProps = () => {
    return{
        type: RESET_ADMIN_EVENT_CREATE_RESPONSE_MESSAGE
    }
}

export const eventInputChangeHandler = (id, name, value) => {
    return{
        type: ADMIN_EVENT_INPUT_CHANGE,
        payload: {id, name, value}
    }
}

export const eventDateChangeHandler = (id, date) => {
    return{
        type: ADMIN_EVENT_DATE_CHANGE,
        payload: {id, date}
    }
}

export const eventEditCancelHandler = previousProps => {
    return{
        type: ADMIN_EVENT_EDIT_CANCEL,
        payload: {event: previousProps}
    }
}

export const updateEvent = data =>  dispatch =>  
    new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    return fetch(`${backendUrl}/admin/updateEvent`, {
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
                    type: ADMIN_UPDATE_EVENT_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: ADMIN_UPDATE_EVENT_FAILED,
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
            type: ADMIN_UPDATE_EVENT_FAILED,
            payload: {
                message: `Internal Error -- ${err}`
            }
        });
        return reject();
    });
});

export const resetUpdateResponseMessage = () => {
    return{
        type: RESET_ADMIN_EVENT_UPDATE_RESPONSE_MESSAGE
    }
}