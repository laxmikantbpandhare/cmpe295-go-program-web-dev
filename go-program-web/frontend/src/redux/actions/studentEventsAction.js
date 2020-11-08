import { STUDENT_CREATE_EVENT_SUCCESS, STUDENT_CREATE_EVENT_FAILED, STUDENT_GET_EVENTS_SUCCESS,
    STUDENT_GET_EVENTS_FAILED, RESET_STUDENT_EVENT_CREATE_RESPONSE_MESSAGE, STUDENT_EVENT_INPUT_CHANGE, STUDENT_EVENT_EDIT_CANCEL, STUDENT_UPDATE_EVENT_SUCCESS, STUDENT_UPDATE_EVENT_FAILED, STUDENT_EVENT_ADD_COMMENT_SUCCESS, STUDENT_EVENT_ADD_COMMENT_FAILED} from './types';
import {backendUrl} from '../../config';

export const getEvents = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/ownEvents`,{
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
                    type: STUDENT_GET_EVENTS_SUCCESS,
                    payload: data
                })
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: STUDENT_GET_EVENTS_FAILED,
                    payload: data
                })
            })
        }
    })
    .catch(err => {
        dispatch({
            type: STUDENT_GET_EVENTS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        })
    });  
};

const saveEventImages = (images,successcb, failurecb) => {
    if(images.length > 0){
        const formData = new FormData();
        for(var x = 0; x<images.length; x++) {
            formData.append('image', images[x])
        }
        const token = localStorage.getItem('token');
        fetch(`${backendUrl}/upload/images/`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: formData
        })
        .then(res => {
            if(res.status === 200){
                res.json().then(resData => {
                    successcb(resData.imagesName);
                });
            }else{
                res.json().then(resData => {
                    failurecb(resData.message);
                }) 
            }
        })
        .catch(err => {
            failurecb(err);
        });
    } else {
        successcb([]);
    }
}

export const createEvent = data =>  dispatch => new Promise(function(resolve, reject) {
    saveEventImages(data.images, imagesName => {
        data.images = imagesName;
        const token = localStorage.getItem('token');
        // return new Promise(function(resolve, reject) {
            return fetch(`${backendUrl}/student/createEvent`, {
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
                        type: STUDENT_CREATE_EVENT_SUCCESS,
                        payload: resData
                    })
                    resolve();
                });
            }else{
                res.json().then(resData => {
                    dispatch({
                        type: STUDENT_CREATE_EVENT_FAILED,
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
                type: STUDENT_CREATE_EVENT_FAILED,
                payload: {
                    message: `Internal Error -- ${err}`
                }
            });
            reject();
        });

    }, failedMessage => {
            dispatch({
                type: STUDENT_CREATE_EVENT_FAILED,
                payload: {
                    message: failedMessage
                }
            });
            reject();
        }
    );
});

export const resetCreateResponseMessageProps = () => {
    return{
        type: RESET_STUDENT_EVENT_CREATE_RESPONSE_MESSAGE
    }
}

export const eventInputChangeHandler = (id, name, value) => {
    return{
        type: STUDENT_EVENT_INPUT_CHANGE,
        payload: {id, name, value}
    }
}

export const eventEditCancelHandler = (id, previousDesc) => {
    return{
        type: STUDENT_EVENT_EDIT_CANCEL,
        payload: {
            id: id,
            description: previousDesc}
    }
}

export const updateEvent = data =>  dispatch => new Promise(function(resolve, reject) {
    saveEventImages(data.images, imagesName => {
        data.images = imagesName;
        const token = localStorage.getItem('token');
        // return new Promise(function(resolve, reject) {
            return fetch(`${backendUrl}/student/updateEvent`, {
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
                        type: STUDENT_UPDATE_EVENT_SUCCESS,
                        payload: resData
                    });
                    resolve();
                });
            }else{
                res.json().then(resData => {
                    dispatch({
                        type: STUDENT_UPDATE_EVENT_FAILED,
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
                type: STUDENT_UPDATE_EVENT_FAILED,
                payload: {
                    message: `Internal Error -- ${err}`
                }
            });
            reject();
        });

    }, failedMessage => {
            dispatch({
                type: STUDENT_UPDATE_EVENT_FAILED,
                payload: {
                    message: failedMessage
                }
            });
            reject();
        }
    );
});

export const eventAddStudentComment = data =>  dispatch =>  
    new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    return fetch(`${backendUrl}/student/addEventComment`, {
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
                    type: STUDENT_EVENT_ADD_COMMENT_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: STUDENT_EVENT_ADD_COMMENT_FAILED,
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
            type: STUDENT_EVENT_ADD_COMMENT_FAILED,
            payload: {
                message: `Internal Error -- ${err}`
            }
        });
        reject();
    });
});