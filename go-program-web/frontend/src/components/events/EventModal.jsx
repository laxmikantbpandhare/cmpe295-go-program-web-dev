import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import deleteIcon from '../../images/close_icon.png';
import '../../Common.css';
import './Events.css'

class EventModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            images: [],
            imagesUrl: [],
            message: ""
        }
        
        this.hideModal = this.hideModal.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.clearMessage = this.clearMessage.bind(this);
        this.removeImage = this.removeImage.bind(this);
    }
    
    hideModal = e => {
        this.props.hideEventModal();
    }
    
    changeHandler = (e) => {
        this.setState({[e.target.name] : e.target.value})
    }
    
    clearMessage(e) {
        this.setState({message: ""})
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
        const types = ['image/png', 'image/jpeg', 'image/gif']
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
            alert("Please upload png/jpeg/gif file only");
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
    
    removeImage = e => {
        e.preventDefault();
        const images = this.state.images; 
        // make a separate copy of the array
        images.splice(e.target.id, 1);
        var imagesUrl = this.state.imagesUrl;
        imagesUrl.splice(e.target.id,1);
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
            <div className="modal event-modal">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="eventModal">Add Event</h5>
                            <button type="button" className="close" data-dismiss="modal"
                                onClick = {this.hideModal} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={this.submitSignup} className="was-validated">
                            <div className="modal-body">
                                <h6 style= {{color:"red"}}>{this.state.message}</h6>
                                <div class="form-group row">
                                    <label for="title" className="col-3 col-form-label">Event</label>
                                    <div className="col-9">
                                        <select className="form-control" name="title" id="title" required>
                                            <option value="" selected>Select an Event</option>
                                            <option value="1">Event1</option>
                                        </select>
                                    </div>
                                <div className="valid-feedback">Valid.</div>
                                <div className="invalid-feedback">Please select an event.</div>
                            </div>
                            <div className="form-group row">
                                <label for="description" className="col-3 col-form-label">Description</label>
                                <div className="col-9">
                                    <textarea className="form-control" id="description" rows="3" 
                                    placeholder="Enter a short description" required/>
                                </div>
                                <div className="valid-feedback">Valid.</div>
                                <div className="invalid-feedback">Please fill out this field.</div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3 col-form-label">Attach Proof</label>
                                <div className="col-9">
                                    <div className="image-upload">
                                        <label htmlFor="upload"><i className="fas fa-paperclip"></i></label>
                                        <input multiple type="file" id="upload" value=""
                                            onChange= {this.handleFileUpload}/>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3 col-form-label">Images</label>
                                    <div className="col-9">
                                        <div className="row">
                                        {this.state.imagesUrl ? this.state.imagesUrl.map((imageUrl,index) => 
                                            (<div className="col-5 event-image m-1" key ={index}>
                                                <img onClick={this.removeImage} id={index} className= "delete-icon" 
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default EventModal;