import React, {Component} from 'react';
import deleteIcon from '../../images/delete_icon.png';
import addIcon from '../../images/add_icon.png';
import '../../Common.css';
import './Items.css'
import {connect} from 'react-redux';
import {adminItemInputChangeHandler, adminItemAttributeChangeHandler, adminItemAddAttribute, 
    adminItemRemoveAttribute, adminItemEditCancelHandler, updateItem} from '../../redux/actions/adminInventoryAction';
import {itemCategories} from '../../config';


class AdminViewItemModal extends Component{
    constructor(props){
        super(props);
        this.initialProp = props.item;
        this.state = {
            message: "",
            isEdited: false
        }
        
        this.hideModal = this.hideModal.bind(this);
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
        this.addAttribute = this.addAttribute.bind(this);
        this.removeAttribute = this.removeAttribute.bind(this);
    }
    
    hideModal = e => {
        this.props.hideAdminViewItemModal();
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

        this.props.updateItem(this.props.item).then(() => {
            this.setState({
                isEdited: false
            });
        }).catch(() => {
            
        });
        
    }

    editItem = () => {
        this.setState({
            isEdited: true
        });
    }
    
    render() {
        var updatedDate = null;
        var updatedBy = null;
        if(this.props.item.updatedBy){
            updatedDate = (
                <div className="form-group row">
                    <label className="col-4">Updated Date</label>
                    <div className="col-8">
                        <p>{new Date(this.props.item.updatedDate).toLocaleString()}</p>                                       
                    </div>
                </div>
            );
            updatedBy = (
                <div className="form-group row">
                    <label className="col-4">Last Updated By<strong className="font-italic">(SJSU ID)</strong></label>
                    <div className="col-8">
                        <p>{this.props.item.updatedBy}</p>                                       
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
                            <h5 className="modal-title" id="itemModal">
                            {
                                this.state.isEdited
                                ? `Edit Item`
                                : `View Item Details`
                            }
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
                                            : <p className="text-pre-wrap">{this.props.item.description}</p>
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
                                <div className="form-group row">
                                    <label className="col-4">Created By<strong className="font-italic">(SJSU ID)</strong></label>
                                    <div className="col-8">
                                        <p>{this.props.item.createdBy}</p>                                       
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-4">Created Date</label>
                                    <div className="col-8">
                                        <p>{new Date(this.props.item.createdDate).toLocaleString()}</p>                                       
                                    </div>
                                </div>
                                {updatedBy}
                                {updatedDate}
                            {
                                !this.state.isEdited
                                ? <div className="form-group row">
                                    <label className="col-4">Images</label>
                                    <div className="col-8">
                                        <div className="row" >
                                            { this.props.item.images.map((image,index) => 
                                            (<div className="col-6 modal-image mb-1" key ={index}>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminViewItemModal);