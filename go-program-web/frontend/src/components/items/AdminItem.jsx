import React, {Component} from 'react';
import '../../Common.css';
import './Items.css'
import AdminViewItemModal from './AdminViewItemModal';
import Lightbox from 'react-image-lightbox';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {connect} from 'react-redux';
import {deleteItem} from '../../redux/actions/adminInventoryAction';

class AdminItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            showAdminViewItemModal: false,
            photoIndex: 0,
            isOpen: false
        };
        
    }

    showAdminViewItemModal = e => {
        this.setState({showAdminViewItemModal: true});
    }
    
    hideAdminViewItemModal = e => {
        this.setState({showAdminViewItemModal: false});
    }

    handleDelete = () => {
        confirmAlert({
            title: 'Delete Item',
            message: 'Are you sure you want to delete this Item?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {this.props.deleteItem(this.props.item._id);}
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
          });
    }
    
    render() {
        const { photoIndex, isOpen } = this.state;
        const trimmedDescription = this.props.item.description.length > 35 
                                    ? this.props.item.description.substring(0,35)+"..."
                                    : this.props.item.description;
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                {/* <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6> */}
                    <div className="card d-flex flex-row">
                        <img src={this.props.item.images[0]} className="img-fluid items-card-image align-self-center" alt="..."/>
                        <div className="card-body card-body-lesspad">
                            <h5 className="card-title font-weight-bold">{this.props.item.name}</h5>
                            <p className="card-text">{trimmedDescription}</p>
                            <p className="card-text"><strong>Points: </strong>{this.props.item.points}</p>
                            <p className="card-text"><strong>Category: </strong>{this.props.item.category}</p>
                            <div className="d-flex flex-row justify-content-around justify-content-sm-start">
                                <button type="button" className="btn btn-link view-details-color"
                                onClick={() => this.setState({ isOpen: true })}>
                                    <i class="fas fa-search-plus"/> 
                                    <span className="d-none d-sm-inline"> Images</span>
                                </button>
                                <button type="button" className="btn btn-link view-details-color"
                                onClick = {this.showAdminViewItemModal}>
                                    <i className="fas fa-eye"/>
                                    <span className="d-none d-sm-inline"> Details</span>
                                </button>
                                <button type="button" className="btn btn-link delete-color"
                                onClick = {this.handleDelete}>
                                    <i className="fas fa-trash-alt"/>
                                    <span className="d-none d-sm-inline"> Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {isOpen && (
                <Lightbox
                    mainSrc={this.props.item.images[photoIndex]}
                    nextSrc={this.props.item.images[(photoIndex + 1) % this.props.item.images.length]}
                    prevSrc={this.props.item.images[(photoIndex + this.props.item.images.length - 1) % this.props.item.images]}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                    onMovePrevRequest={() =>
                    this.setState({
                        photoIndex: (photoIndex + this.props.item.images.length - 1) % this.props.item.images.length,
                    })
                    }
                    onMoveNextRequest={() =>
                    this.setState({
                        photoIndex: (photoIndex + 1) % this.props.item.images.length,
                    })
                    }
                />
                )}
                {this.state.showAdminViewItemModal ? 
                <AdminViewItemModal hideAdminViewItemModal={this.hideAdminViewItemModal}
                item={this.props.item}/> : null}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteItem: id => {dispatch(deleteItem(id))}
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.inventory.deleteResponseMessage
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminItem);