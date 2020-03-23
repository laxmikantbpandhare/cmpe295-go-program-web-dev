import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import collegeLogo from '../../images/coe_logo.png';
import '../../Common.css';

class StudentLogin extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            password: "",
            message: ""
        }    
    }    
    
    render() {
        let redirectVar = null;
        if(localStorage.getItem('token')){

        }
        
        return(
        <div className="container">
            <div className="row vh-100 d-flex align-items-center justify-content-center">
                <div className="col-sm-6">
                    <form className="form-container">
                        <div className="d-flex align-items-center justify-content-center">
                            <img src={collegeLogo} className="img-fluid coe-logo text-center"/>
                        </div>
                        <h4 className="text-center font-weight-bold">Log in</h4>
                        <h6 style={{color:"red"}}>{this.state.message}</h6>
                        <div className="form-group">
                            <input className="form-control no-outline" id="inputId" placeholder = "Enter SJSU ID"/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" id="inputPassword" placeholder = "Enter Password"/>
                        </div>
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input" id="checkboxRemember"/>
                            <label className="form-check-label font-weight-bold" htmlFor="checkboxRemember">Remember Me</label>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block btn-style">Submit</button>
                    </form>
                </div>
            </div>
        </div>
        )
    }
}

export default StudentLogin;