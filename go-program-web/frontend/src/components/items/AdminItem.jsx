import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import '../../Common.css';
import './Items.css'

class AdminItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            
        };
        
    }
    
    render() {
        const trimmedDescription = this.props.item.description.length > 35 
                                    ? this.props.item.description.substring(0,35)+"..."
                                    : this.props.item.description;
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                    <div className="card d-flex flex-row">
                        <img src={this.props.item.images[0]} className="img-fluid events-card-image align-self-center" alt="..."/>
                        <div className="card-body card-body-lesspad">
                            <h5 className="card-title font-weight-bold">{this.props.item.name}</h5>
                            <p className="card-text">{trimmedDescription}</p>
                            <p className="card-text"><strong>Points: </strong>{this.props.item.points}</p>
                            <p className="card-text"><strong>Category: </strong>{this.props.item.category}</p>
                            {/* <div className="d-flex flex-row">
                                <button type="button" 
                                    className="btn btn-primary btn-style mr-2">
                                    Edit
                                </button>
                                <button type="button" 
                                    className="btn btn-primary btn-style mr-2">
                                    Delete
                                </button>
                            </div> */}
                            <h6><Link className="login-info-color" to="/">View Details</Link></h6>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
        
export default AdminItem;