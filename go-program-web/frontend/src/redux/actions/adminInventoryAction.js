import { ADMIN_CREATE_ITEM_SUCCESS, ADMIN_CREATE_ITEM_FAILED, ADMIN_GET_ITEMS_SUCCESS,
    ADMIN_GET_ITEMS_FAILED, RESET_ITEM_CREATE_RESPONSE_MESSAGE } from './types';
import {backendUrl} from '../../config';

export const getItems = () => dispatch => {
    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/admin/items`,{
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
                    type: ADMIN_GET_ITEMS_SUCCESS,
                    payload: data
                })
            });
        }else{
            res.json().then(data => {
                dispatch({
                    type: ADMIN_GET_ITEMS_FAILED,
                    payload: data
                })
            })
        }
    })
    .catch(err => {
        dispatch({
            type: ADMIN_GET_ITEMS_FAILED,
            payload: {
                message: `Internal error -- ${err}`
            }
        })
    });  
};

const saveItemImages = (images,successcb, failurecb) => {
    if(images.length > 0){
        const formData = new FormData();
        for(var x = 0; x<images.length; x++) {
            formData.append('image', images[x])
        }
        const token = localStorage.getItem('token');
        fetch(`${backendUrl}/upload/item-images/`, {
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
            console.log(err);
        });
    } else {
        successcb([]);
    }
}

export const createItem = data =>  dispatch => {
    saveItemImages(data.images, imagesUrl => {
        // const body = {
        //     user_id: data.id,
        //     user_username: data.username,
        //     user_image: data.image,
        //     images_path: imagesUrl,
        //     content: data.content,
        //     created_date_time: new Date().toLocaleString(),
        //     hashtag: data.hashtag
        // }
        data.images = imagesUrl;
        fetch(`${backendUrl}/admin/createItem`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json,  text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
                },
            credentials: 'include',
            body: JSON.stringify(data)
        })
        .then(res => {
            if(res.status === 200){
                res.json().then(resData => {
                    dispatch({
                        type: ADMIN_CREATE_ITEM_SUCCESS,
                        payload: resData
                    })
                });
            }else{
                console.log("Save failed");
                res.json().then(resData => {
                    dispatch({
                        type: ADMIN_CREATE_ITEM_FAILED,
                        payload: {
                            message: resData.message
                        }
                    })
                }) 
            }
        })
        .catch(err => {
            dispatch({
                type: ADMIN_CREATE_ITEM_FAILED,
                payload: {
                    message: `Internal Error -- ${err}`
                }
            })
        });

    }, failedMessage => {
        let payload = {responseMessage: failedMessage}
            dispatch({
                type: ADMIN_CREATE_ITEM_FAILED,
                payload: payload
            })
    });
};

export const resetCreateResponseMessageProps = () => {
    return{
        type: RESET_ITEM_CREATE_RESPONSE_MESSAGE
    }
}