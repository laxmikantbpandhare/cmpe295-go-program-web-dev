import { STUDENT_CREATE_EVENT_SUCCESS, STUDENT_CREATE_EVENT_FAILED, STUDENT_GET_EVENTS_SUCCESS,
    STUDENT_GET_EVENTS_FAILED, RESET_STUDENT_EVENT_CREATE_RESPONSE_MESSAGE} from './types';
import {backendUrl} from '../../config';

export const getEvents = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/student/events`,{
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
                successcb(resData.imagesUrl);
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
}

export const createEvent = data =>  dispatch => {
    saveEventImages(data.images, imagesUrl => {
        data.images = imagesUrl;
        const token = localStorage.getItem('token');
        fetch(`${backendUrl}/student/createEvent`, {
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
                });
            }else{
                res.json().then(resData => {
                    dispatch({
                        type: STUDENT_CREATE_EVENT_FAILED,
                        payload: {
                            message: resData.message
                        }
                    })
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
        });

    }, failedMessage => {
            dispatch({
                type: STUDENT_CREATE_EVENT_FAILED,
                payload: {
                    message: failedMessage
                }
            });
    });
};

export const resetCreateResponseMessageProps = () => {
    return{
        type: RESET_STUDENT_EVENT_CREATE_RESPONSE_MESSAGE
    }
}