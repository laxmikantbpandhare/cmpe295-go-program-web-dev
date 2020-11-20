import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import collegeLogo from '../../images/coe_logo.png';
import '../../Common.css';
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
            confirmPassword: "",
            major: "",
            year: "",
            message: "",
            status: "success",
            success: false,
            imageUrl: "",
            image: "",
            loader: false
        }
    }    
    
    componentDidMount(){
        this.setState({
            success : false
        })
    }

    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    isFieldEmpty = () => {
        if(this.state.id === "" || this.state.email === "" || this.state.fname === "" || 
        this.state.lname === "" || this.state.password === "" || this.state.confirmPassword === "" ||
        this.state.major === "" || this.state.year === "" || this.state.imageUrl === ""){
            return true;
        }
        return false;
    }

    isEmailAndIdAccepted = () => {
        if(this.state.id.match(idPattern) && this.state.email.match(emailPattern)){
            return true;
        } 
        return false;
    }

    isPasswordConfirmed = () => {
        if(this.state.password === this.state.confirmPassword){
            return true;
        }
        return false;
    }

    handleFileUpload = (e) => {
        const image = e.target.files[0];
        this.setState({
            image: image,
            imageUrl: URL.createObjectURL(image)
        })
    }

    scrollToMessage = () => {
        this.el.scrollIntoView({ behavior: 'smooth' });
    }

    uploadIdImage = (image, id, successcb, failurecb) => {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('image', image);
        fetch(`${backendUrl}/upload/sjsuIdImage/`, {
            method: "POST",
            credentials: 'include',
            body: formData
        })
        .then(res => {
            if(res.status === 200){
                res.json().then(resData => {
                    successcb(resData.imageName);
                });
            }else{
                res.json().then(resData => {
                    failurecb(resData.message);
                }) 
            }
        })
        .catch(err => {
            this.setState({ 
                message: `Internal Error. ${err}`,
                status: "failed"
            });
        });
    }

    handleSubmit = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ 
                message: "All fields including SJSU Id Card are mandatory",
                status: "failed"
            });
            this.scrollToMessage();
            return;
        }
        if(!this.isEmailAndIdAccepted()){
            this.setState({ 
                message: "Please enter correct SJSU ID and SJSU Email Id",
                status: "failed"
            });
            this.scrollToMessage();
            return;
        }

        if(!this.isPasswordConfirmed()){
            this.setState({ 
                message: "Password mismatch. Please enter same password in both the fields.",
                status: "failed"
            });
            this.scrollToMessage();
            return;
        }

        this.setState({ 
            loader: true
        });

        const {message, success, confirmPassword, imageUrl, image, loader,  ...data} = this.state;
        
        this.uploadIdImage(image, data.id, imageName => {
            data.imageName = imageName;
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
                            message: resData.message,
                            status: "failed",
                            loader: false
                        });
                    });
                    
                }
            })
        }, message => {
            this.setState({
                success : false,
                message,
                status: "failed",
                loader: false
            });
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
                                <img src={collegeLogo} className="img-fluid coe-logo text-center"/>
                            </div>
                            <h4 className="text-center font-weight-bold">Sign Up</h4>
                            <div ref={el => { this.el = el; }} className={`mb-4 status-msg ${this.state.status}`}>
                                {this.state.message}
                            </div>
                            <div className="form-group input-wrapper mb-4">
                                <input type = "number" name="id" placeholder = "Enter SJSU ID" onChange={this.handleChange}
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
                                <input type = "email" name="email" placeholder = "Enter SJSU Email Id" onChange={this.handleChange}
                                className={`form-control form-input ${this.state.email.match(emailPattern)?'input-valid':'input-invalid'}`} />
                                <label className="form-label">Email Id</label>
                            </div>
                            <div className="form-group input-wrapper mb-4">
                                <input type = "password" name="password" placeholder = "Set New Password" onChange={this.handleChange}
                                className={`form-control form-input ${this.state.password !== "" ?'input-valid':'input-invalid'}`} />
                                <label className="form-label">Password</label>
                            </div>
                            <div className="form-group input-wrapper mb-4">
                                <input type = "password" name="confirmPassword" placeholder = "Confirm Password" onChange={this.handleChange}
                                className={`form-control form-input ${this.state.confirmPassword !== "" ?'input-valid':'input-invalid'}`} />
                                <label className="form-label">Confirm Password</label>
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
                                    <option selected value="">Select an Academic Year</option>
                                    {academicYear.map(item => <option>{item}</option>)}
                                </select>
                                <label className="form-label">Academic Year</label>
                            </div> 
                            <div className="input-wrapper">
                                <div className="signup-image-upload">
                                    <label htmlFor="upload"><i className="fas fa-paperclip image-icon-pointer mt-2"></i></label>
                                    <input type="file" id="upload" value="" accept="image/jpeg, image/png, image/jpg"
                                        onChange= {this.handleFileUpload}/>
                                </div>
                                <label className="form-label">Attach a clear copy of SJSU ID Card</label>
                            </div>
                            {this.state.imageUrl && <img className="rounded img-thumbnail signup-image mb-4" src= {this.state.imageUrl} 
                            alt="Responsive image"/>}
                            <button className="btn btn-primary btn-block btn-style" onClick={this.handleSubmit}>
                                Submit&nbsp;&nbsp;&nbsp;
                                {
                                    this.state.loader && <div className="spinner-border spinner-border-sm text-light" role="status"/>
                                }
                            </button>
                        </form>
                        <div className="account-info">
                            <h6>Have Account? <Link className="account-info-color" to="/login">Log in now</Link></h6>
                            <h6><Link className="account-info-color" to="/">Back to Home</Link></h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default Signup;