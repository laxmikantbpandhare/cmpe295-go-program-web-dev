import React, {Component} from 'react';
import '../../Common.css';
import CommentsModal from '../comments/CommentsModal';
import {connect} from 'react-redux';

class StudentSuggestion extends Component{
    constructor(props){
        super(props);
        this.state = {
            showCommentsModal: false
        };
    }

    showCommentsModal = e => {
        this.setState({showCommentsModal: true});
    }
    
    hideCommentsModal = e => {
        this.setState({showCommentsModal: false});
    }

    toggleMore = () => {
        this.setState({ isMore: !this.state.isMore });
    }
    
    render() {
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
                    <div className="card d-flex flex-row">
                        <div className="card-body card-body-lesspad">
                            <h5 className="card-title font-weight-bold">{this.props.event.name}</h5>
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
                            <p className="card-text"><strong>Status: </strong>{this.props.event.status}</p>
                            <p className="card-text"><strong>Suggested Date: </strong>
                                {new Date(this.props.event.createdDate).toLocaleString()}
                            </p>
                            <div className="d-flex flex-row">
                                <button type="button" className="btn btn-link view-details-color"
                                onClick = {this.showCommentsModal}>
                                    <i className="fas fa-comment"/> Comments
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.showCommentsModal ? 
                <CommentsModal hideCommentsModal={this.hideCommentsModal}
                id={this.props.event._id} comments={this.props.event.comments}
                responseMessage = {this.props.commentsResponseMessage}
                responseStatus = {this.props.commentsResponseStatus}
                commenter="Student" type="SuggestedEvent"/> : null}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        commentsResponseMessage: state.suggestedEvents.addCommentResponseMessage,
        commentsResponseStatus: state.suggestedEvents.addCommentResponseStatus
    }
}

export default connect(mapStateToProps)(StudentSuggestion);