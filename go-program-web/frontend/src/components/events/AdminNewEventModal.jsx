import React, {Component} from 'react';
import '../../Common.css';
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
            points:0,
            expiry:null,
            message: "",
            status: "success",
            loader: false
        }
    }
    
    hideModal = e => {
        this.props.hideAdminNewEventModal();
        this.props.resetCreateResponseMessageProps();
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
        if(this.state.name === "" || this.state.description === "" || this.state.points < 1){
            return true;
        } else {
            return false;
        }
    }

    handleSubmit = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ 
                message: "Fields marked in red are mandatory. Points cannot be less than 1.",
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
        const data = {
            name: this.state.name,
            description : this.state.description,
            points : this.state.points,
            expiryDate: this.state.expiry
        }

        this.props.createEvent(data).then(() => {
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
                            <h5 className="modal-title" id="eventModal">Add Event</h5>
                        </div>
                            <div className="modal-body">
                                <div className={`status-msg ${this.state.status}`}>
                                    {this.state.message}
                                </div>
                                <div className={`status-msg ${this.props.responseStatus}`}>
                                    {this.props.responseMessage}
                                </div>
                                <div class="form-group row">
                                    <label className="col-3">Name</label>
                                    <div className="col-9">
                                        <input type="text" name="name" placeholder="Enter Name" onChange={this.handleInputChange}
                                        className={`form-control ${this.state.name!==""?'orig-inp-valid':'orig-inp-invalid'}`}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-3">Description</label>
                                    <div className="col-9">
                                        <textarea className={`form-control ${this.state.description!==""?'orig-inp-valid':'orig-inp-invalid'}`}
                                        rows="3" placeholder="Enter a short description" onChange={this.handleInputChange}
                                        name="description"/>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label className="col-3">Points</label>
                                    <div className="col-9">
                                        <input type="number" min="1" name="points" placeholder="Enter Points" onChange={this.handleInputChange}
                                        className={`form-control ${this.state.points>0?'orig-inp-valid':'orig-inp-invalid'}`}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-3">Expiry Date</label>
                                    <div className="col-9">
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
        createEvent: data => dispatch(createEvent(data)),
        resetCreateResponseMessageProps: () => {dispatch(resetCreateResponseMessageProps())}
    };
};

const mapStateToProps = state => {
    return {
        responseMessage: state.adminEvents.createResponseMessage,
        responseStatus: state.adminEvents.createResponseStatus
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminNewEventModal);