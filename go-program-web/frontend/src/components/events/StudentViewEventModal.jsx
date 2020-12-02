import React, {Component} from 'react';
import '../../Common.css';
import {connect} from 'react-redux';
import closeIcon from '../../images/close_icon.png';
import {eventInputChangeHandler, eventEditCancelHandler, 
    updateEvent, resetUpdateResponseMessage} from '../../redux/actions/studentEventsAction';

class StudentViewEventModal extends Component{
    constructor(props){
        super(props);
        this.initialDesc = props.event.description;
        this.state = {
            message: "",
            status: "success",
            images: [],
            imagesUrl: [],
            loader: false
        }
    }

    componentDidMount() {
        this.props.resetUpdateResponseMessage();
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

    scrollToMessage = () => {
        this.el.scrollIntoView({ behavior: 'smooth' });
    }

    handleUpdate = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ 
                message: "Description is a mandatory field.",
                status: "failed"
            });
            this.scrollToMessage();
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
            id: this.props.event._id,
            description: this.props.event.description,
            images: this.state.images
        }

        this.props.updateEvent(data).then(() => {
            this.hideModal();
        }).catch(() => {
            this.scrollToMessage();
            this.setState({
                loader: false
            });
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
                                Edit Event
                            </h5>
                        </div>
                            <div className="modal-body">
                                <div ref={el => { this.el = el; }} className={`status-msg ${this.state.status}`}>
                                    {this.state.message}
                                </div>
                                <div ref={el => { this.el = el; }} className={`status-msg ${this.props.responseStatus}`}>
                                    {this.props.responseMessage}
                                </div>
                                <div class="form-group row">
                                    <label className="col-3">Event</label>
                                    <div className="col-9">
                                        <p>{this.props.event.event.name}</p>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label className="col-3">Points</label>
                                    <div className="col-9">
                                        <p>{this.props.event.event.points}</p>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-3">Description</label>
                                    <div className="col-9">
                                        <textarea className={`form-control ${this.props.event.description!==""?'orig-inp-valid':'orig-inp-invalid'}`}
                                            rows="3" placeholder="Enter a short description" onChange={this.handleInputChange}
                                            name="description" value = {this.props.event.description}/>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label className="col-3">Status</label>
                                    <div className="col-9">
                                        <p>{this.props.event.status}</p>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label className="col-3">Completed</label>
                                    <div className="col-9">
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
                                            <img onClick={e => this.removeImage(index)} className= "delete-icon" alt="delete icon"
                                            src={closeIcon}/>
                                            <img className="rounded img-thumbnail" src= {imageUrl} 
                                            alt="Responsive Pic"/>
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
                            <button onClick = {this.handleEditCancel} className="btn btn-primary btn-style" 
                                data-dismiss="modal">Cancel</button>
                            <button onClick = {this.handleUpdate} disabled ={!updateEnabled}
                                className="btn btn-primary btn-style">Update</button>
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
        updateEvent: event => dispatch(updateEvent(event)),
        resetUpdateResponseMessage : () => {dispatch(resetUpdateResponseMessage())}
    };
};

const mapStateToProps = state => {
    return {
        responseMessage: state.studentEvents.updateResponseMessage,
        responseStatus: state.studentEvents.updateResponseStatus
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentViewEventModal);