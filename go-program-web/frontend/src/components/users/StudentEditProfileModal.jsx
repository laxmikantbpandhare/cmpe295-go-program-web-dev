import React, {Component} from 'react';
import '../../Common.css';
import {connect} from 'react-redux';
import {selectChangeHandler, editCancelHandler, updateStudent} from '../../redux/actions/studentProfileAction';
import {academicYear, major} from '../../config';

class StudentEditProfileModal extends Component{
    initialProp = this.props.student;
    
    state = {
        message: "",
        status: "success",
        loader: false
    };
    
    hideModal = e => {
        this.props.hideStudentProfileEditModal();
    }
    
    handleSelectChange = e => {
        const { name, value } = e.target;
        this.props.handleSelectChange(name, value);
    }


    isFieldEmpty = () => {
        if(this.props.student.major === "" || this.props.student.year === ""){
            return true;
        } else {
            return false;
        }
    }

    handleEditCancel = () => {
        this.props.handleEditCancel(this.initialProp);
        this.hideModal();
    }

    isUpdatable = () => {
        if(this.props.student.major !== this.initialProp.major || this.props.student.year !== this.initialProp.year){
            return true;
        } 
        return false;
    }

    handleUpdate = () => {
        if(this.isFieldEmpty()){
            this.setState({ 
                message: "All fields are mandatory.",
                status: "failed"
            });
            return;
        } else {
            this.setState({ 
                message: "",
                status: "success",
                loader: true 
            });
        }

        this.props.updateStudent({major: this.props.student.major, year: this.props.student.year})
        .then(() => {
            this.initialProp = this.props.student;
            this.hideModal();
        })
        .catch(() => {
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
                            <h5 className="modal-title" id="eventModal">
                                Edit Profile
                            </h5>
                        </div>
                            <div className="modal-body">
                                <div className={`status-msg ${this.state.status}`}>
                                    {this.state.message}
                                </div>
                                <div className={`status-msg ${this.props.responseStatus}`}>
                                    {this.props.responseMessage}
                                </div>
                                
                                <div className="form-group row">
                                    <label className="col-4">Major</label>
                                    <div className="col-8">
                                        <select className={`form-control ${this.props.student.major!==""?'orig-inp-valid':'orig-inp-invalid'}`}
                                            name="major" onChange={this.handleSelectChange} value={this.props.student.major}>
                                                <option selected value="">Select a Major</option>
                                                {major.map(item => <option>{item}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-4">Year</label>
                                    <div className="col-8">
                                        <select className={`form-control ${this.props.student.year!==""?'orig-inp-valid':'orig-inp-invalid'}`}
                                            name="year" onChange={this.handleSelectChange} value={this.props.student.year}>
                                                <option selected value="">Select a Year</option>
                                                {academicYear.map(item => <option>{item}</option>)}
                                        </select>
                                    </div>
                                </div>
                        </div>
                        <div className="modal-footer">
                            {
                                this.state.loader && <span className="spinner-border text-primary" role="status"/>
                            }
                            <button onClick = {this.handleUpdate} className="btn btn-primary btn-style" disabled={!this.isUpdatable()}>
                                Update
                            </button>
                            <button onClick = {this.handleEditCancel} className="btn btn-primary btn-style" 
                            data-dismiss="modal">Cancel</button>
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
        handleSelectChange: (name, value) => {dispatch(selectChangeHandler(name, value))},
        handleEditCancel : student => {dispatch(editCancelHandler(student))},
        updateStudent: student => dispatch(updateStudent(student))
    };
};


export default connect(null, mapDispatchToProps)(StudentEditProfileModal);