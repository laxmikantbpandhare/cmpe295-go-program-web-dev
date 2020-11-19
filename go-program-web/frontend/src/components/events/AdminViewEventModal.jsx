import React, {Component} from 'react';
import '../../Common.css';
import './Events.css'
import {connect} from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {eventInputChangeHandler, eventEditCancelHandler, updateEvent,
    eventDateChangeHandler} from '../../redux/actions/adminEventsAction';

class AdminViewEventModal extends Component{
    // constructor(props){
    //     super(props);
    //     this.initialProp = props.event;
    //     this.state = {
    //         message: "",
    //         isEdited: false
    //     }
    //     this.hideModal = this.hideModal.bind(this);
    // }

    initialProp = this.props.event;
    
    state = {
        name: this.props.event.name,
        message: "",
        status: "success",
        isEdited: false,
        loader: false
    };
    
    hideModal = e => {
        this.props.hideAdminViewEventModal();
    }
    
    handlePropsInputChange = e => {
        const { name, value } = e.target;
        this.props.handleInputChange(this.props.event._id, name, value);
    }

    handleStateInputChange = e => {
        this.setState({
            name: e.target.value
        });
    }

    handleDateChange = date => {
        this.props.handleDateChange(this.props.event._id, date);
    }

    isFieldEmpty = () => {
        if(this.state.name === "" || this.props.event.description === "" || this.props.event.points < 1){
            return true;
        } else {
            return false;
        }
    }

    handleEditCancel = () => {
        this.props.handleEditCancel(this.initialProp);
        this.setState({
            isEdited: false
        });
    }

    isUpdatable = () => {
        const oldDate = new Date(this.initialProp.expiryDate).toLocaleDateString();
        const newDate = new Date(this.props.event.expiryDate).toLocaleDateString();

        if(this.state.name !== this.props.event.name || this.props.event.description !== this.initialProp.description
            || this.props.event.points !== this.initialProp.points || newDate !== oldDate){
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

        this.props.updateEvent({...this.props.event, name: this.state.name}).then(() => {
            this.initialProp = this.props.event;
            this.setState({
                isEdited: false,
                loader: false
            });
        }).catch(() => {
            this.setState({
                loader: false
            });
        });
        
    }

    editEvent = () => {
        this.setState({
            isEdited: true
        });
    }
    
    render() {
        var updatedDate = null;
        var updatedBy = null;
        if(this.props.event.updatedBy){
            updatedDate = (
                <div className="form-group row">
                    <label className="col-4">Updated Date</label>
                    <div className="col-8">
                        <p>{new Date(this.props.event.updatedDate).toLocaleString()}</p>                                       
                    </div>
                </div>
            );
            updatedBy = (
                <div className="form-group row">
                    <label className="col-4">Last Updated By<strong className="font-italic">(SJSU ID)</strong></label>
                    <div className="col-8">
                        <p>{this.props.event.updatedBy}</p>                                       
                    </div>
                </div>
            );
        }
        return(
        <div>
            <div className="modal">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="eventModal">
                            {
                                this.state.isEdited
                                ? `Edit Event`
                                : `View Event Details`
                            }
                            </h5>
                        </div>
                            <div className="modal-body">
                                <div className={`status-msg ${this.state.status}`}>
                                    {this.state.message}
                                </div>
                                <div className={`status-msg ${this.props.responseStatus}`}>
                                    {this.props.responseMessage}
                                </div>
                                <div class="form-group row">
                                    <label className="col-4">Name</label>
                                    <div className="col-8">
                                        {
                                            this.state.isEdited
                                            ? <input type="text" name="name" placeholder="Enter Name" onChange={this.handleStateInputChange}
                                            className={`form-control ${this.state.name!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                            value={this.state.name}/>
                                            : <p>{this.props.event.name}</p>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-4">Description</label>
                                    <div className="col-8">
                                        {
                                            this.state.isEdited
                                            ? <textarea className={`form-control ${this.state.description!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                            rows="3" placeholder="Enter a short description" onChange={this.handlePropsInputChange}
                                            name="description" value = {this.props.event.description}/>
                                            : <p className="text-pre-wrap">{this.props.event.description}</p>
                                        }
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label className="col-4">Points</label>
                                    <div className="col-8">
                                        {
                                            this.state.isEdited
                                            ? <input type="number" min="1" name="points" placeholder="Enter Points" onChange={this.handlePropsInputChange}
                                            className={`form-control ${this.props.event.points>0?'orig-inp-valid':'orig-inp-invalid'}`}
                                            value={this.props.event.points}/>
                                            : <p>{this.props.event.points}</p>
                                        }  
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label className="col-4">Expiry Date</label>
                                    <div className="col-8">
                                        {
                                            this.state.isEdited
                                            ? <DatePicker
                                                selected={
                                                    this.props.event.expiryDate
                                                    ? new Date(this.props.event.expiryDate)
                                                    : null
                                                }
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
                                            : <p>{
                                                this.props.event.expiryDate
                                                ? new Date(this.props.event.expiryDate).toLocaleDateString()
                                                : null
                                                }
                                            </p>
                                        }  
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-4">Created By<strong className="font-italic">(SJSU ID)</strong></label>
                                    <div className="col-8">
                                        <p>{this.props.event.createdBy}</p>                                       
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-4">Created Date</label>
                                    <div className="col-8">
                                        <p>{new Date(this.props.event.createdDate).toLocaleString()}</p>                                       
                                    </div>
                                </div>
                                {updatedBy}
                                {updatedDate}
                        </div>
                        {
                            this.state.isEdited
                            ? <div className="modal-footer">
                                {
                                    this.state.loader && <span className="spinner-border text-primary" role="status"/>
                                }
                                <button onClick = {this.handleUpdate} className="btn btn-primary btn-style" disabled={!this.isUpdatable()}>
                                    Update
                                </button>
                                <button onClick = {this.handleEditCancel} className="btn btn-primary btn-style" 
                                data-dismiss="modal">Cancel</button>
                            </div>
                            : <div className="modal-footer">
                                <button onClick = {this.editEvent} className="btn btn-primary btn-style">Edit</button>
                                <button onClick = {this.hideModal} className="btn btn-primary btn-style" 
                                data-dismiss="modal">Close</button>
                            </div>
                        }
                        
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        handleInputChange: (id, name, value) => {dispatch(eventInputChangeHandler(id, name, value))},
        handleDateChange: (id, date) => {dispatch(eventDateChangeHandler(id, date))},
        handleEditCancel : event => {dispatch(eventEditCancelHandler(event))},
        updateEvent: event => dispatch(updateEvent(event))
    };
};

const mapStateToProps = state => {
    return {
        responseMessage: state.adminEvents.updateResponseMessage,
        responseStatus: state.adminEvents.updateResponseStatus
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminViewEventModal);