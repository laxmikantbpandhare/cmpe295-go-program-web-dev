import { REQUESTS_GET_ALL_STUDENTS_SUCCESS, REQUESTS_GET_ALL_STUDENTS_FAILED,
    REQUESTS_UPDATE_STUDENT_STATUS_SUCCESS, REQUESTS_UPDATE_STUDENT_STATUS_FAILED, 
    REQUESTS_STUDENT_EDIT_CANCEL, REQUESTS_UPDATE_STUDENT_POINTS_SUCCESS,
    REQUESTS_UPDATE_STUDENT_POINTS_FAILED, RESET_REQUESTS_STUDENT_POINTS_UPDATE_RESPONSE} from './types';
import {backendUrl} from '../../config';

export const getAllStudents = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/user/allStudents`,{
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
                    type: REQUESTS_GET_ALL_STUDENTS_SUCCESS,
                    payload: data
                })
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: REQUESTS_GET_ALL_STUDENTS_FAILED,
                    payload: data
                })
            })
        }
    })
    .catch(err => {
        dispatch({
            type: REQUESTS_GET_ALL_STUDENTS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        })
    });  
};

export const studentEditCancelHandler = previousProps => {
    return{
        type: REQUESTS_STUDENT_EDIT_CANCEL,
        payload: {student: previousProps}
    }
}

export const updateStudentStatus = data =>  dispatch =>  
    new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    return fetch(`${backendUrl}/user/updateStatus`, {
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
                    type: REQUESTS_UPDATE_STUDENT_STATUS_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: REQUESTS_UPDATE_STUDENT_STATUS_FAILED,
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
            type: REQUESTS_UPDATE_STUDENT_STATUS_FAILED,
            payload: {
                id: data.id,
                message: `Internal Error -- ${err}`
            }
        });
        reject();
    });
});

export const updateStudentPoints = data =>  dispatch =>  
    new Promise(function(resolve, reject) {
    const token = localStorage.getItem('token');
    return fetch(`${backendUrl}/student/updatePoints`, {
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
                    type: REQUESTS_UPDATE_STUDENT_POINTS_SUCCESS,
                    payload: resData
                });
                resolve();
            });
        }else{
            res.json().then(resData => {
                dispatch({
                    type: REQUESTS_UPDATE_STUDENT_POINTS_FAILED,
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
            type: REQUESTS_UPDATE_STUDENT_POINTS_FAILED,
            payload: {
                message: `Internal Error -- ${err}`
            }
        });
        reject();
    });
});

export const resetUpdatePointsResponseMessage = () => {
    return{
        type: RESET_REQUESTS_STUDENT_POINTS_UPDATE_RESPONSE
    }
}