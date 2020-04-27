import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import collegeLogo from '../../images/coe_logo.png';
import '../../Common.css';
import './Signup.css';
import {backendUrl, academicYear, major, idPattern, emailPattern} from '../../config';

class Signup extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            email: "",
            fname: "",
            lname: "",
            password: "",
            major: "",
            year: "",
            message: "",
            success: false
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }    
    
    componentDidMount(){
        this.setState({
            success : false
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    isFieldEmpty = () => {
        if(this.state.id === "" || this.state.email === "" || this.state.fname === "" || 
        this.state.lname === "" || this.state.password === "" || this.state.major === "" || 
        this.state.year === ""){
            return true;
        } else {
            return false;
        }
    }

    isEmailAndIdAccepted = () => {
        if(this.state.id.match(idPattern) && this.state.email.match(emailPattern)){
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
        if(!this.isEmailAndIdAccepted()){
            this.setState({ message: "Please enter correct SJSU ID and SJSU Email Id" });
            return;
        }

        const data = {
            id: this.state.id,
            email: this.state.email,
            fname: this.state.fname,
            lname: this.state.lname,
            password: this.state.password,
            major: this.state.major,
            year: this.state.year
        }

        fetch(`${backendUrl}/user/signup`, {
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
                        success : true
                    });

                });
            }else{
                res.json().then(resData => {
                    this.setState({
                        success : false,
                        message: resData.message
                    });
                });
                
            }
        })
    }

    render() {
        let redirectVar = null;
        if(this.state.success){
            redirectVar = <Redirect to= "/login"/>
        }
        return(
        <div>{redirectVar}
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-sm-10 col-md-8 col-lg-6">
                        <form className="form-container">
                            <div className="d-flex align-items-center justify-content-center">
                                <img src={collegeLogo} alt="College logo"  className="img-fluid coe-logo text-center"/>
                            </div>
                            <h4 className="text-center font-weight-bold">Sign Up</h4>
                            <h6 className="mb-4" style={{color:"red"}}>{this.state.message}</h6>
                            <div className="form-group input-wrapper mb-4">
                                <input type = "text" name="id" placeholder = "Enter SJSU ID" onChange={this.handleChange}
                                className={`form-control form-input ${this.state.id.match(idPattern)?'input-valid':'input-invalid'}`} />
                                <label className="form-label">SJSU Id</label>
                            </div>
                            <div className="form-group input-wrapper mb-4">
                                <input type = "text" name="fname" placeholder = "Enter First Name" onChange={this.handleChange}
                                className={`form-control form-input ${this.state.fname !== "" ?'input-valid':'input-invalid'}`} />
                                <label className="form-label">First Name</label>
                            </div>
                            <div className="form-group input-wrapper mb-4">
                                <input type = "text" name="lname" placeholder = "Enter Last Name" onChange={this.handleChange}
                                className={`form-control form-input ${this.state.lname !== "" ?'input-valid':'input-invalid'}`} />
                                <label className="form-label">Last Name</label>
                            </div>
                            <div className="form-group input-wrapper mb-4">
                                <input type = "email" name="email" placeholder = "Enter Email Id" onChange={this.handleChange}
                                className={`form-control form-input ${this.state.email.match(emailPattern)?'input-valid':'input-invalid'}`} />
                                <label className="form-label">Email Id</label>
                            </div>
                            <div className="form-group input-wrapper mb-4">
                                <input type = "password" name="password" placeholder = "Set New Password" onChange={this.handleChange}
                                className={`form-control form-input ${this.state.password !== "" ?'input-valid':'input-invalid'}`} />
                                <label className="form-label">Password</label>
                            </div>
                            <div className="form-group input-wrapper mb-4">
                                <select className={`form-control form-input ${this.state.major !== ""?'input-valid':'input-invalid'}`} 
                                name="major" onChange={this.handleChange}>
                                    <option selected value="">Select a Major</option>
                                    {major.map(item => <option>{item}</option>)}
                                </select>
                                <label className="form-label">Major</label>
                            </div>
                            <div className="form-group input-wrapper mb-4">
                                <select className={`form-control form-input ${this.state.year !== ""?'input-valid':'input-invalid'}`} 
                                name="year" onChange={this.handleChange}>
                                    <option selected value="">Select a Academic Year</option>
                                    {academicYear.map(item => <option>{item}</option>)}
                                </select>
                                <label className="form-label">Academic Year</label>
                            </div>    
                            <button className="btn btn-primary btn-block btn-style" onClick={this.handleSubmit}>
                                Submit
                            </button>
                        </form>
                        <div className="signup-info">
                        <h6>Have Account? <Link className="signup-info-color" to="/login">Log in now</Link></h6>
                        <h6><Link className="signup-info-color" to="/">Back to Home</Link></h6>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default Signup;