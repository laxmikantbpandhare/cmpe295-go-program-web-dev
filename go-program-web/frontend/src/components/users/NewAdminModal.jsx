import React, {Component} from 'react';
import '../../Common.css';
import {connect} from 'react-redux';
import {createAdmin, resetCreateResponseMessageProps} from '../../redux/actions/adminUsersAction';
import {idPattern, emailPattern} from '../../config';

class NewAdminModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            fname:"",
            lname:"",
            email:"",
            id: "",
            message: "",
            status: "success",
            loader: false
        }
    }
    
    hideModal = e => {
        this.props.hideNewAdminModal();
        this.props.resetCreateResponseMessageProps();
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

    handleSubmit = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ 
                message: "All fields are mandatory.",
                status: "failed"
            });
            return;
        } else if(!this.isEmailAndIdAccepted()){
            this.setState({ 
                message: "Please enter correct SJSU ID and SJSU Email Id",
                status: "failed"
            });
            return;
        } else {
            this.setState(
                { 
                    message: "",
                    status: "success",
                    loader: true
                }
            );
        }
        
        const {message, loader, ...data} = this.state;

        this.props.createAdmin(data).then(() => {
            this.hideModal();
            this.props.resetCreateResponseMessageProps();
        }).catch(() => {
            this.setState({
                loader: false
            });
        });
    }
    
    render() {
        return(
        <div>
            <div className="modal">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="itemModal">Add Admin</h5>
                        </div>
                        <div className="modal-body">
                            <div className={`status-msg ${this.state.status}`}>
                                {this.state.message}
                            </div>
                            <div className={`status-msg ${this.props.responseStatus}`}>
                                {this.props.responseMessage}
                            </div>
                            <div className="form-group row">
                                <label className="col-4">SJSU ID</label>
                                <div className="col-8">
                                    <input type="number" name="id" placeholder="Enter SJSU ID" onChange={this.handleChange}
                                    className={`form-control ${this.state.id.match(idPattern)?'orig-inp-valid':'orig-inp-invalid'}`}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-4">First Name</label>
                                <div className="col-8">
                                    <input type="text" name="fname" placeholder="Enter First Name" onChange={this.handleChange}
                                    className={`form-control ${this.state.fname!==""?'orig-inp-valid':'orig-inp-invalid'}`}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-4">Last Name</label>
                                <div className="col-8">
                                    <input type="text" name="lname" placeholder="Enter Last Name" onChange={this.handleChange}
                                    className={`form-control ${this.state.lname!==""?'orig-inp-valid':'orig-inp-invalid'}`}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-4">Email ID</label>
                                <div className="col-8">
                                    <input type="email" name="email" placeholder="Enter SJSU Email ID" onChange={this.handleChange}
                                    className={`form-control ${this.state.email.match(emailPattern)?'orig-inp-valid':'orig-inp-invalid'}`}/>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {
                                this.state.loader
                                ? <div className="spinner-border text-primary" role="status"/>
                                : null
                            }
                            <button type="button" onClick = {this.hideModal} className="btn btn-primary btn-style" 
                            data-dismiss="modal">Cancel</button>
                            <button onClick = {this.handleSubmit} className="btn btn-primary btn-style">Submit</button>
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
        createAdmin: data => dispatch(createAdmin(data)),
        resetCreateResponseMessageProps: () => {dispatch(resetCreateResponseMessageProps())}
    };
};

const mapStateToProps = state => {
    return {
        responseMessage: state.adminUsers.createResponseMessage,
        responseStatus: state.adminUsers.createResponseStatus
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewAdminModal);