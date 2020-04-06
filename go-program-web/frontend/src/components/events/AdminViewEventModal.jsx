import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import deleteIcon from '../../images/delete_icon.png';
import addIcon from '../../images/add_icon.png';
import '../../Common.css';
// import './Items.css'
import {connect} from 'react-redux';
import {adminItemInputChangeHandler, adminItemAttributeChangeHandler, adminItemAddAttribute, 
    adminItemRemoveAttribute, adminItemEditCancelHandler, updateItem} from '../../redux/actions/adminInventoryAction';
import {itemCategories} from '../../config';


class AdminViewEventModal extends Component{
    constructor(props){
        super(props);
        this.initialProp = props.item;
        this.state = {
            images: [],
            imagesUrl: [],
            name:"",
            description:"",
            category:"",
            points:"",
            attributes: [{size:"",quantity:""}],
            message: "",
            isEdited: false
        }
        
        this.hideModal = this.hideModal.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.addAttribute = this.addAttribute.bind(this);
        this.removeAttribute = this.removeAttribute.bind(this);
    }

    // componentDidMount() {
    //     initialProp = this.props.item;
    // }
    
    hideModal = e => {
        this.props.hideAdminViewItemModal();
    }
    
    changeHandler = (e) => {
        this.setState({[e.target.name] : e.target.value})
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
        const { name, value } = e.target;
        this.props.handleInputChange(this.props.item._id, name, value);
    }

    handleAttributeChange(index, e) {
        const { name, value } = e.target;
        this.props.handleAttributeChange(this.props.item._id, index, name, value);
    }

    addAttribute = () => {
        let totalAttributes = this.props.item.attributes.length;
        if(this.props.item.attributes[totalAttributes-1].size!="" && this.props.item.attributes[totalAttributes-1].quantity!=""){
            this.props.addAttribute(this.props.item._id);
        } else {
            alert("Please fill out previous attribute");
        }
    }

    removeAttribute(index){
        // let attributes = [...this.state.attributes];
        // attributes.splice(index, 1);
        // this.setState({ attributes });
        this.props.removeAttribute(this.props.item._id, index);
     }

     isAttributeFieldEmpty = () => {
        let totalAttributes = this.props.item.attributes.length;
        if(this.props.item.attributes[totalAttributes-1].size==="" || this.props.item.attributes[totalAttributes-1].quantity===""){
            return true;
        } else {
            return false;
        }
     }

     isFieldEmpty = () => {
        if(this.props.item.name === "" || this.props.item.description === "" || this.props.item.points === "" ||
        this.props.item.category ==="" || this.isAttributeFieldEmpty()){
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

     handleUpdate = e => {
        e.preventDefault();

        if(this.isFieldEmpty()){
            this.setState({ message: "All fields are mandatory." });
            return;
        } else {
            this.setState({ message: "" });
        }

        // const data = {
        //     name: this.state.name,
        //     description : this.state.description,
        //     category : this.state.category,
        //     points : this.state.points,
        //     attributes : this.state.attributes,
        //     images : this.state.images,
        //     created_by: localStorage.getItem('id'),
        //     created_date: new Date().toLocaleString(),
        //     updated_date: new Date().toLocaleString()
        // }
        this.props.updateItem(this.props.item).then(() => {
            this.setState({
                isEdited: false
            });
        });
        
    }

    // componentDidUpdate(prevProps) {
    //     if (this.props.responseMessage === "Item updated successfully") {
    //         // this.setState({
    //         //     isEdited: false
    //         // });
    //         // this.props.resetCreateResponseMessageProps();
    //     }
    // }

    editItem = () => {
        this.setState({
            isEdited: true
        });
    }
    
    render() {
        return(
        <div>
            <div className="modal">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="itemModal">
                            {
                                this.state.isEdited
                                ? `Edit Item`
                                : `View Item Details`
                            }
                            </h5>
                            <button type="button" className="close" data-dismiss="modal"
                                onClick = {this.hideModal} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                            <div className="modal-body">
                                <h6 style= {{color:"red"}}>{this.state.message}</h6>
                                <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6>
                                <div class="form-group row">
                                    <label className="col-4">Name</label>
                                    <div className="col-8">
                                        {
                                            this.state.isEdited
                                            ? <input type="text" name="name" placeholder="Enter Name" onChange={this.handleInputChange}
                                            className={`form-control ${this.props.item.name!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                            value = {this.props.item.name}/>
                                            : <p>{this.props.item.name}</p>
                                        }
                                        
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-4">Description</label>
                                    <div className="col-8">
                                        {
                                            this.state.isEdited
                                            ? <textarea className={`form-control ${this.props.item.description!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                            rows="3" placeholder="Enter a short description" onChange={this.handleInputChange}
                                            name="description" value = {this.props.item.description}/>
                                            : <p>{this.props.item.description}</p>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-4">Category</label>
                                    <div className="col-8">
                                        {
                                            this.state.isEdited
                                            ? <select className={`form-control ${this.props.item.category!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                            name="category" onChange={this.handleInputChange} value={this.props.item.category}>
                                                <option selected value="">Select a Category</option>
                                                {itemCategories.map(category => <option>{category}</option>)}
                                            </select>
                                            : <p>{this.props.item.category}</p>
                                        }                                        
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label className="col-4">Points</label>
                                    <div className="col-8">
                                        {
                                            this.state.isEdited
                                            ? <input type="number" min="1" name="points" placeholder="Enter Points" onChange={this.handleInputChange}
                                            className={`form-control ${this.props.item.points!=""?'orig-inp-valid':'orig-inp-invalid'}`}
                                            value={this.props.item.points}/>
                                            : <p>{this.props.item.points}</p>
                                        }  
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-4">Sizes<strong className="font-italic">(Eg: Size: XL, Quantity: 4)</strong></label>
                                    {
                                        this.state.isEdited
                                        ? <div className="col-8">
                                            {
                                                this.props.item.attributes.map((attribute, index) => (
                                                    <div className="row mb-1" key={index}>
                                                        <div className = "col-5">
                                                            <input type="text" name="size" placeholder="Size"
                                                            className={`form-control ${this.props.item.attributes[index].size!=""?'orig-inp-valid':'orig-inp-invalid'}`} 
                                                            value={attribute.size ||''} onChange={e => this.handleAttributeChange(index, e)} />
                                                        </div>
                                                        <div className = "col-5">
                                                            <input type="number" min="1"  name="quantity" placeholder="Quantity"
                                                            className={`form-control ${this.props.item.attributes[index].quantity!=""?'orig-inp-valid':'orig-inp-invalid'}`} 
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
                                    : <div className="col-8">
                                        {
                                            this.props.item.attributes.map((attribute, index) => (
                                                <div className="row mb-1" key={index}>
                                                    <div className = "col-6">
                                                        <div className="d-flex flex-row">
                                                            <label >Size: &nbsp;</label>
                                                            <p >{attribute.size}</p>
                                                        </div>
                                                    </div>
                                                    <div className = "col-6">
                                                        <div className="d-flex flex-row">
                                                            <label >Quantity: &nbsp;</label>
                                                            <p >{attribute.quantity}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    }
                                </div>
                            {
                                !this.state.isEdited
                                ? <div className="form-group row">
                                    <label className="col-4">Images</label>
                                    <div className="col-8">
                                        <div className="row" >
                                            { this.props.item.images.map((image,index) => 
                                            (<div className="col-6 event-image mb-1" key ={index}>
                                                <img className="rounded img-thumbnail" src= {image} 
                                                alt="Responsive image"/>
                                            </div>
                                            ))
                                        }
                                        </div>
                                    </div>
                                </div>
                                : null
                            }
                        </div>
                        {
                            this.state.isEdited
                            ? <div className="modal-footer">
                                <button onClick = {this.handleUpdate} className="btn btn-primary btn-style">Update</button>
                                <button onClick = {this.handleEditCancel} className="btn btn-primary btn-style" 
                                data-dismiss="modal">Cancel</button>
                            </div>
                            : <div className="modal-footer">
                                <button onClick = {this.editItem} className="btn btn-primary btn-style">Edit</button>
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
        handleInputChange: (id, name, value) => {dispatch(adminItemInputChangeHandler(id, name, value))},
        handleAttributeChange: (id, index, name, value) => {dispatch(adminItemAttributeChangeHandler(id, index, name, value))},
        addAttribute: id => {dispatch(adminItemAddAttribute(id))},
        removeAttribute : (id, index) => {dispatch(adminItemRemoveAttribute(id, index))},
        handleEditCancel : item => {dispatch(adminItemEditCancelHandler(item))},
        updateItem: item => dispatch(updateItem(item))
    };
};

const mapStateToProps = state => {
    return {
        responseMessage: state.inventory.updateResponseMessage
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminViewEventModal);