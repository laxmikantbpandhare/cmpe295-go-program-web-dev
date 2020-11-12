import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../../Common.css';
import {backendUrl} from '../../config';

class ChangePassword extends Component {
    state = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        message: "",
        loader: false
    };

    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    isFieldEmpty = () => {
        if(this.state.oldPassword === "" || this.state.newPassword === "" 
            || this.state.confirmPassword === ""){
            return true;
        }
        return false;
    }

    isPasswordConfirmed = () => {
        if(this.state.newPassword === this.state.confirmPassword){
            return true;
        }
        return false;
    }

    isPasswordDifferent = () => {
        if(this.state.oldPassword === this.state.newPassword){
            return false;
        }
        return true;
    }

    handleSubmit = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ message: "All fields are mandatory" });
            return;
        }
        if(!this.isPasswordConfirmed()){
            this.setState({ message: "New Password mismatch. Please enter same password in both the fields." });
            return;
        }

        if(!this.isPasswordDifferent()){
            this.setState({ message: "Old and New Passwords must be different." });
            return;
        }

        this.setState({ 
            loader: true
        });

        const {message, loader,  confirmPassword, ...data} = this.state;
        const token = localStorage.getItem('token');
        fetch(`${backendUrl}/user/changePassword`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify(data)
        })
        .then(res => {
            if(res.status === 200){
                res.json().then(resData => { 
                    this.setState({
                        oldPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                        message: resData.message,
                        loader: false
                    });
                });
            }else{
                res.json().then(resData => {
                    this.setState({
                        message: resData.message,
                        loader: false
                    });
                });
            }
        })
        .catch(err => {
            this.setState({
                message: `Internal Error. ${err}`,
                loader: false
            });
        });
    }

    render() {
        let redirectVar = null;
        if(!localStorage.getItem('token')){
            redirectVar = <Redirect to= "/login"/>
        }
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-key"></i> Change Password</h4>
            </div>
            <div className="container below-heading">
                {redirectVar}
                <div className="row d-flex justify-content-center">
                    <div className="col-sm-10 col-md-8 col-lg-6">
                        <form className="form-container">
                            <h6 className="mb-4" style={{color:"red"}}>{this.state.message}</h6>
                            <div className="form-group input-wrapper mb-4">
                                <input type="password" name = "oldPassword" placeholder = "Enter Old Password" onChange={this.handleChange}
                                className={`form-control form-input ${this.state.oldPassword!=""?'input-valid':'input-invalid'}`}
                                value = {this.state.oldPassword}/>
                                <label className="form-label">Old Password</label>
                            </div>
                            <div className="form-group input-wrapper mb-4">
                                <input type="password" name = "newPassword" placeholder = "Enter New Password" onChange={this.handleChange}
                                className={`form-control form-input ${this.state.newPassword!=""?'input-valid':'input-invalid'}`}
                                value = {this.state.newPassword}/>
                                <label className="form-label">New Password</label>
                            </div>
                            <div className="form-group input-wrapper mb-4">
                                    <input type = "password" name="confirmPassword" placeholder = "Confirm New Password" onChange={this.handleChange}
                                    className={`form-control form-input ${this.state.confirmPassword !== "" ?'input-valid':'input-invalid'}`} 
                                    value = {this.state.confirmPassword}/>
                                    <label className="form-label">Confirm Password</label>
                                </div>
                            <button className="btn btn-primary btn-block btn-style" onClick={this.handleSubmit}>
                                Submit&nbsp;&nbsp;&nbsp;
                                {
                                    this.state.loader && <div className="spinner-border spinner-border-sm text-light" role="status"/>
                                }
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default ChangePassword;