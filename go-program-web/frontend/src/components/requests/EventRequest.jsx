import React, {Component} from 'react';
import '../../Common.css';
import './Requests.css'
import ViewEventRequestModal from './ViewEventRequestModal';
import Lightbox from 'react-image-lightbox';
import {connect} from 'react-redux';
import {eventSelectChangeHandler, updateEventStatus} from '../../redux/actions/eventsRequestsAction';
import CommentsModal from '../comments/CommentsModal';
import {backendUrl} from '../../config';

class EventRequest extends Component{
    constructor(props){
        super(props);
        this.initialStatus = props.event.status;
        this.state = {
            showViewEventRequestModal: false,
            showCommentsModal: false,
            photoIndex: 0,
            isOpen: false,
            initialStatus: this.initialStatus,
            message: "",
            images: []
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        const imagePromises = this.props.event.images.map(imageName => 
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
                this.setState({
                    message: `Internal error when fetching item images - ${err}`
                });
            })
        );

        Promise.all(imagePromises)
        .then(blobs => {
            var images = blobs.map(blob => URL.createObjectURL(blob));
            this.setState({images})
        })
    }

    showViewEventRequestModal = e => {
        this.setState({showViewEventRequestModal: true});
    }
    
    hideViewEventRequestModal = e => {
        this.setState({showViewEventRequestModal: false});
    }

    showCommentsModal = e => {
        this.setState({showCommentsModal: true});
    }
    
    hideCommentsModal = e => {
        this.setState({showCommentsModal: false});
    }
    
    options = ['Pending Approval', 'Approved', 'Rejected', 'Action Required'];

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
            student: {
                id: this.props.event.student._id
            },
            event: {
                points: this.props.event.event.points
            }
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
        const { photoIndex, isOpen } = this.state;
        const updateEnabled = this.state.initialStatus === this.props.event.status ? false : true;
        
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                    {
                        this.props.event._id === this.props.updatedEvent
                        ? <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6>
                        : null
                    }
                    <h6 style= {{color:"red"}}>{this.state.message}</h6>
                    <div className="card d-flex flex-row">
                        <div className="card-body card-body-lesspad">
                            <h5 className="card-title font-weight-bold">{`${this.props.event.student.user.fname} ${this.props.event.student.user.lname}`}</h5>
                            <p className="card-text"><strong>SJSU ID: </strong>{this.props.event.student.sjsuId}</p>
                            <p className="card-text"><strong>Event: </strong>{this.props.event.event.name}</p>
                            <p className="card-text"><strong>Points: </strong>{this.props.event.event.points}</p>
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
                                                    return <option selected key={option}>{option}</option> ;
                                                } else {
                                                    return <option key={option}>{option}</option> ;
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
                                onClick={() => this.setState({ isOpen: true })}>
                                    <i class="fas fa-search-plus"/> View Images
                                </button>
                                <button type="button" className="btn btn-link view-details-color"
                                onClick = {this.showViewEventRequestModal}>
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
                {isOpen && (
                <Lightbox
                    mainSrc={this.state.images[photoIndex]}
                    nextSrc={this.state.images[(photoIndex + 1) % this.state.images.length]}
                    prevSrc={this.state.images[(photoIndex + this.state.images.length - 1) % this.state.images]}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                    onMovePrevRequest={() =>
                    this.setState({
                        photoIndex: (photoIndex + this.state.images.length - 1) % this.state.images.length,
                    })
                    }
                    onMoveNextRequest={() =>
                    this.setState({
                        photoIndex: (photoIndex + 1) % this.state.images.length,
                    })
                    }
                />
                )}
                {this.state.showViewEventRequestModal ? 
                <ViewEventRequestModal hideViewEventRequestModal={this.hideViewEventRequestModal}
                event={this.props.event}/> : null}
                
                {this.state.showCommentsModal ? 
                <CommentsModal hideCommentsModal={this.hideCommentsModal}
                id={this.props.event._id} comments={this.props.event.comments}
                commenter="Admin" type="Event"/> : null}
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
        responseMessage: state.eventsRequests.updateResponseMessage,
        updatedEvent: state.eventsRequests.updatedEvent
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventRequest);