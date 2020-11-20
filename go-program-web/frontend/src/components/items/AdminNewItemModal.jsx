import React, {Component} from 'react';
import deleteIcon from '../../images/delete_icon.png';
import closeIcon from '../../images/close_icon.png';
import addIcon from '../../images/add_icon.png';
import '../../Common.css';
import './Items.css'
import {connect} from 'react-redux';
import {createItem, resetCreateResponseMessageProps} from '../../redux/actions/adminInventoryAction';
import {itemCategories} from '../../config';

class AdminNewItemModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            images: [],
            imagesUrl: [],
            name:"",
            description:"",
            category:"",
            points:0,
            attributes: [{size:"",quantity:0}],
            message: "",
            status: "success",
            loader: false
        }
    }
    
    hideModal = e => {
        this.props.hideAdminNewItemModal();
        this.props.resetCreateResponseMessageProps();
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

    handleInputChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleAttributeChange = (index, e) => {
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
        if(this.state.attributes[totalAttributes-1].size!="" && this.state.attributes[totalAttributes-1].quantity>0){
            this.setState(prevState => ({ 
                attributes: [...prevState.attributes, { size: "", quantity: 0 }]
            }))
        } else {
            alert("Please fill out previous attribute");
        }
    }

    removeAttribute = index => {
        let attributes = [...this.state.attributes];
        attributes.splice(index, 1);
        this.setState({ attributes });
     }

     isAttributeFieldEmpty = () => {
        let totalAttributes = this.state.attributes.length;
        if(this.state.attributes[totalAttributes-1].size==="" || this.state.attributes[totalAttributes-1].quantity < 1){
            return true;
        } else {
            return false;
        }
     }

    isFieldEmpty = () => {
        if(this.state.name === "" || this.state.description === "" || this.state.points < 1 ||
        this.state.images.length === 0 || this.state.category ==="" || this.isAttributeFieldEmpty()){
            return true;
        } else {
            return false;
        }
    }

    isDuplicateAttribute = () => {
        let allSizes = this.state.attributes.map(attribute => attribute.size);

        return allSizes.length !== new Set(allSizes).size;
    }

    scrollToMessage = () => {
        this.el.scrollIntoView({ behavior: 'smooth' });
    }

    handleSubmit = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ 
                message: "All fields are mandatory with at least 1 pic. Points and Quantity cannot be less than 1",
                status: "failed"
            });
            this.scrollToMessage();
            return;
        } else if(this.isDuplicateAttribute()){
            this.setState({ 
                message: "Attribute size cannot be duplicate.",
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
            name: this.state.name,
            description : this.state.description,
            category : this.state.category,
            points : this.state.points,
            attributes : this.state.attributes,
            images : this.state.images
        }

        this.props.createItem(data).then(() => {
            this.hideModal();
            this.props.resetCreateResponseMessageProps();
        }).catch(() => {
            this.scrollToMessage();
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
                            <h5 className="modal-title" id="itemModal">Add Item</h5>
                        </div>
                        <div className="modal-body">
                            <div ref={el => { this.el = el; }} className={`status-msg ${this.state.status}`}>
                                {this.state.message}
                            </div>
                            <div ref={el => { this.el = el; }} className={`status-msg ${this.props.responseStatus}`}>
                                {this.props.responseMessage}
                            </div>
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
                            <div className="form-group row">
                                <label className="col-4">Category</label>
                                <div className="col-8">
                                    <select className={`form-control ${this.state.category!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                    name="category" onChange={this.handleInputChange}>
                                        <option selected value="">Select a Category</option>
                                        {itemCategories.map(category => <option>{category}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label className="col-4">Points</label>
                                <div className="col-8">
                                    <input type="number" min="1" name="points" placeholder="Enter Points" onChange={this.handleInputChange}
                                    className={`form-control ${this.state.points>0?'orig-inp-valid':'orig-inp-invalid'}`}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-4">Sizes<strong className="font-italic">(Eg: Size: XL, Quantity: 4)</strong></label>
                                <div className="col-8">
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
                                                    className={`form-control ${this.state.attributes[index].quantity > 0?'orig-inp-valid':'orig-inp-invalid'}`} 
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
                                    <span>Add a Row &nbsp;</span>
                                    <img onClick={this.addAttribute} className= "add-icon" 
                                    src={addIcon}/>
                                </div>
                            </div>
                        <div className="form-group row">
                            <label className="col-4">Attach Pic<strong className="font-italic">(Min 1, Max 4)</strong></label>
                            <div className="col-8">
                                <div className="image-upload">
                                    <label htmlFor="upload"><i className="fas fa-paperclip image-icon-pointer"></i></label>
                                    <input multiple type="file" id="upload" value="" accept="image/jpeg, image/png, image/jpg"
                                        onChange= {this.handleFileUpload}/>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-4">Images</label>
                            <div className="col-8">
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
        createItem: data => dispatch(createItem(data)),
        resetCreateResponseMessageProps: () => {dispatch(resetCreateResponseMessageProps())}
    };
};

const mapStateToProps = state => {
    return {
        responseMessage: state.inventory.createResponseMessage,
        responseStatus: state.inventory.createResponseStatus
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminNewItemModal);