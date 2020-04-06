import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import '../../Common.css';
import './Events.css'
import AdminViewEventModal from './AdminViewEventModal';

class AdminEvent extends Component{
    constructor(props){
        super(props);
        this.state = {
            showAdminViewEventModal: false
        };
        
    }

    showAdminViewEventModal = e => {
        this.setState({showAdminViewEventModal: true});
    }
    
    hideAdminViewEventModal = e => {
        this.setState({showAdminViewEventModal: false});
    }
    
    render() {
        const trimmedDescription = this.props.event.description.length > 35 
                                    ? this.props.event.description.substring(0,35)+"..."
                                    : this.props.event.description;
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                    <div className="card d-flex flex-row">
                        <div className="card-body card-body-lesspad">
                            <h5 className="card-title font-weight-bold pl-3">{this.props.event.name}</h5>
                            <p className="card-text pl-3">{trimmedDescription}</p>
                            <p className="card-text pl-3"><strong>Points: </strong>{this.props.event.points}</p>
                            <p className="card-text pl-3"><strong>Expiry Date: </strong>{this.props.event.expiry_date}</p>
                            <div className="d-flex flex-row">
                                <button type="button" className="btn btn-link view-details-color"
                                onClick = {this.showAdminViewEventModal}>
                                    <i className="fas fa-eye"/> View Details
                                </button>
                                <button type="button" className="btn btn-link delete-color"
                                onClick = {this.showAdminNewEventModal}>
                                    <i className="fas fa-trash-alt"/> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showAdminViewEventModal ? 
                <AdminViewEventModal hideAdminViewEventModal={this.hideAdminViewEventModal}
                event={this.props.event}/> : null}
            </div>
        )
    }
}
        
export default AdminEvent;