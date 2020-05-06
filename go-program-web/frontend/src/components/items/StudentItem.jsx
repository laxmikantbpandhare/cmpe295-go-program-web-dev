import React from 'react';
import '../../Common.css';
import './Items.css';
import {Link} from 'react-router-dom';

const StudentItem = (props) => {
    const checkPoints = () => {
        return props.pointsBalance >= props.item.points;
    }

    return(
        <div className="col-sm-6 my-1">
            <div className="card d-flex flex-row">
                <img src={props.item.images[0]} className="img-fluid items-card-image align-self-center" alt="..."/>
                <div className="card-body card-body-lesspad">
                    <h5 className="card-title font-weight-bold">{props.item.name}</h5>
                    <p className="card-text"><strong>Points: </strong>{props.item.points}</p>
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
                            disabled = {!checkPoints()}>Select</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default StudentItem;