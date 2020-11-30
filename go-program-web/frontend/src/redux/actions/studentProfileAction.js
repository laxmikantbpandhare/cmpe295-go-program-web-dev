import { STUDENT_PROFILE_GET_SUCCESS, STUDENT_PROFILE_GET_FAILED, STUDENT_PROFILE_SELECT_CHANGE,
    STUDENT_PROFILE_EDIT_CANCEL, STUDENT_PROFILE_UPDATE_SUCCESS,
    STUDENT_PROFILE_UPDATE_FAILED} from './types';
import {backendUrl} from '../../config';

export const getStudent = () => dispatch => new Promise(function(resolve, reject) {
    console.log("Herrrrr")
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/user/student`,{
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
                    type: STUDENT_PROFILE_GET_SUCCESS,
                    payload: data
                });
                resolve();
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: STUDENT_PROFILE_GET_FAILED,
                    payload: data
                });
                reject();
            })
        }
    })
    .catch(err => {
        dispatch({
            type: STUDENT_PROFILE_GET_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        });
        reject();
    });  
});

export const selectChangeHandler = (name, value) => {
    return{
        type: STUDENT_PROFILE_SELECT_CHANGE,
        payload: {name, value}
    }
}

export const editCancelHandler = previousProps => {
    return{
        type: STUDENT_PROFILE_EDIT_CANCEL,
        payload: {student: previousProps}
    }
}

export const updateStudent = data =>  dispatch =>  
    new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    return fetch(`${backendUrl}/user/updateStudent`, {
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
                    type: STUDENT_PROFILE_UPDATE_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: STUDENT_PROFILE_UPDATE_FAILED,
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
            type: STUDENT_PROFILE_UPDATE_FAILED,
            payload: {
                message: `Internal Error -- ${err}`
            }
        });
        return reject();
    });
});