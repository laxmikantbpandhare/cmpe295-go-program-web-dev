import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import collegeLogo from '../../images/coe_logo.png';
import '../../Common.css';
import './Login.css';
import {backendUrl, idPattern} from '../../config';

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            password: "",
            authFlag: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }    
    
    //Call the Will Mount to set the auth Flag to false
    componentDidMount(){
        this.setState({
            authFlag : false
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    isFieldEmpty = () => {
        if(this.state.id === "" || this.state.password === ""){
            return true;
        } else {
            return false;
        }
    }

    isIdAccepted = () => {
        if(this.state.id.match(idPattern)){
            return true;
        } else {
            return false;
        }
    }

    handleSubmit = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ message: "All fields are mandatory" });
            return;
        }
        if(!this.isIdAccepted()){
            this.setState({ message: "Please enter correct SJSU ID" });
            return;
        }

        const data = {
            id: this.state.id,
            password: this.state.password
        }

        fetch(`${backendUrl}/user/login`, {
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
                    localStorage.setItem('id',this.state.id);
                    localStorage.setItem('token', resData.token);
                    localStorage.setItem('userType', resData.user.userType);
                    localStorage.setItem('fname', resData.user.fname);
                    // if(resData.user.userType === "student") {
                    //     localStorage.setItem('lname', resData.user.lname);
                    //     localStorage.setItem('email', resData.user.email);
                    //     localStorage.setItem('major', resData.user.major);
                    //     localStorage.setItem('year', resData.user.year);
                    // }
                    this.setState({
                        authFlag : true
                    });

                });
            }else{
                res.json().then(resData => {
                    this.setState({
                        authFlag : false,
                        message: resData.message
                    });
                });
                
            }
        })
    }

    render() {
        let redirectVar = null;
        if(localStorage.getItem('token')){
            // var userType = localStorage.getItem('userType');
            if(localStorage.getItem('userType')=="student")
                redirectVar = <Redirect to= "/student/dashboard"/>;
            else
                redirectVar = <Redirect to= "/admin/dashboard"/>;
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
                        <h4 className="text-center font-weight-bold">Log in</h4>
                        <h6 className="mb-4" style={{color:"red"}}>{this.state.message}</h6>
                        <div className="form-group input-wrapper">
                            <input type = "number" name="id" placeholder = "Enter SJSU ID" onChange={this.handleChange}
                            className={`form-control form-input ${this.state.id.match(idPattern)?'input-valid':'input-invalid'}`} />
                            <label className="form-label">SJSU Id</label>
                        </div>
                        <div className="form-group input-wrapper mb-4">
                            <input type="password" name = "password" placeholder = "Enter Password" onChange={this.handleChange}
                            className={`form-control form-input ${this.state.password!=""?'input-valid':'input-invalid'}`}/>
                            <label className="form-label">Password</label>
                        </div>
                        <div className="form-group form-check mb-4">
                            <input type="checkbox" className="form-check-input" id="checkboxRemember"/>
                            <label className="form-check-label font-weight-bold" htmlFor="checkboxRemember">Remember Me</label>
                        </div>
                        <button className="btn btn-primary btn-block btn-style" onClick={this.handleSubmit}>
                            Submit
                        </button>
                    </form>
                    <div className="login-info">
                        <h6>No Account Yet? <Link className="login-info-color" to="/signup">Sign up now</Link></h6>
                        <h6><Link className="login-info-color" to="/">Back to Home</Link></h6>
                    </div>
                    
                </div>
            </div>
        </div>
        )
    }
}

export default Login;