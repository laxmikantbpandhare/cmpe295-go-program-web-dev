import React, {Component} from 'react';
import '../../Common.css';

class AdminDetails extends Component{
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
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                    <div className="card d-flex flex-row">
                        <div className="card-body card-body-lesspad">
                            <h5 className="card-title font-weight-bold">{`${this.props.admin.fname} ${this.props.admin.lname}`}</h5>
                            <p className="card-text font-smaller"><strong>SJSU ID: </strong>{this.props.admin.id}</p>
                            <p className="card-text font-smaller"><strong>Email ID: </strong>{this.props.admin.email}</p>
                            <p className="card-text font-smaller"><strong>Status: </strong>{this.props.admin.status}</p>
                            <p className="card-text font-smaller"><strong>Created Date: </strong>
                                {new Date(this.props.admin.createdDate).toLocaleString()}
                            </p>
                            <p className="card-text font-smaller"><strong>Updated Date: </strong>
                                {new Date(this.props.admin.createdDate).toLocaleString()}
                            </p>
                            {/* <div className="d-flex flex-row">
                                <button type="button" className="btn btn-link view-details-color"
                                onClick = {this.showCommentsModal}>
                                    <i className="fas fa-comment"/> Comments
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* {this.state.showCommentsModal ? 
                <CommentsModal hideCommentsModal={this.hideCommentsModal}
                id={this.props.event._id} comments={this.props.event.comments}
                commenter="Student" type="SuggestedEvent"/> : null} */}
            </div>
        )
    }
}

export default AdminDetails;