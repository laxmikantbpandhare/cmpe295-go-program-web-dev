import React, {Component} from 'react';
import '../../Common.css';
import './Requests.css'
import ViewSuggestedEventRequestModal from './ViewSuggestedEventRequestModal';
import {connect} from 'react-redux';
import {eventSelectChangeHandler, updateEventStatus} from '../../redux/actions/suggestedEventsRequestsAction';
import CommentsModal from '../comments/CommentsModal';

class SuggestedEventRequest extends Component{
    constructor(props){
        super(props);
        this.initialStatus = props.event.status;
        this.state = {
            showViewSuggestedEventRequestModal: false,
            showCommentsModal: false,
            initialStatus: this.initialStatus
        };
    }

    showViewSuggestedEventRequestModal = e => {
        this.setState({showViewSuggestedEventRequestModal: true});
    }
    
    hideViewSuggestedEventRequestModal = e => {
        this.setState({showViewSuggestedEventRequestModal: false});
    }

    showCommentsModal = e => {
        this.setState({showCommentsModal: true});
    }
    
    hideCommentsModal = e => {
        this.setState({showCommentsModal: false});
    }
    
    options = ['Pending Approval', 'Approved', 'Rejected'];

    handleSelectChange = e => {
        const {value} = e.target;
        this.props.handleSelectChange(this.props.event._id, value);
    }

    handleUpdate = e => {
        e.preventDefault();
        const data = {
            status: this.props.event.status,
            id: this.props.event._id,
            updatedBy: localStorage.getItem('id'),
        }
        this.props.handleUpdate(data)
        .then(() => {
            this.setState({
                initialStatus: this.props.event.status
            });
        }).catch(() => {
            
        });
    }
    
    render() {
        const updateEnabled = this.state.initialStatus === this.props.event.status ? false : true;
        
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                {
                    this.props.event._id === this.props.updatedEvent
                    ? <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6>
                    : null
                }
                    <div className="card d-flex flex-row">
                        <div className="card-body card-body-lesspad">
                            <h5 className="card-title font-weight-bold">{`${this.props.event.student.user.fname} ${this.props.event.student.user.lname}`}</h5>
                            <p className="card-text"><strong>SJSU ID: </strong>{this.props.event.student.sjsuId}</p>
                            <p className="card-text"><strong>Event: </strong>{this.props.event.name}</p>
                            <p className="card-text"><strong>Submitted Date: </strong>
                                {new Date(this.props.event.createdDate).toLocaleString()}
                            </p>
                            {
                                this.state.initialStatus === "Approved" 
                                ? <p className="card-text"><strong>Status: </strong>{this.props.event.status}</p>
                                : <div class="row">
                                <div className="col-sm-3 col-6">
                                    <select className="form-control-sm"
                                    name="status" onChange={this.handleSelectChange}>
                                        {
                                            this.options.map( option => {
                                                if(option === this.props.event.status){
                                                    return <option selected>{option}</option> ;
                                                } else {
                                                    return <option>{option}</option> ;
                                                }
                                            }
                                            )}
                                    </select>
                                </div>
                                <div className="col-sm-3 col-6">
                                    <button className="btn btn-primary btn-sm" style={{backgroundColor:"#0056a3"}}
                                        onClick={this.handleUpdate} disabled = {!updateEnabled}>
                                        Update Status</button>
                                </div>
                            </div>
                            }
                            <div className="d-flex flex-row">
                                <button type="button" className="btn btn-link view-details-color"
                                onClick = {this.showViewSuggestedEventRequestModal}>
                                    <i className="fas fa-eye"/> View Details
                                </button>
                                <button type="button" className="btn btn-link view-details-color"
                                onClick = {this.showCommentsModal}>
                                    <i className="fas fa-comment"/> Comments
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showViewSuggestedEventRequestModal ? 
                <ViewSuggestedEventRequestModal hideViewSuggestedEventRequestModal={this.hideViewSuggestedEventRequestModal}
                event={this.props.event}/> : null}
                
                {this.state.showCommentsModal ? 
                <CommentsModal hideCommentsModal={this.hideCommentsModal}
                id={this.props.event._id} comments={this.props.event.comments}
                commenter="Admin" type="SuggestedEvent"/> : null}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        handleSelectChange: (id, value) => {dispatch(eventSelectChangeHandler(id, value))},
        handleUpdate: data => dispatch(updateEventStatus(data))
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.suggestedEventsRequests.updateResponseMessage,
        updatedEvent: state.suggestedEventsRequests.updatedEvent
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SuggestedEventRequest);