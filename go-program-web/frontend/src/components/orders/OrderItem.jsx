import React, {Component} from 'react';
import '../../Common.css';
import './Orders.css'
import Lightbox from 'react-image-lightbox';
import {backendUrl} from '../../config';

class OrderItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            photoIndex: 0,
            isOpen: false,
            isMore: false,
            message: "",
            status: "success",
            images: []
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        const imagePromises = this.props.item.item.images.map(imageName => 
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

    removeItem = () => {
        this.props.onRemove(this.props.itemIndex);
    }
    
    render() {
        const { photoIndex, isOpen } = this.state;
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                    <div className={`status-msg ${this.state.status}`}>
                        {this.state.message}
                    </div>
                    <div className="card d-flex flex-row">
                        <img src={this.state.images[0]} className="img-fluid entity-card-image m-1" alt="..."/>
                        <div className="card-body card-body-lesspad">
                            <h5 style={{fontSize: '1rem'}} className="font-weight-bold">{this.props.item.item.name}</h5>
                            <p className="font-smaller"><strong>Points: </strong>{this.props.item.item.points}</p>
                            <p className="font-smaller"><strong>Size: </strong>{this.props.item.size}</p>
                            <p className="font-smaller"><strong>Quantity: </strong>{this.props.item.quantity}</p>
                            <p className="font-smaller"><strong>Total Points: </strong>{this.props.item.quantity * this.props.item.item.points}</p>
                            <div className="d-flex flex-row">
                                <button className="btn btn-link view-details-color btn-padding"
                                onClick={() => this.setState({ isOpen: true })}>
                                    <i className="fas fa-search-plus"/> Images
                                </button>
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
            </div>
        )
    }
}

export default OrderItem;