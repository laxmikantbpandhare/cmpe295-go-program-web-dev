import React, {Component} from 'react';
import '../../Common.css';
import {connect} from 'react-redux';
import {updateOrderStatus} from '../../redux/actions/ordersRequestsAction';
import CommentsModal from '../comments/CommentsModal';
import {Link} from 'react-router-dom';

class OrderRequest extends Component{
    // constructor(props){
    //     super(props);
    //     this.initialStatus = props.order.status;
    //     this.state = {
    //         showCommentsModal: false,
    //         initialStatus: this.initialStatus
    //     };
    // }

    state = {
        status: this.props.order.status,
        showCommentsModal: false,
        loader: false
    };

    showCommentsModal = e => {
        this.setState({showCommentsModal: true});
    }
    
    hideCommentsModal = e => {
        this.setState({showCommentsModal: false});
    }
    
    options = ['Submitted', 'Pending Delivery', 'Delivered', 'Cancelled'];

    // handleSelectChange = e => {
    //     const {value} = e.target;
    //     this.props.handleSelectChange(this.props.order._id, value);
    // }

    handleSelectChange = e => {
        this.setState({
            status: e.target.value
        });
    }

    isUpdatable = () => {
        if(this.state.status !== this.props.order.status){
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
            id: this.props.order._id,
            student: {
                id: this.props.order.student._id
            },
            points: this.props.order.points,
            items: this.props.order.items
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
        // const updateEnabled = this.state.initialStatus === this.props.order.status ? false : true;
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                {
                    this.props.order._id === this.props.updatedOrder
                    ? <div className={`status-msg ${this.props.responseStatus}`}>
                            {this.props.responseMessage}
                        </div>
                    : null
                }
                    <div className="card d-flex flex-row">
                        <div className="card-body card-body-lesspad">
                            <h5 className="font-weight-bold"><strong>Order Id# </strong>{this.props.order.id}</h5>
                            <p><strong>SJSU ID: </strong>{this.props.order.student.sjsuId}</p>
                            <p><strong>Student Name: </strong>{`${this.props.order.student.user.fname} ${this.props.order.student.user.lname}`}</p>
                            <p><strong>Total Points: </strong>{this.props.order.points}</p>
                            <p><strong>Created Date: </strong>
                                {new Date(this.props.order.createdDate).toLocaleString()}
                            </p>
                            {
                                this.props.order.status === "Delivered" || this.state.initialStatus === "Cancelled"
                                ? <p><strong>Status: </strong>{this.props.order.status}</p>
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
                                <Link to = {`/admin/order-details/${this.props.order._id}`}>
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
                responseMessage = {this.props.commentsResponseMessage}
                responseStatus = {this.props.commentsResponseStatus}
                commenter="Admin" type="Order"/> : null}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // handleSelectChange: (id, value) => {dispatch(orderSelectChangeHandler(id, value))},
        handleUpdate: data => dispatch(updateOrderStatus(data))
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.ordersRequests.updateResponseMessage,
        responseStatus: state.ordersRequests.updateResponseStatus,
        updatedOrder: state.ordersRequests.updatedOrder,
        commentsResponseMessage: state.ordersRequests.addCommentResponseMessage,
        commentsResponseStatus: state.ordersRequests.addCommentResponseStatus
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderRequest);