import React, {Component} from 'react';
import '../../Common.css';
import './Items.css'
import AdminViewItemModal from './AdminViewItemModal';
import Lightbox from 'react-image-lightbox';
import {backendUrl} from '../../config';

class AdminItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            showAdminViewItemModal: false,
            photoIndex: 0,
            isOpen: false,
            message: "",
            status: "success",
            images: []
        };
        
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        const imagePromises = this.props.item.images.map(imageName => 
            fetch(`${backendUrl}/download/image/?name=${imageName}`,{
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            })
            .then(res => {
                return res.blob()})
            .catch(err => {
                this.setState({
                    message: `Internal error when fetching item images - ${err}`,
                    status: "failed"
                });
            })
        );

        Promise.all(imagePromises)
        .then(blobs => {
            var images = blobs.map(blob => URL.createObjectURL(blob));
            this.setState({images})
        })
    }

    showAdminViewItemModal = e => {
        this.setState({showAdminViewItemModal: true});
    }
    
    hideAdminViewItemModal = e => {
        this.setState({showAdminViewItemModal: false});
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
                    <div className={`status-msg ${this.state.status}`}>
                        {this.state.message}
                    </div>
                    <div className="card d-flex flex-row">
                        <img src={this.state.images[0]} className="img-fluid entity-card-image align-self-center" alt="..."/>
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
                                {/* <button type="button" className="btn btn-link delete-color"
                                onClick = {this.handleDelete}>
                                    <i className="fas fa-trash-alt"/>
                                    <span className="d-none d-sm-inline"> Delete</span>
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
                {isOpen && (
                <Lightbox
                    mainSrc={this.state.images[photoIndex]}
                    nextSrc={this.state.images[(photoIndex + 1) % this.state.images.length]}
                    prevSrc={this.state.images[(photoIndex + this.state.images.length - 1) % this.state.images]}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                    onMovePrevRequest={() =>
                    this.setState({
                        photoIndex: (photoIndex + this.state.images.length - 1) % this.state.images.length,
                    })
                    }
                    onMoveNextRequest={() =>
                    this.setState({
                        photoIndex: (photoIndex + 1) % this.state.images.length,
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

export default AdminItem;