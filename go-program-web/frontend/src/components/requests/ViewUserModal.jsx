import React, {Component} from 'react';
import '../../Common.css';
import {connect} from 'react-redux';
import './Requests.css'
import {updateStudentPoints, resetUpdatePointsResponseMessage} from '../../redux/actions/usersRequestsAction';

class ViewUserModal extends Component {
    state = {
        points: this.props.student.pointsAccumulated - this.props.student.pointsSpent,
        loader: false,
        isEdited: false
    };

    componentDidMount() {
        this.props.resetUpdatePointsResponseMessage();
    }

    hideModal = e => {
        this.props.hideViewUserModal();
    }

    editPoints = () => {
        this.setState({
            isEdited: true
        });
    }

    cancelEditPoints = () => {
        this.setState({
            isEdited: false,
            points: this.props.student.pointsAccumulated - this.props.student.pointsSpent
        });
    }

    handleChange = e => {
        this.setState({
            points: e.target.value
        });
    }

    handleUpdate = () => {
        const previousPoints = this.props.student.pointsAccumulated - this.props.student.pointsSpent;
        if(this.state.points === previousPoints){
            return;
        }
        this.setState({
            loader: true
        });
        const data = {
            newPoints: this.state.points,
            previousPoints,
            id: this.props.student.sjsuId
        }
        this.props.handleUpdate(data)
        .then(() => {
            this.setState({
                loader: false,
                isEdited: false
            });
        }).catch(() => {
            this.setState({
                loader: false
            }); 
        });
    }

    render() {
        var updatedDate = null;
        var updatedBy = null;
        if(this.props.student.user.updatedBy){
            updatedDate = (
                <div className="row">
                    <label className="col-3"><strong>Last Updated By</strong></label>
                    <div className="col-9">
                        <p className="text-pre-wrap">{this.props.student.user.updatedBy}</p>
                    </div>
                </div>
            );
            updatedBy = (
                <div className="row">
                    <label className="col-3"><strong>Updated</strong></label>
                    <div className="col-9">
                        <p className="text-pre-wrap">{new Date(this.props.student.user.updatedDate).toLocaleString()}</p>
                    </div>
                </div>
            );
        }
        return(
            <div>
                <div className="modal">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="userModal">
                                View Student
                                </h5>
                            </div>
                                <div className="modal-body">
                                    <div className={`status-msg ${this.props.responseStatus}`}>
                                        {this.props.responseMessage}
                                    </div>
                                    <h5 style = {{textDecoration:'underline'}}>Student Details</h5>  
                                    <div className="row">
                                        <label className="col-3"><strong>Name</strong></label>
                                        <div className="col-9">
                                            <p>{`${this.props.student.user.fname} ${this.props.student.user.lname}`}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-3"><strong>SJSU ID</strong></label>
                                        <div className="col-9">
                                            <p>{this.props.student.sjsuId}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-3"><strong>Email ID</strong></label>
                                        <div className="col-9">
                                            <p>{this.props.student.user.email}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-3"><strong>Major</strong></label>
                                        <div className="col-9">
                                            <p>{this.props.student.major}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-3"><strong>Year</strong></label>
                                        <div className="col-9">
                                            <p>{this.props.student.year}</p>
                                        </div>
                                    </div>
    
                                    <div className="row">
                                        <label className="col-3"><strong>Points</strong></label>
                                        <div className="col-3">
                                            {
                                                this.state.isEdited
                                                ? <input type="number" name="points" placeholder="Points" onChange={this.handleChange}
                                                className="from-control edit-student-points" value={this.state.points}/>
                                                : <p>{this.state.points}</p>
                                            } 
                                        </div>
                                        <div className="col-3">
                                            {
                                                this.state.isEdited
                                                ? <div>
                                                    <span className="correct mr-3" onClick = {this.handleUpdate}>
                                                        <i className="fas fa-check"></i
                                                    ></span>
                                                    <span className="incorrect mr-1" onClick = {this.cancelEditPoints}>
                                                        <i className="fas fa-times"></i>
                                                    </span>
                                                    {
                                                        this.state.loader && <span className="spinner-border spinner-border-sm text-primary" role="status"/>
                                                    }  
                                                </div>
                                                : <span onClick = {this.editPoints} className="edit">
                                                    <i className="fas fa-edit"></i>
                                                </span>
                                            }
                                        </div>
                                    </div>
    
                                    <div className="row">
                                        <label className="col-3"><strong>Created</strong></label>
                                        <div className="col-9">
                                            <p className="text-pre-wrap">{new Date(this.props.student.user.createdDate).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {updatedBy}
                                    {updatedDate}
                            </div>
                            <div className="modal-footer">
                                    <button onClick = {this.hideModal} className="btn btn-primary btn-style" 
                                    data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        handleUpdate: data => dispatch(updateStudentPoints(data)),
        resetUpdatePointsResponseMessage: () => {dispatch(resetUpdatePointsResponseMessage())}
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.usersRequests.pointsUpdateResponseMessage,
        responseStatus: state.usersRequests.pointsUpdateResponseStatus
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewUserModal);