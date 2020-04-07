import { ADMIN_CREATE_EVENT_SUCCESS, ADMIN_CREATE_EVENT_FAILED, ADMIN_GET_EVENTS_SUCCESS,
    ADMIN_GET_EVENTS_FAILED, RESET_EVENT_CREATE_RESPONSE_MESSAGE, ADMIN_EVENT_INPUT_CHANGE,
    ADMIN_EVENT_EDIT_CANCEL, ADMIN_UPDATE_EVENT_SUCCESS, ADMIN_UPDATE_EVENT_FAILED,
    ADMIN_DELETE_EVENT_SUCCESS, ADMIN_DELETE_EVENT_FAILED, ADMIN_EVENT_DATE_CHANGE} from './types';
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

export const createEvent = data =>  dispatch => {
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
                return Promise.resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: ADMIN_CREATE_EVENT_FAILED,
                    payload: {
                        message: resData.message
                    }
                });
                return Promise.reject();
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
        return Promise.reject();
    });
};

export const resetCreateResponseMessageProps = () => {
    return{
        type: RESET_EVENT_CREATE_RESPONSE_MESSAGE
    }
}

export const adminEventInputChangeHandler = (id, name, value) => {
    return{
        type: ADMIN_EVENT_INPUT_CHANGE,
        payload: {id, name, value}
    }
}

export const adminEventDateChangeHandler = (id, date) => {
    return{
        type: ADMIN_EVENT_DATE_CHANGE,
        payload: {id, date}
    }
}

export const adminEventEditCancelHandler = previousProps => {
    return{
        type: ADMIN_EVENT_EDIT_CANCEL,
        payload: {event: previousProps}
    }
}

export const updateEvent = data =>  dispatch =>  {
    const token = localStorage.getItem('token');
    data.updated_date = new Date().toLocaleString();
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
                    payload: {
                        message: resData.message
                    }
                });
                return Promise.resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: ADMIN_UPDATE_EVENT_FAILED,
                    payload: {
                        message: resData.message
                    }
                });
                return Promise.reject();
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
        return Promise.reject();
    });
}

export const deleteEvent = id =>  dispatch =>  {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/admin/deleteEvent`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json,  text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
        credentials: 'include',
        body: JSON.stringify({id: id})
    })
    .then(res => {
        if(res.status === 200){
            res.json().then(resData => {
                dispatch({
                    type: ADMIN_DELETE_EVENT_SUCCESS,
                    payload: {
                        id: id,
                        message: resData.message
                    }
                });
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: ADMIN_DELETE_EVENT_FAILED,
                    payload: {
                        message: resData.message
                    }
                });
            }) 
        }
    })
    .catch(err => {
        dispatch({
            type: ADMIN_DELETE_EVENT_FAILED,
            payload: {
                message: `Internal Error -- ${err}`
            }
        });
    });
}