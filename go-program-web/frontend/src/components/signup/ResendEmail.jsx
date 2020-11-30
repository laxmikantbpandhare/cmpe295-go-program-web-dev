import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import collegeLogo from '../../images/coe_logo.png';
import '../../Common.css';
import {backendUrl, emailPattern} from '../../config';

class ResendEmail extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: "",
            message: "",
            status: "success",
            loader: false
        }
    }    

    handleChange = e => {
        this.setState({
            email : e.target.value
        })
    }

    isFieldEmpty = () => {
        if(this.state.email === ""){
            return true;
        } else {
            return false;
        }
    }

    isEmailAccepted = () => {
        if(this.state.email.match(emailPattern)){
            return true;
        } else {
            return false;
        }
    }

    handleSubmit = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ 
                message: "Email field can't be empty.",
                status: "failed"
            });
            return;
        }
        if(!this.isEmailAccepted()){
            this.setState({ 
                message: "Please enter correct SJSU Email id.",
                status: "failed"
            });
            return;
        }

        this.setState({ 
            loader: true
        });

        const data = {
            email: this.state.email
        }

        fetch(`${backendUrl}/user/resendEmail`, {
            method: "POST",
            headers: {
                'Accept': 'application/json,  text/plain, */*',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        })
        .then(res => {
            if(res.status === 200){
                res.json().then(resData => { 
                    this.setState({
                        email:"",
                        message: resData.message,
                        status: "success",
                        loader: false
                    });
                });
            }else{
                res.json().then(resData => {
                    this.setState({
                        message: resData.message,
                        status: "failed",
                        loader: false
                    });
                });
            }
        })
        .catch(err => {
            this.setState({ 
                message: `Internal Error. ${err}`,
                status: "failed"
            });
        });
    }

    render() {
        let redirectVar = null;
        if(localStorage.getItem('token')){
            redirectVar = <Redirect to= "/login"/>;
        }
        return(
        <div className="container">
            {redirectVar}
            <div className="row d-flex justify-content-center">
                <div className="col-sm-10 col-md-8 col-lg-6">
                    <form className="form-container">
                        <div className="d-flex align-items-center justify-content-center">
                            <img src={collegeLogo} className="img-fluid coe-logo text-center"/>
                        </div>
                        <h4 className="text-center font-weight-bold">Resend Email for Verification</h4>
                        <div className={`mb-4 status-msg ${this.state.status}`}>
                            {this.state.message}
                        </div>
                        <div className="form-group input-wrapper mb-4">
                            <input type = "email" name="email" placeholder = "Enter SJSU Email Id" onChange={this.handleChange}
                            className={`form-control form-input ${this.state.email.match(emailPattern)?'input-valid':'input-invalid'}`} />
                            <label className="form-label">Email Id</label>
                        </div>
                        <button className="btn btn-primary btn-block btn-style" onClick={this.handleSubmit}>
                            Submit&nbsp;&nbsp;&nbsp;
                            {
                                this.state.loader && <div className="spinner-border spinner-border-sm text-light" role="status"/>
                            }
                        </button>
                    </form>
                    <div className="account-info">
                        <h6>Ready to Log in? <Link className="account-info-color" to="/login">Log in</Link></h6>
                        <h6><Link className="account-info-color" to="/">Back to Home</Link></h6>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default ResendEmail;