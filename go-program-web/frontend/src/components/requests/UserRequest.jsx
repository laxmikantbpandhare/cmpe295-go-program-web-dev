import React, {Component} from 'react';
import '../../Common.css';
import Lightbox from 'react-image-lightbox';
import {connect} from 'react-redux';
import {updateStudentStatus} from '../../redux/actions/usersRequestsAction';
import {backendUrl} from '../../config';
import ViewUserModal from './ViewUserModal';

class UserRequest extends Component{

    state = {
        status: this.props.student.user.status,
        showViewUserModal: false,
        isOpen: false,
        message: "",
        fetchStatus: "success",
        studentIdCard: "",
        loader: false
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        fetch(`${backendUrl}/download/image/?name=${this.props.student.studentIdCard}`,{
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        })
        .then(res => res.blob())
        .then(resAsBlob => {
            this.setState({
                studentIdCard: URL.createObjectURL(resAsBlob)
            });
        })
        .catch(err => {
            this.setState({
                message: `Internal error when fetching student ID Card - ${err}`,
                fetchStatus: "failed"
            });
        })
    }

    showViewUserModal = e => {
        this.setState({showViewUserModal: true});
    }
    
    hideViewUserModal = e => {
        this.setState({showViewUserModal: false});
    }
    
    options = ['Active', 'Inactive'];

    handleSelectChange = e => {
        this.setState({
            status: e.target.value
        });
    }

    isUpdatable = () => {
        if(this.state.status !== this.props.student.user.status){
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
            id: this.props.student.sjsuId
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
        const { isOpen } = this.state;
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                    {
                        this.props.student.sjsuId === this.props.updatedStudent
                        ? <div className={`status-msg ${this.props.responseStatus}`}>
                                {this.props.responseMessage}
                            </div>
                        : null
                    }
                    <div className={`status-msg ${this.state.fetchStatus}`}>
                        {this.state.message}
                    </div>
                    <div className="card d-flex flex-row">
                        <div className="card-body card-body-lesspad">
                            <h5 className="card-title font-weight-bold">{`${this.props.student.user.fname} ${this.props.student.user.lname}`}</h5>
                            <p className="card-text"><strong>SJSU ID: </strong>{this.props.student.sjsuId}</p>
                            <p className="card-text"><strong>Created Date: </strong>
                                {new Date(this.props.student.user.createdDate).toLocaleString()}
                            </p>
                            <p className="card-text"><strong>Updated Date: </strong>
                                {new Date(this.props.student.user.createdDate).toLocaleString()}
                            </p>
                            <div className="row">
                                <div className="col-sm-2 col-3">
                                    <select className="form-control-sm" value={this.state.status}
                                    name="status" onChange={this.handleSelectChange}>
                                        {
                                            this.options.map( option => <option key={option}>{option}</option>)
                                        }
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
                            <div className="d-flex flex-row">
                                <button type="button" className="btn btn-link view-details-color"
                                onClick={() => this.setState({ isOpen: true })}>
                                    <i className="fas fa-search-plus"/> Zoom Student ID Card
                                </button>
                                <button type="button" className="btn btn-link view-details-color"
                                onClick = {this.showViewUserModal}>
                                    <i className="fas fa-eye"/> View Student Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {isOpen && (
                <Lightbox
                    mainSrc={this.state.studentIdCard}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                />
                )}
                {this.state.showViewUserModal ? 
                <ViewUserModal hideViewUserModal={this.hideViewUserModal}
                student={this.props.student}/> : null}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        handleUpdate: data => dispatch(updateStudentStatus(data))
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.usersRequests.statusUpdateResponseMessage,
        responseStatus: state.usersRequests.statusUpdateResponseStatus,
        updatedStudent: state.usersRequests.updatedStudent
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRequest);