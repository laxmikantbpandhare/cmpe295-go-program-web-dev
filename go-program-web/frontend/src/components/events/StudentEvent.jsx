import React, {Component} from 'react';
import '../../Common.css';
import StudentViewEventModal from './StudentViewEventModal';
import Lightbox from 'react-image-lightbox';
import CommentsModal from '../comments/CommentsModal';
import {connect} from 'react-redux';
import {backendUrl} from '../../config';
import {resetAddCommentResponseMessageProps} from '../../redux/actions/studentEventsAction';

class StudentEvent extends Component{
    constructor(props){
        super(props);
        this.state = {
            showStudentViewEventModal: false,
            showCommentsModal: false,
            photoIndex: 0,
            isOpen: false,
            isMore: false,
            message: "",
            status:"success",
            images: []
        };
    }

    showStudentViewEventModal = e => {
        this.setState({showStudentViewEventModal: true});
    }
    
    hideStudentViewEventModal = e => {
        this.setState({showStudentViewEventModal: false});
    }

    showCommentsModal = e => {
        this.setState({showCommentsModal: true});
    }
    
    hideCommentsModal = e => {
        this.props.resetCommentsResponseMessage();
        this.setState({showCommentsModal: false});
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
                    message: `Internal error when fetching item images - ${err}`,
                    status: "failed"
                });
            })
        );

        Promise.all(imagePromises)
        .then(blobs => {
            var images = blobs.map(blob => URL.createObjectURL(blob));
            this.setState({images})
        })
    }

    toggleMore = () => {
        this.setState({ isMore: !this.state.isMore });
    }
    
    render() {
        const { photoIndex, isOpen } = this.state;
        var isLongDesc = false;
        let trimmedDescription = this.props.event.description.split('\n')[0];
        if(trimmedDescription.length> 25 || this.props.event.description.split('\n').length>1){
            isLongDesc = true;
        }
        trimmedDescription = trimmedDescription.length > 25 
                                    ? trimmedDescription.substring(0,25)
                                    : trimmedDescription;
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                    <div className={`status-msg ${this.state.status}`}>
                        {this.state.message}
                    </div>
                    <div className="card d-flex flex-row">
                        <img src={this.state.images[0]} className="img-fluid entity-card-image m-1" alt="..."/>
                        <div className="card-body card-body-lesspad">
                            <h5 className="card-title font-weight-bold">{this.props.event.event.name}</h5>
                            {
                                isLongDesc
                                ? <p className="card-text text-pre-wrap">
                                    {this.state.isMore ? this.props.event.description : `${trimmedDescription} ...`}
                                    <button type="button" className="btn btn-link view-details-color"
                                        onClick = {this.toggleMore}>
                                        {this.state.isMore ? 'Read Less' : 'Read More'}</button>
                                </p>
                                : <p className="card-text">{this.props.event.description}</p>
                            }
                            <p className="card-text"><strong>Points: </strong>{this.props.event.event.points}</p>
                            <p className="card-text"><strong>Status: </strong>{this.props.event.status}</p>
                            <p className="card-text"><strong>Completed Date: </strong>
                                {new Date(this.props.event.completedDate).toLocaleDateString()}
                            </p>
                            <p className="card-text"><strong>Submitted Date: </strong>
                                {new Date(this.props.event.createdDate).toLocaleString()}
                            </p>
                            <div className="d-flex flex-row">
                                <button type="button" className="btn btn-link view-details-color"
                                onClick={() => this.setState({ isOpen: true })}>
                                    <i className="fas fa-search-plus"/> Images
                                </button>
                                {
                                    this.props.event.status === "Action Required"
                                    ? <button type="button" className="btn btn-link view-details-color"
                                    onClick = {this.showStudentViewEventModal}>
                                        <i className="fas fa-edit"/> Edit
                                    </button>
                                    : null
                                }
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
                {this.state.showStudentViewEventModal ? 
                <StudentViewEventModal hideStudentViewEventModal={this.hideStudentViewEventModal}
                event={this.props.event}/> : null}

                {this.state.showCommentsModal ? 
                <CommentsModal hideCommentsModal={this.hideCommentsModal}
                id={this.props.event._id} comments={this.props.event.comments}
                responseMessage = {this.props.commentsResponseMessage}
                responseStatus = {this.props.commentsResponseStatus}
                commenter="Student" type="Event"/> : null}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        commentsResponseMessage: state.studentEvents.addCommentResponseMessage,
        commentsResponseStatus: state.studentEvents.addCommentResponseStatus
    }
}

const mapDispatchToProps = dispatch => {
    return {
        resetCommentsResponseMessage: () => {dispatch(resetAddCommentResponseMessageProps())}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentEvent);