import React,{useState, useEffect} from 'react';
import '../../Common.css';
import './Items.css';
import {Link} from 'react-router-dom';
import {backendUrl} from '../../config';

const StudentItem = (props) => {
    const checkPoints = () => {
        return props.pointsBalance >= props.item.points;
    }

    //Check if at least 1 size is available
    const checkSizeAvailable = () => {
        const isAvailable =  props.item.attributes.some(attribute => attribute.quantity > 0);
        return !isAvailable;
    }

    const [images, setImages] = useState([]);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("success");

    useEffect(() => {
        const token = localStorage.getItem('token');

        const imagePromises = props.item.images.map(imageName => 
            fetch(`${backendUrl}/download/image/?name=${imageName}`,{
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            })
            .then(res => {
                return res.blob()})
            .catch(err => {
                setMessage(`Internal error when fetching item images - ${err}`);
                setStatus("failed");
            })
        );

        Promise.all(imagePromises)
        .then(blobs => {
            var images = blobs.map(blob => URL.createObjectURL(blob));
            setImages(images);
        })
    }, [])

    return(
        <div className="col-sm-6 my-1">
            <div className={`status-msg ${status}`}>
                {message}
            </div>
            <div className="card d-flex flex-row">
                <img src={images[0]} className="img-fluid items-card-image align-self-center" alt="..."/>
                <div className="card-body card-body-lesspad">
                    <h5 className="card-title font-weight-bold">{props.item.name}</h5>
                    <p className="card-text"><strong>Points: </strong>{props.item.points}</p>
                    <p className="card-text"><strong>Category: </strong>{props.item.category}</p>
                    <p className="card-text"><strong>Available Sizes/Quantity: </strong>
                        {
                            props.item.attributes.map((attribute,index) => {
                                if(index === props.item.attributes.length - 1){
                                    return `${attribute.size}/${attribute.quantity}`;
                                } else {
                                    return `${attribute.size}/${attribute.quantity}, `;
                                } 
                            })
                        }
                    </p>
                    <Link to = {`/student/item-details/${props.item._id}`}>
                        <button type="button" className="btn btn-primary btn-style mt-2" 
                            disabled = {checkSizeAvailable() || !checkPoints()}>Select</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default StudentItem;