import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import '../../Common.css';
import './Events.css'
import {connect} from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {createEvent, resetCreateResponseMessageProps} from '../../redux/actions/adminEventsAction';

class AdminNewEventModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            name:"",
            description:"",
            points:"",
            expiry:"",
            message: ""
        }
        
        this.hideModal = this.hideModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    
    hideModal = e => {
        this.props.hideAdminNewEventModal();
    }

    handleInputChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleDateChange = date => {
        this.setState({
            expiry : date
        })
    }

    isFieldEmpty = () => {
        if(this.state.name === "" || this.state.description === "" || this.state.points === ""){
            return true;
        } else {
            return false;
        }
    }

     handleSubmit = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ message: "Fields marked in red are mandatory." });
            return;
        } else {
            this.setState({ message: "" });
        }

        const data = {
            name: this.state.name,
            description : this.state.description,
            points : this.state.points,
            created_by: localStorage.getItem('id'),
            created_date: new Date().toLocaleString(),
            updated_date: new Date().toLocaleString()
        }
        if(this.state.expiry === null || this.state.expiry === ""){
            data.expiry_date = "";
        } else{
            data.expiry_date = this.state.expiry.toLocaleDateString();
        }

        this.props.createEvent(data).then(() => {
            this.hideModal();
            this.props.resetCreateResponseMessageProps();
        });
    }
    
    render() {
        return(
        <div>
            <div className="modal">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="eventModal">Add Event</h5>
                            <button type="button" className="close" data-dismiss="modal"
                                onClick = {this.hideModal} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form>
                            <div className="modal-body">
                                <h6 style= {{color:"red"}}>{this.state.message}</h6>
                                <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6>
                                <div class="form-group row">
                                    <label className="col-4">Name</label>
                                    <div className="col-8">
                                        <input type="text" name="name" placeholder="Enter Name" onChange={this.handleInputChange}
                                        className={`form-control ${this.state.name!=""?'orig-inp-valid':'orig-inp-invalid'}`}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-4">Description</label>
                                    <div className="col-8">
                                        <textarea className={`form-control ${this.state.description!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                        rows="3" placeholder="Enter a short description" onChange={this.handleInputChange}
                                        name="description"/>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label className="col-4">Points</label>
                                    <div className="col-8">
                                        <input type="number" min="1" name="points" placeholder="Enter Points" onChange={this.handleInputChange}
                                        className={`form-control ${this.state.points!=""?'orig-inp-valid':'orig-inp-invalid'}`}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-4">Expiry Date</label>
                                    <div className="col-8">
                                    <DatePicker
                                        selected={this.state.expiry}
                                        onChange={this.handleDateChange}
                                        className="form-control orig-inp-valid"
                                        dateFormat="MM/dd/yyyy"
                                        todayButton="Today"
                                        showPopperArrow={false}
                                        placeholderText="Click to select a date"
                                        isClearable
                                        withPortal
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                    />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick = {this.hideModal} className="btn btn-primary btn-style" 
                                data-dismiss="modal">Cancel</button>
                                <button onClick = {this.handleSubmit} className="btn btn-primary btn-style">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createEvent: data => dispatch(createEvent(data)),
        resetCreateResponseMessageProps: () => {dispatch(resetCreateResponseMessageProps())}
    };
};

const mapStateToProps = state => {
    return {
        responseMessage: state.inventory.createResponseMessage
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminNewEventModal);