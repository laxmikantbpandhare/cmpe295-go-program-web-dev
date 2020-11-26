import React, {Component} from 'react';
import '../../Common.css';
import {backendUrl} from '../../config';
import {connect} from 'react-redux';
import {getStudent} from '../../redux/actions/studentProfileAction';
import StudentEditProfileModal from './StudentEditProfileModal';

class StudentProfile extends Component {
    constructor(props){
        super(props);
        this.state = {
            showStudentProfileEditModal: false,
            message: "",
            status: "success",
            loader: false,
            studentIdCard: ""
        };
    }

    showStudentProfileEditModal = e => {
        this.setState({showStudentProfileEditModal: true});
    }
    
    hideStudentProfileEditModal = e => {
        this.setState({showStudentProfileEditModal: false});
    }

    componentDidMount() {
        console.log('Inside compoent did mount student profile');
        this.props.getProfile()
        .then(() => {
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
                    status: "failed"
                });
            })
        })
        .catch(() => {

        })
    }

    render() {
        const points = this.props.student.pointsAccumulated - this.props.student.pointsSpent;
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-id-card"></i> Student Profile</h4>
            </div>
            <div className="container below-heading">
                <div className="row justify-content-center">
                    <div className="form-container">
                        <div className={`status-msg ${this.state.status}`}>
                            {this.state.message}
                        </div>
                        <div className={`status-msg ${this.props.responseStatus}`}>
                            {this.state.responseMessage}
                        </div>
                        <img className="signup-image rounded img-thumbnail" src= {this.state.studentIdCard}
                            alt="Responsive Pic"/>
                        <h2>{`${this.props.student.user.fname} ${this.props.student.user.lname}`}</h2>
                        <h5>{this.props.student.sjsuId}</h5>
                        <h5>{this.props.student.user.email}</h5>
                        <h5>{`${points} Points`}</h5>
                        <h5>{this.props.student.major}</h5>
                        <h5>{this.props.student.year}</h5>
                        <button onClick = {this.showStudentProfileEditModal} className="btn btn-primary btn-style">Edit</button>
                    </div>
                </div>
            </div>
            {
                this.state.showStudentProfileEditModal
                ? <StudentEditProfileModal hideStudentProfileEditModal={this.hideStudentProfileEditModal}
                student={this.props.student}/> 
                : null
            }
        </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getProfile: () => dispatch(getStudent())
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.studentProfile.getResponseMessage,
        responseStatus: state.studentProfile.getResponseStatus,
        student: state.studentProfile.student
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile);