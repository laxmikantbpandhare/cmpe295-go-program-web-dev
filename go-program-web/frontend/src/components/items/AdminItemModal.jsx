import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import deleteIcon from '../../images/delete_icon.png';
import closeIcon from '../../images/close_icon.png';
import addIcon from '../../images/add_icon.png';
import '../../Common.css';
import './Items.css'

class AdminItemModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            images: [],
            imagesUrl: [],
            name:"",
            description:"",
            points:"",
            attributes: [{size:"",quantity:""}],
            message: ""
        }
        
        this.hideModal = this.hideModal.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.clearMessage = this.clearMessage.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.addAttribute = this.addAttribute.bind(this);
        this.removeAttribute = this.removeAttribute.bind(this);
    }
    
    hideModal = e => {
        this.props.hideAdminItemModal();
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

    handleInputChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleAttributeChange(index, e) {
        const { name, value } = e.target;

        this.setState(state => {
            const attributes = state.attributes.map((attribute, curr_index)=> {
                if(curr_index === index){
                    return{
                        ...attribute,
                        [name]:value
                    }
                }
                return attribute;
            });
            return{
                attributes
            };
        });
    }

    addAttribute = () => {
        let totalAttributes = this.state.attributes.length;
        if(this.state.attributes[totalAttributes-1].size!="" && this.state.attributes[totalAttributes-1].quantity!=""){
            this.setState(prevState => ({ 
                attributes: [...prevState.attributes, { size: "", quantity: "" }]
            }))
        } else {
            alert("Please fill out previous attribute");
        }
    }

    removeAttribute(index){
        let attributes = [...this.state.attributes];
        attributes.splice(index, 1);
        this.setState({ attributes });
     }

     isAttributeFieldEmpty = () => {
        let totalAttributes = this.state.attributes.length;
        if(this.state.attributes[totalAttributes-1].size==="" || this.state.attributes[totalAttributes-1].quantity===""){
            return true;
        } else {
            return false;
        }
     }

     isFieldEmpty = () => {
        if(this.state.name === "" || this.state.description === "" || this.state.points === "" ||
        this.state.images.length === 0 || this.isAttributeFieldEmpty()){
            return true;
        } else {
            return false;
        }
    }

     handleSubmit = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ message: "All fields are mandatory" });
            return;
        }
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
                            <h5 className="modal-title" id="itemModal">Add Item</h5>
                            <button type="button" className="close" data-dismiss="modal"
                                onClick = {this.hideModal} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form>
                            <div className="modal-body">
                                <h6 style= {{color:"red"}}>{this.state.message}</h6>
                                <div class="form-group row">
                                    <label className="col-3 col-form-label">Name</label>
                                    <div className="col-9">
                                        <input type="text" name="name" placeholder="Enter Name" onChange={this.handleInputChange}
                                        className={`form-control ${this.state.name!=""?'orig-inp-valid':'orig-inp-invalid'}`}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-3 col-form-label">Description</label>
                                    <div className="col-9">
                                        <textarea className={`form-control ${this.state.description!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                        rows="3" placeholder="Enter a short description" onChange={this.handleInputChange}
                                        name="description"/>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label className="col-3 col-form-label">Points</label>
                                    <div className="col-9">
                                        <input type="number" min="1" name="points" placeholder="Enter Points" onChange={this.handleInputChange}
                                        className={`form-control ${this.state.points!=""?'orig-inp-valid':'orig-inp-invalid'}`}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-3 col-form-label">Sizes (Eg: Size: XL, Quantity: 4)</label>
                                    <div className="col-9">
                                        {
                                            this.state.attributes.map((attribute, index) => (
                                                <div className="row mb-1" key={index}>
                                                    <div className = "col-5">
                                                        <input type="text" name="size" placeholder="Size"
                                                        className={`form-control ${this.state.attributes[index].size!=""?'orig-inp-valid':'orig-inp-invalid'}`} 
                                                        value={attribute.size ||''} onChange={e => this.handleAttributeChange(index, e)} />
                                                    </div>
                                                    <div className = "col-5">
                                                        <input type="number" min="1"  name="quantity" placeholder="Quantity"
                                                        className={`form-control ${this.state.attributes[index].quantity!=""?'orig-inp-valid':'orig-inp-invalid'}`} 
                                                        value={attribute.quantity ||''} onChange={e => this.handleAttributeChange(index, e)} />
                                                    </div>
                                                    {
                                                        index!==0 ? 
                                                        <div className = "col-1">
                                                            <img onClick={e => this.removeAttribute(index)} className= "delete-icon" 
                                                            src={deleteIcon}/>
                                                        </div> 
                                                        : null
                                                    }
                                                    
                                                </div>
                                            ))
                                        }
                                        Add a Row &nbsp;
                                        <img onClick={this.addAttribute} className= "add-icon" 
                                        src={addIcon}/>
                                    </div>
                                </div>
                            <div className="form-group row">
                                <label className="col-3 col-form-label">Attach Pic (Max 4)</label>
                                <div className="col-9">
                                    <div className="image-upload">
                                        <label htmlFor="upload"><i className="fas fa-paperclip"></i></label>
                                        <input multiple type="file" id="upload" value="" accept="image/jpeg, image/png"
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
                                <button type="button" onClick = {this.hideModal} className="btn btn-primary btn-style" 
                                data-dismiss="modal">Close</button>
                                <button type="button" onClick = {this.clearMessage} className="btn btn-primary btn-style">Clear</button>
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

export default AdminItemModal;