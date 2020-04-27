import React, {Component} from 'react';
import '../../Common.css';
import './Events.css'
import {connect} from 'react-redux';
import closeIcon from '../../images/close_icon.png';
import {eventInputChangeHandler, eventEditCancelHandler, 
    updateEvent} from '../../redux/actions/studentEventsAction';

class StudentViewEventModal extends Component{
    constructor(props){
        super(props);
        this.initialDesc = props.event.description;
        this.state = {
            message: "",
            images: [],
            imagesUrl: []
        }
        
        this.hideModal = this.hideModal.bind(this);
    }
    
    hideModal = () => {
        this.props.hideStudentViewEventModal();
    }
    
    handleInputChange = e => {
        const { name, value } = e.target;
        this.props.handleInputChange(this.props.event._id, name, value);
    }

     isFieldEmpty = () => {
        if(this.props.event.description === ""){
            return true;
        } else {
            return false;
        }
    }

    handleEditCancel = () => {
        this.props.handleEditCancel(this.props.event._id, this.initialDesc);
        this.hideModal();
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
        const types = ['image/png', 'image/jpeg']
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
    
    handleFileUpload = (e) => {
        if(!this.checkMimeType(e)){
            alert("Please upload png/jpeg file only");
        }
        if(!this.maxSelectFile(e)){
            alert("Total 4 images are allowed");
        }
        if(this.maxSelectFile(e) && this.checkMimeType(e)){
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

    handleUpdate = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ message: "Description is a mandatory field." });
            return;
        } else {
            this.setState({ message: "" });
        }

        const data = {
            id: this.props.event._id,
            description: this.props.event.description,
            updatedBy: localStorage.getItem('id'),
            images: this.state.images,
        }

        this.props.updateEvent(data).then(() => {
            this.hideModal();
        }).catch(() => {
            
        });
        
    }
    
    render() {
        var updatedDate = null;
        var updatedBy = null;
        const isUpdateable = this.initialDesc === this.props.event.description && this.state.images.length<1;
        const updateEnabled = isUpdateable ? false : true;
        if(this.props.event.updatedBy){
            updatedDate = (
                <div className="form-group row">
                    <label className="col-3">Updated</label>
                    <div className="col-9">
                        <p>{new Date(this.props.event.updatedDate).toLocaleString()}</p>                                       
                    </div>
                </div>
            );
            updatedBy = (
                <div className="form-group row">
                    <label className="col-3">Last Updated By<strong className="font-italic">(SJSU ID)</strong></label>
                    <div className="col-9">
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
                            {/* {
                                this.state.isEdited
                                ? `Edit Event`
                                : `View Event Details`
                            } */}
                            Edit Event
                            </h5>
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
                                        {/* {
                                            this.state.isEdited
                                            ? <input type="text" name="name" placeholder="Enter Name" onChange={this.handleInputChange}
                                            className={`form-control ${this.state.name!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                            value={this.props.event.name}/>
                                            : <p>{this.props.event.name}</p>
                                        } */}
                                        <p>{this.props.event.event.name}</p>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label className="col-3">Points</label>
                                    <div className="col-9">
                                        {/* {
                                            this.state.isEdited
                                            ? <input type="number" min="1" name="points" placeholder="Enter Points" onChange={this.handleInputChange}
                                            className={`form-control ${this.state.points!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                            value={this.props.event.points}/>
                                            : <p>{this.props.event.points}</p>
                                        }   */}
                                        <p>{this.props.event.event.points}</p>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-3">Description</label>
                                    <div className="col-9">
                                        {/* {
                                            this.state.isEdited
                                            ? <textarea className={`form-control ${this.state.description!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                            rows="3" placeholder="Enter a short description" onChange={this.handleInputChange}
                                            name="description" value = {this.props.event.description}/>
                                            : <p>{this.props.event.description}</p>
                                        } */}
                                        <textarea className={`form-control ${this.props.event.description!==""?'orig-inp-valid':'orig-inp-invalid'}`}
                                            rows="3" placeholder="Enter a short description" onChange={this.handleInputChange}
                                            name="description" value = {this.props.event.description}/>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label className="col-3">Status</label>
                                    <div className="col-9">
                                        {/* {
                                            this.state.isEdited
                                            ? <input type="text" name="name" placeholder="Enter Name" onChange={this.handleInputChange}
                                            className={`form-control ${this.state.name!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                            value={this.props.event.name}/>
                                            : <p>{this.props.event.name}</p>
                                        } */}
                                        <p>{this.props.event.status}</p>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label className="col-3">Completed</label>
                                    <div className="col-9">
                                        {/* {
                                            this.state.isEdited
                                            ? <DatePicker
                                                // selected={
                                                //     this.props.event.expiryDate === null || this.props.event.expiryDate === ""
                                                //     ? ""
                                                //     : new Date(this.props.event.expiryDate)
                                                // }
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
                                        }   */}
                                        <p>{new Date(this.props.event.completedDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-3">Submitted</label>
                                    <div className="col-9">
                                        <p>{new Date(this.props.event.createdDate).toLocaleString()}</p>                                       
                                    </div>
                                </div>
                                {updatedDate}
                                {updatedBy}
                                <div className="form-group row">
                                <label className="col-3">Attach Pic<strong className="font-italic">(Min 1, Max 4)</strong></label>
                                <div className="col-9">
                                    <div className="image-upload">
                                        <label htmlFor="upload"><i className="fas fa-paperclip"></i></label>
                                        <input multiple type="file" id="upload" value="" accept="image/jpeg, image/png"
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
                                            <img onClick={e => this.removeImage(index)} className= "delete-icon" alt="remove images" 
                                            src={closeIcon}/>
                                            <img className="rounded img-thumbnail" src= {imageUrl} 
                                            alt="Responsive images"/>
                                        </div>
                                        )) :null
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                                <button onClick = {this.handleUpdate} disabled ={!updateEnabled}
                                    className="btn btn-primary btn-style">Update</button>
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
        handleInputChange: (id, name, value) => {dispatch(eventInputChangeHandler(id, name, value))},
        handleEditCancel : (id, description) => {dispatch(eventEditCancelHandler(id, description))},
        updateEvent: event => dispatch(updateEvent(event))
    };
};

const mapStateToProps = state => {
    return {
        responseMessage: state.studentEvents.updateResponseMessage
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentViewEventModal);