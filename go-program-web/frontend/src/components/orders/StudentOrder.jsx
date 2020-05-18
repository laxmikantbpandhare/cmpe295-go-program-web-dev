import React, {Component} from 'react';
import '../../Common.css';
import './Orders.css'
import CommentsModal from '../comments/CommentsModal';
import {Link} from 'react-router-dom';

class StudentOrder extends Component{
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

    render() {
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                    <div className="card d-flex flex-row">
                        <div className="card-body card-body-lesspad">
                            <h5 style={{fontSize: '1rem'}} className="font-weight-bold"><strong>Order Id# </strong>{this.props.order.id}</h5>
                            <p className="font-smaller"><strong>Total Points: </strong>{this.props.order.points}</p>
                            <p className="font-smaller"><strong>Created Date: </strong>
                                {new Date(this.props.order.createdDate).toLocaleString()}
                            </p>
                            <p className="font-smaller"><strong>Status: </strong>{this.props.order.status}</p>
                            <div className="d-flex flex-row">
                                <Link to = {`/student/order-details/${this.props.order._id}`}>
                                    <button type="button" className="btn btn-link view-details-color btn-padding">
                                        <i className="fas fa-eye"/> Order Details
                                    </button>
                                </Link>
                                <button type="button" className="btn btn-link view-details-color btn-padding"
                                onClick = {this.showCommentsModal}>
                                    <i className="fas fa-comment"/> Comments
                                </button>
                            </div>
                        </div>
                    </div>
                </div>                
                {this.state.showCommentsModal ? 
                <CommentsModal hideCommentsModal={this.hideCommentsModal}
                id={this.props.order._id} comments={this.props.order.comments}
                commenter="Student" type="Order"/> : null}
            </div>
        )
    }
}

export default StudentOrder;