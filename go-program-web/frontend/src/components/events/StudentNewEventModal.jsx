import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import deleteIcon from '../../images/close_icon.png';
import '../../Common.css';
import './Events.css'
import {connect} from 'react-redux';
import {getActiveEvents} from '../../redux/actions/adminEventsAction';

class StudentNewEventModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            images: [],
            imagesUrl: [],
            name:"",
            description: "",
            completedDate:"",

            message: ""
        }
        
        this.hideModal = this.hideModal.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.removeImage = this.removeImage.bind(this);
    }
    
    hideModal = e => {
        this.props.hideStudentNewEventModal();
    }
    
    changeHandler = (e) => {
        this.setState({[e.target.name] : e.target.value})
    }
    
    componentDidMount(){
        this.props.getActiveEvents();
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
    
    render() {
        let redirectVar = null;
        if(localStorage.getItem('token')){

        }
        return(
        <div>
            <div className="modal">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="eventModal">Submit Event</h5>
                            <button type="button" className="close" data-dismiss="modal"
                                onClick = {this.hideModal} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <h6 style= {{color:"red"}}>{this.state.message}</h6>
                            <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6>
                            <div class="form-group row">
                                <label className="col-3">Name</label>
                                <div className="col-9">
                                    <select className={`form-control ${this.state.category!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                    name="name" onChange={this.handleInputChange}>
                                        <option selected value="">Select an Event</option>
                                        {this.props.events.map(event => <option>{event.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        <div className="form-group row">
                            <label for="description" className="col-3">Description</label>
                            <div className="col-9">
                                <textarea className="form-control" id="description" rows="3" 
                                placeholder="Enter a short description" required/>
                            </div>
                            <div className="valid-feedback">Valid.</div>
                            <div className="invalid-feedback">Please fill out this field.</div>
                        </div>
                        <div className="form-group row">
                            <label className="col-3">Attach Proof</label>
                            <div className="col-9">
                                <div className="image-upload">
                                    <label htmlFor="upload"><i className="fas fa-paperclip"></i></label>
                                    <input multiple type="file" id="upload" value=""
                                        onChange= {this.handleFileUpload}/>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-3">Images</label>
                                <div className="col-9">
                                    <div className="row">
                                    {this.state.imagesUrl ? this.state.imagesUrl.map((imageUrl,index) => 
                                        (<div className="col-5 event-image m-1" key ={index}>
                                            <img onClick={e => this.removeImage(index)} className= "delete-icon" 
                                            src={deleteIcon}/>
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
                            <button type="button" onClick = {this.hideModal} className="btn btn-primary btn-style" 
                            data-dismiss="modal">Close</button>
                            <button type="button" onClick = {this.clearMessage} className="btn btn-primary btn-style">Clear</button>
                            <button type="submit" className="btn btn-primary btn-style">Add Event</button>
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
        getActiveEvents: () => {dispatch(getActiveEvents())}
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.adminEvents.getResponseMessage,
        events: state.adminEvents.activeEvents
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentNewEventModal);