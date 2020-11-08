import React,{Component} from 'react';
import {connect} from 'react-redux';
import '../../Common.css';
import './Comments.css';
import {eventAddAdminComment} from '../../redux/actions/eventsRequestsAction';
import {eventAddStudentComment} from '../../redux/actions/studentEventsAction';
import {orderAddStudentComment} from '../../redux/actions/studentOrdersAction';
import {orderAddAdminComment} from '../../redux/actions/ordersRequestsAction';
import {suggestedEventAddStudentComment} from '../../redux/actions/suggestedEventsAction';
import {suggestedEventAddAdminComment} from '../../redux/actions/suggestedEventsRequestsAction';

class CommentsModal extends Component {
     //call the constructor method
     constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        this.changeHandler = this.changeHandler.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.state = {
            comment: ""
        }
    }

    hideModal = () => {
        this.props.hideCommentsModal();
    }

    changeHandler = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    //get the first name of owner from backend  
    componentDidMount(){
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        this.el.scrollIntoView({ behavior: 'smooth' });
    }

    clearComment = () => {
        this.setState({
            comment: ""
        })
    }

    addComment = e => {
        e.preventDefault();
        const data = {
            id: this.props.id,
            comment: {
                commenter: this.props.commenter,
                commentDate: new Date().toLocaleString(),
                comment : this.state.comment
            }
        }
        if(this.props.commenter === "Admin" && this.props.type === "Event"){
            this.props.eventAddAdminComment(data)
            .then(() => {
                this.setState({
                    comment: ""
                });
            })
            .catch(() => {
            
            })
        } else if(this.props.commenter === "Student" && this.props.type === "Event"){
            this.props.eventAddStudentComment(data)
            .then(() => {
                this.setState({
                    comment: ""
                });
            })
            .catch(() => {
            
            })
        } else if(this.props.commenter === "Student" && this.props.type === "Order"){
            this.props.orderAddStudentComment(data)
            .then(() => {
                this.setState({
                    comment: ""
                });
            })
            .catch(() => {
            
            })
        } else if(this.props.commenter === "Admin" && this.props.type === "Order"){
            this.props.orderAddAdminComment(data)
            .then(() => {
                this.setState({
                    comment: ""
                });
            })
            .catch(() => {
            
            })
        } else if(this.props.commenter === "Student" && this.props.type === "SuggestedEvent"){
            this.props.suggestedEventAddStudentComment(data)
            .then(() => {
                this.setState({
                    comment: ""
                });
            })
            .catch(() => {
            
            })
        } else if(this.props.commenter === "Admin" && this.props.type === "SuggestedEvent"){
            this.props.suggestedEventAddAdminComment(data)
            .then(() => {
                this.setState({
                    comment: ""
                });
            })
            .catch(() => {
            
            })
        }
    }
    
    render(){
        return (
            <div className="modal" data-backdrop="false">
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Add Comment</h4>
                  </div>
                  <div className="modal-body">     
                    <h5 style= {{color:"red"}}>{this.props.responseMessage}</h5>
                    {
                        this.props.comments.length > 0  
                        ? this.props.comments.map(comment => {
                            return(
                                <div>
                                    <h6 className="comment-info">{comment.commenter}({comment.commentDate})</h6>
                                    <p className="comment-text">{comment.comment}</p>
                                </div>
                            )
                        })
                        : <p>{`No comments yet for this ${this.props.type}`}</p>
                    }
                    
                    <div ref={el => { this.el = el; }} />               
                    <textarea required onChange = {this.changeHandler} placeholder="New Comment"
                        type="text" value = {this.state.comment} className="form-control comment-textarea" 
                        name="comment" rows='3' 
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" onClick = {this.hideModal} 
                        className="btn btn-primary btn-style" data-dismiss="modal">Close</button>
                    <button onClick = {this.clearComment} 
                        className="btn btn-primary btn-style">Clear</button>
                    <button onClick = {this.addComment} 
                        className="btn btn-primary btn-style">Comment</button>
                  </div>
                </div>
              </div>
            </div>
          )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        eventAddAdminComment: data => dispatch(eventAddAdminComment(data)),
        eventAddStudentComment: data => dispatch(eventAddStudentComment(data)),
        orderAddStudentComment: data => dispatch(orderAddStudentComment(data)),
        orderAddAdminComment: data => dispatch(orderAddAdminComment(data)),
        suggestedEventAddStudentComment: data => dispatch(suggestedEventAddStudentComment(data)),
        suggestedEventAddAdminComment: data => dispatch(suggestedEventAddAdminComment(data))
    }
}

const mapStateToProps = (state) => {
    return {
        responseMessage: state.eventsRequests.addCommentResponseMessage
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentsModal);