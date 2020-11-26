import React, {Component} from 'react';
import '../../Common.css';
import {connect} from 'react-redux';
import {createEvent, resetCreateResponseMessageProps} from '../../redux/actions/suggestedEventsAction';

class StudentNewSuggestionModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: "",
            description: "",
            message: "",
            status: "success",
            loader: false
        }
    }
    
    hideModal = e => {
        this.props.hideStudentNewSuggestionModal();
        this.props.resetCreateResponseMessageProps();
    }
    
    handleInputChange = (e) => {
        this.setState({[e.target.name] : e.target.value})
    }

    isFieldEmpty = () => {
        if(this.state.name === "" || this.state.description === ""){
            return true;
        } else {
            return false;
        }
    }

    handleSubmit = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ 
                message: "All fields are mandatory.",
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
            student: {
            },
            name: this.state.name,
            description : this.state.description
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
                            <h5 className="modal-title" id="eventModal">Suggest Event</h5>
                        </div>
                        <div className="modal-body">
                            <div className={`status-msg ${this.state.status}`}>
                                {this.state.message}
                            </div>
                            <div className={`status-msg ${this.props.responseStatus}`}>
                                {this.props.responseMessage}
                            </div>
                            <div className="form-group row">
                                <label className="col-3">Name</label>
                                <div className="col-9">
                                    <input className={`form-control ${this.state.name!==""?'orig-inp-valid':'orig-inp-invalid'}`}
                                    placeholder="Enter event name" onChange={this.handleInputChange}
                                    name="name"/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3">Description</label>
                                <div className="col-9">
                                    <textarea className={`form-control ${this.state.description!==""?'orig-inp-valid':'orig-inp-invalid'}`}
                                    rows="3" placeholder="Enter event description" onChange={this.handleInputChange}
                                    name="description"/>
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
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.suggestedEvents.createResponseMessage,
        responseStatus: state.suggestedEvents.createResponseStatus
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentNewSuggestionModal);