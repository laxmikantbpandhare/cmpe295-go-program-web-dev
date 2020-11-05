import React, {Component} from 'react';
import '../../Common.css';
import {connect} from 'react-redux';
import {updateAdmin, adminChangeHandler, adminEditCancelHandler} from '../../redux/actions/adminUsersAction';
import {idPattern, emailPattern} from '../../config';

class EditAdminModal extends Component{
    constructor(props){
        super(props);
        // this.initialFname = props.admin.fname;
        // this.initialLname = props.admin.lname;
        // this.initialStatus = props.admin.status;
        // this.initialId = props.admin.id;
        // this.initialEmail = props.admin.email;
        this.initialProp = props.admin;
        this.state = {
            message: ""
        }
    }
    
    handleEditCancel = e => {
        this.props.handleEditCancel(this.initialProp);
        this.props.hideEditAdminModal();
        // this.props.resetCreateResponseMessageProps();
    }    

    handleChange = e => {
        const { name, value } = e.target;
        this.props.handleChange(this.props.admin._id, name, value);
    }

    isFieldEmpty = () => {
        if(this.props.admin.id === "" || this.props.admin.fname === "" || this.props.admin.lname === "" 
            || this.props.admin.email === ""){
            return true;
        } else {
            return false;
        }
    }

    isEmailAndIdAccepted = () => {
        if(this.props.admin.id.match(idPattern) && this.props.admin.email.match(emailPattern)){
            return true;
        } 
        return false;
    }

    isUpdatable = () => {
        if(this.props.admin.id !== this.initialProp.id || this.props.admin.email !== this.initialProp.email
            || this.props.admin.fname !== this.initialProp.fname || this.props.admin.lname !== this.initialProp.lname
            || this.props.admin.status !== this.initialProp.status){
            return true;
        } 
        return false;
    }

    handleUpdate = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ message: "All fields are mandatory." });
            return;
        } else if(!this.isEmailAndIdAccepted()){
            this.setState({ message: "Please enter correct SJSU ID and SJSU Email Id" });
            return;
        } else {
            this.setState(
                { 
                    message: "",
                    loader: true
                }
            );
        }
        
        this.props.updateAdmin(this.props.admin)
        .then(() => {
            this.props.hideEditAdminModal();
        })
        .catch(() => {
            this.setState({
                message: "Some Internal Error occured. Please refresh and check if the admin is updated. If not, please try again after sometime. If the problem persist, please comtact Admin."
            });
        });
    }

    options = ['Active', 'Inactive'];
    
    render() {
        const updateEnabled = this.isUpdatable();
        return(
        <div>
            <div className="modal">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="itemModal">Add Admin</h5>
                        </div>
                        <div className="modal-body">
                            <h6 style= {{color:"red"}}>{this.state.message}</h6>
                            <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6>
                            <div class="form-group row">
                                <label className="col-4">SJSU ID</label>
                                <div className="col-8">
                                    <input type="number" name="id" placeholder="Enter SJSU ID" onChange={this.handleChange}
                                    className={`form-control ${this.props.admin.id.match(idPattern)?'orig-inp-valid':'orig-inp-invalid'}`}
                                    value={this.props.admin.id}/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label className="col-4">First Name</label>
                                <div className="col-8">
                                    <input type="text" name="fname" placeholder="Enter First Name" onChange={this.handleChange}
                                    className={`form-control ${this.props.admin.fname!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                    value={this.props.admin.fname}/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label className="col-4">Last Name</label>
                                <div className="col-8">
                                    <input type="text" name="lname" placeholder="Enter Last Name" onChange={this.handleChange}
                                    className={`form-control ${this.props.admin.lname!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                    value={this.props.admin.lname}/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label className="col-4">Email ID</label>
                                <div className="col-8">
                                    <input type="email" name="email" placeholder="Enter SJSU Email ID" onChange={this.handleChange}
                                    className={`form-control ${this.props.admin.email.match(emailPattern)?'orig-inp-valid':'orig-inp-invalid'}`}
                                    value={this.props.admin.email}/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label className="col-4">Status</label>
                                <div className="col-8">
                                    <select className="form-control orig-inp-valid" name="status" onChange={this.handleChange}>
                                        {
                                            this.options.map( option => {
                                                if(option === this.props.admin.status){
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
                            <button type="button" onClick = {this.handleEditCancel} className="btn btn-primary btn-style" 
                                data-dismiss="modal">Cancel</button>
                            <button onClick = {this.handleUpdate} disabled ={!updateEnabled}
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
        handleChange: (id, name, value) => {dispatch(adminChangeHandler(id, name, value))},
        handleEditCancel : item => {dispatch(adminEditCancelHandler(item))},
        updateAdmin: admin => dispatch(updateAdmin(admin))
    };
};

const mapStateToProps = state => {
    return {
        responseMessage: state.adminUsers.createResponseMessage
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAdminModal);