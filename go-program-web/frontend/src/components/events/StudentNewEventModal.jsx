import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import closeIcon from '../../images/close_icon.png';
import '../../Common.css';
import './Events.css'
import {connect} from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {createEvent, resetCreateResponseMessageProps} from '../../redux/actions/studentEventsAction';

class StudentNewEventModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            images: [],
            imagesUrl: [],
            eventId: null,
            eventPoints: "",
            description: "",
            completedDate:null,
            message: "",
            loader: false
        }
    }
    
    hideModal = e => {
        this.props.hideStudentNewEventModal();
        this.props.resetCreateResponseMessageProps();
    }

    handleSelectChange = e => {
        let index = e.target.selectedIndex;
        let el = e.target.childNodes[index];
        let id = el.getAttribute('id');
        this.setState({eventId : id})
    }
    
    handleInputChange = (e) => {
        this.setState({[e.target.name] : e.target.value})
    }

    handleDateChange = date => {
        this.setState({
            completedDate : date
        })
    }
    
    maxSelectFile=(event)=>{
        let files = event.target.files // create file object
        if (files.length + this.state.images.length > 4) {
            const msg = 'Only 4 images can be uploaded at a time';
            event.target.value = null // discard selected file   
            console.log(msg);
            return false;
        }
        return true;
    }
    
    checkMimeType=(event)=>{
        //getting file object
        let files = event.target.files 
        //define message container
        let err = ''
        // list allow mime type
        const types = ['image/png', 'image/jpeg', 'image/jpg']
        // loop access array
        for(var x = 0; x<files.length; x++) { 
            // compare file type find doesn't matach 
            if (types.every(type => files[x].type !== type)) { 
                // create error message and assign to container
                err += files[x].type+' is not a supported format';   
            } 
        };
        if (err !== '') { 
            // if message not same old that mean has error 
            event.target.value = null 
            // discard selected file
            console.log(err);
            return false; 
        }return true;
    }

    checkFileSize= (event) =>{
        //getting file object
        let files = event.target.files 
        
        // loop access array
        for(var x = 0; x<files.length; x++) { 
            // compare file type find doesn't matach 
            if(files[x].size > (1024*500)){
                event.target.value = null ;
                return false; 
            }
        }
        return true;
    }
    
    handleFileUpload = (e) => {
        if(!this.checkMimeType(e)){
            alert("Please upload png/jpeg/jpg file only");
        }
        if(!this.maxSelectFile(e)){
            alert("Total 4 images are allowed");
        }
        if(!this.checkFileSize(e)){
            alert("A file size should not exceed 500 KB");
        }
        if(this.maxSelectFile(e) && this.checkMimeType(e) && this.checkFileSize(e)){
            // if return true allow to setState
            var tempUrl =[];
            for(var x = 0; x<e.target.files.length; x++) {
                tempUrl.push(URL.createObjectURL(e.target.files[x]));
            }
            this.setState({ 
                images: [...this.state.images, ...e.target.files],
                imagesUrl: [...this.state.imagesUrl, ...tempUrl]
            })
        }
    }
    
    removeImage = index => {
        const images = this.state.images; 
        // make a separate copy of the array
        images.splice(index, 1);
        var imagesUrl = this.state.imagesUrl;
        imagesUrl.splice(index,1);
        this.setState({
            images,imagesUrl
        })
    }

    isFieldEmpty = () => {
        if(this.state.eventId === null || this.state.description === "" || 
        this.state.completedDate === null || this.state.images.length === 0){
            return true;
        } else {
            return false;
        }
    }

    handleSubmit = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ message: "All fields are mandatory with at least 1 pic" });
            return;
        } else {
            this.setState(
                { 
                    message: "",
                    loader: true
                }
            );
        }
        const data = {
            event: {
                id: this.state.eventId
            },
            student: {
                id: localStorage.getItem('id'),
                fname: localStorage.getItem('fname'),
                lname: localStorage.getItem('lname'),
                email: localStorage.getItem('email'),
                major: localStorage.getItem('major'),
                year: localStorage.getItem('year')
            },
            description : this.state.description,
            completedDate: this.state.completedDate,
            images : this.state.images
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
                            <h5 className="modal-title" id="eventModal">Submit Event</h5>
                            {/* <button type="button" className="close" data-dismiss="modal"
                                onClick = {this.hideModal} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button> */}
                        </div>
                        <div className="modal-body">
                            <h6 style= {{color:"red"}}>{this.state.message}</h6>
                            <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6>
                            <div class="form-group row">
                                <label className="col-3">Event</label>
                                <div className="col-9">
                                    <select className={`form-control ${this.state.eventId?'orig-inp-valid':'orig-inp-invalid'}`}
                                    name="event" onChange={this.handleSelectChange}>
                                        <option selected value="">Select an Event</option>
                                        {this.props.events.map((event,index) => <option key={index} id={event._id}>
                                            {`${event.points} Points - ${event.name}`}
                                        </option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3">Description</label>
                                <div className="col-9">
                                    <textarea className={`form-control ${this.state.description!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                    rows="3" placeholder="Enter a short description" onChange={this.handleInputChange}
                                    name="description"/>
                                </div>
                            </div>
                            <div className="form-group row">
                                    <label className="col-3">Completed Date</label>
                                    <div className="col-9">
                                    <DatePicker
                                        selected={this.state.completedDate}
                                        onChange={this.handleDateChange}
                                        className={`form-control ${this.state.completedDate!=null?'orig-inp-valid':'orig-inp-invalid'}`}
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
                                        maxDate={new Date()}
                                    />
                                    </div>
                                </div>
                            <div className="form-group row">
                                <label className="col-3">Attach Pic<strong className="font-italic">(Min 1, Max 4)</strong></label>
                                <div className="col-9">
                                    <div className="image-upload">
                                        <label htmlFor="upload"><i className="fas fa-paperclip image-icon-pointer"></i></label>
                                        <input multiple type="file" id="upload" value="" accept="image/jpeg, image/png, image/jpg"
                                            onChange= {this.handleFileUpload}/>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3">Images</label>
                                <div className="col-9">
                                    <div className="row">
                                    {this.state.imagesUrl ? this.state.imagesUrl.map((imageUrl,index) => 
                                        (<div className="col-5 modal-image m-1" key ={index}>
                                            <img onClick={e => this.removeImage(index)} className= "delete-icon" 
                                            src={closeIcon}/>
                                            <img className="rounded img-thumbnail" src= {imageUrl} 
                                            alt="Responsive image"/>
                                        </div>
                                        )) :null
                                    }
                                    </div>
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
        responseMessage: state.studentEvents.createResponseMessage
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentNewEventModal);