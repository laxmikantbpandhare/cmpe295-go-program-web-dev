import React, {Component} from 'react';
import '../../Common.css';
import ViewSuggestedEventRequestModal from './ViewSuggestedEventRequestModal';
import {connect} from 'react-redux';
import {updateEventStatus} from '../../redux/actions/suggestedEventsRequestsAction';
import CommentsModal from '../comments/CommentsModal';

class SuggestedEventRequest extends Component{

    state = {
        status: this.props.event.status,
        showViewSuggestedEventRequestModal: false,
        showCommentsModal: false,
        loader: false
    };

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
        this.setState({
            status: e.target.value
        });
    }

    isUpdatable = () => {
        if(this.state.status !== this.props.event.status){
            return true;
        } 
        return false;
    }

    handleUpdate = () => {
        this.setState({
            loader: true
        });
        const data = {
            status: this.state.status,
            id: this.props.event._id
        }
        this.props.handleUpdate(data)
        .then(() => {
            this.setState({
                loader: false
            });
        }).catch(() => {
            this.setState({
                loader: false
            });
        });
    }
    
    render() {
        
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                {
                    this.props.event._id === this.props.updatedEvent
                    ? <div className={`status-msg ${this.props.responseStatus}`}>
                            {this.props.responseMessage}
                        </div>
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
                                this.props.event.status === "Approved" 
                                ? <p className="card-text"><strong>Status: </strong>{this.props.event.status}</p>
                                : <div class="row">
                                <div className="col-sm-3 col-6">
                                    <select className="form-control-sm"
                                    name="status" onChange={this.handleSelectChange}>
                                        {
                                            this.options.map( option => {
                                                if(option === this.state.status){
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
                                        onClick={this.handleUpdate} disabled = {!this.isUpdatable()}>
                                        Update Status</button>
                                </div>
                                {
                                    this.state.loader && <span className="spinner-border text-primary" role="status"/>
                                }
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
                responseMessage = {this.props.commentsResponseMessage}
                responseStatus = {this.props.commentsResponseStatus}
                commenter="Admin" type="SuggestedEvent"/> : null}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        handleUpdate: data => dispatch(updateEventStatus(data))
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.suggestedEventsRequests.updateResponseMessage,
        responseStatus: state.suggestedEventsRequests.updateResponseStatus,
        updatedEvent: state.suggestedEventsRequests.updatedEvent,
        commentsResponseMessage: state.suggestedEventsRequests.addCommentResponseMessage,
        commentsResponseStatus: state.suggestedEventsRequests.addCommentResponseStatus
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SuggestedEventRequest);