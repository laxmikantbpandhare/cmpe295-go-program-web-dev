import React, {Component} from 'react';
import '../../Common.css';
import './Events.css'
import AdminViewEventModal from './AdminViewEventModal';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {connect} from 'react-redux';
import {deleteEvent} from '../../redux/actions/adminEventsAction';

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

    handleDelete = () => {
        confirmAlert({
            title: 'Delete Event',
            message: 'Are you sure you want to delete this Event?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {this.props.deleteEvent(this.props.event._id);}
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
          });
    }
    
    render() {
        const trimmedDescription = this.props.event.description.length > 35 
                                    ? this.props.event.description.substring(0,35)+"..."
                                    : this.props.event.description;
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                {/* <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6> */}
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
                                onClick = {this.handleDelete}>
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

const mapDispatchToProps = dispatch => {
    return {
        deleteEvent: id => {dispatch(deleteEvent(id))}
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.events.deleteResponseMessage
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminEvent);