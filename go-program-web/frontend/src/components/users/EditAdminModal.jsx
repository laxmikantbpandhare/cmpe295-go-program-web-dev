import React, {Component} from 'react';
import '../../Common.css';
import {connect} from 'react-redux';
import {updateAdmin} from '../../redux/actions/adminUsersAction';
import {idPattern, emailPattern} from '../../config';

class EditAdminModal extends Component{

    state = {
        status: this.props.admin.status,
        fname: this.props.admin.fname,
        lname: this.props.admin.lname,
        email: this.props.admin.email,
        id: this.props.admin.id,
        message: "",
        fetchStatus: "success",
        loader: false,
    }

    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    isFieldEmpty = () => {
        if(this.state.id === "" || this.state.fname === "" || this.state.lname === "" 
            || this.state.email === ""){
            return true;
        } else {
            return false;
        }
    }

    isEmailAndIdAccepted = () => {
        if(this.state.id.match(idPattern) && this.state.email.match(emailPattern)){
            return true;
        } 
        return false;
    }

    isUpdatable = () => {
        if(this.state.id !== this.props.admin.id || this.state.email !== this.props.admin.email
            || this.state.fname !== this.props.admin.fname || this.state.lname !== this.props.admin.lname
            || this.state.status !== this.props.admin.status){
            return true;
        } 
        return false;
    }

    handleUpdate = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ message: "All fields are mandatory.",
            fetchStatus: "failed"
        });
            return;
        } else if(!this.isEmailAndIdAccepted()){
            this.setState({ message: "Please enter correct SJSU ID and SJSU Email Id",
            fetchStatus: "failed"
        });
            return;
        } else {
            this.setState(
                { 
                    message: "",
                    fetchStatus: "success",
                    loader: true
                }
            );
        }
        const {loader, message, ...data} = this.state;
        data._id = this.props.admin._id;
        this.props.updateAdmin(data)
        .then(() => {
            this.props.hideEditAdminModal();
        })
        .catch(() => {
            this.setState({
                loader: false,
                message: "Some Internal Error occured. Please refresh and check if the admin is updated. If not, please try again after sometime. If the problem persist, please contact Admin.",
                fetchStatus: "failed"
            });
        });
    }

    options = ['Active', 'Inactive'];
    
    render() {
        // const updateEnabled = this.isUpdatable();
        return(
        <div>
            <div className="modal">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="itemModal">Add Admin</h5>
                        </div>
                        <div className="modal-body">
                            <div className={`status-msg ${this.state.fetchStatus}`}>
                                {this.state.message}
                            </div>
                            <div className={`status-msg ${this.props.responseStatus}`}>
                                {this.props.responseMessage}
                            </div>
                            <div class="form-group row">
                                <label className="col-4">SJSU ID</label>
                                <div className="col-8">
                                    <input type="number" name="id" placeholder="Enter SJSU ID" onChange={this.handleChange}
                                    className={`form-control ${this.state.id.match(idPattern)?'orig-inp-valid':'orig-inp-invalid'}`}
                                    value={this.state.id}/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label className="col-4">First Name</label>
                                <div className="col-8">
                                    <input type="text" name="fname" placeholder="Enter First Name" onChange={this.handleChange}
                                    className={`form-control ${this.state.fname!==""?'orig-inp-valid':'orig-inp-invalid'}`}
                                    value={this.state.fname}/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label className="col-4">Last Name</label>
                                <div className="col-8">
                                    <input type="text" name="lname" placeholder="Enter Last Name" onChange={this.handleChange}
                                    className={`form-control ${this.state.lname!==""?'orig-inp-valid':'orig-inp-invalid'}`}
                                    value={this.state.lname}/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label className="col-4">Email ID</label>
                                <div className="col-8">
                                    <input type="email" name="email" placeholder="Enter SJSU Email ID" onChange={this.handleChange}
                                    className={`form-control ${this.state.email.match(emailPattern)?'orig-inp-valid':'orig-inp-invalid'}`}
                                    value={this.state.email}/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label className="col-4">Status</label>
                                <div className="col-8">
                                    <select className="form-control orig-inp-valid" name="status" onChange={this.handleChange}>
                                        {
                                            this.options.map( option => {
                                                if(option === this.state.status){
                                                    return <option selected key={option}>{option}</option> ;
                                                } else {
                                                    return <option key={option}>{option}</option> ;
                                                }
                                            }
                                            )}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {
                                this.state.loader
                                ? <div className="spinner-border text-primary" role="status"/>
                                : null
                            }
                            {/* <button type="button" onClick = {this.handleEditCancel} className="btn btn-primary btn-style" 
                                data-dismiss="modal">Cancel</button> */}
                            <button type="button" onClick = {() => this.props.hideEditAdminModal()} className="btn btn-primary btn-style" 
                                data-dismiss="modal">Cancel</button>
                            <button onClick = {this.handleUpdate} disabled ={!this.isUpdatable()}
                                className="btn btn-primary btn-style">Update</button>
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
        // handleChange: (id, name, value) => {dispatch(adminChangeHandler(id, name, value))},
        // handleEditCancel : item => {dispatch(adminEditCancelHandler(item))},
        updateAdmin: admin => dispatch(updateAdmin(admin))
    };
};

const mapStateToProps = state => {
    return {
        responseMessage: state.adminUsers.updateResponseMessage,
        responseStatus: state.adminUsers.updateResponseStatus
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAdminModal);