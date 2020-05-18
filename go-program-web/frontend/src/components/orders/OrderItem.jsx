import React, {Component} from 'react';
import '../../Common.css';
import './Orders.css'
import Lightbox from 'react-image-lightbox';

class OrderItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            photoIndex: 0,
            isOpen: false,
            isMore: false
        };
    }

    removeItem = () => {
        this.props.onRemove(this.props.itemIndex);
    }
    
    render() {
        const { photoIndex, isOpen } = this.state;
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                    <div className="card d-flex flex-row">
                        <img src={this.props.item.item.images[0]} className="img-fluid cart-item-image m-1" alt="..."/>
                        <div className="card-body card-body-lesspad">
                            <h5 style={{fontSize: '1rem'}} className="font-weight-bold">{this.props.item.item.name}</h5>
                            <p className="font-smaller"><strong>Points: </strong>{this.props.item.item.points}</p>
                            <p className="font-smaller"><strong>Size: </strong>{this.props.item.size}</p>
                            <p className="font-smaller"><strong>Quantity: </strong>{this.props.item.quantity}</p>
                            <p className="font-smaller"><strong>Total Points: </strong>{this.props.item.quantity * this.props.item.item.points}</p>
                            <div className="d-flex flex-row">
                                <button className="btn btn-link view-details-color btn-padding"
                                onClick={() => this.setState({ isOpen: true })}>
                                    <i class="fas fa-search-plus"/> Images
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {isOpen && (
                <Lightbox
                    mainSrc={this.props.item.item.images[photoIndex]}
                    nextSrc={this.props.item.item.images[(photoIndex + 1) % this.props.item.item.images.length]}
                    prevSrc={this.props.item.item.images[(photoIndex + this.props.item.item.images.length - 1) % this.props.item.item.images]}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                    onMovePrevRequest={() =>
                    this.setState({
                        photoIndex: (photoIndex + this.props.item.item.images.length - 1) % this.props.item.item.images.length,
                    })
                    }
                    onMoveNextRequest={() =>
                    this.setState({
                        photoIndex: (photoIndex + 1) % this.props.item.item.images.length,
                    })
                    }
                />
                )}
            </div>
        )
    }
}

export default OrderItem;