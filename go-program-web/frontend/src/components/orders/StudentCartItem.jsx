import React, {Component} from 'react';
import '../../Common.css';
import './Orders.css'
import Lightbox from 'react-image-lightbox';

class StudentCartItem extends Component{
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
                        <img src={this.props.item.images[0]} className="img-fluid cart-item-image m-1" alt="..."/>
                        <div className="card-body card-body-lesspad">
                            <h5 className="card-title font-weight-bold">{this.props.item.name}</h5>
                            <p className="card-text"><strong>Points: </strong>{this.props.item.points}</p>
                            <p className="card-text"><strong>Size: </strong>{this.props.item.size}</p>
                            <p className="card-text"><strong>Quantity: </strong>{this.props.item.quantity}</p>
                            <div className="d-flex flex-row">
                                <button type="button" className="btn btn-link view-details-color"
                                onClick={() => this.setState({ isOpen: true })}>
                                    <i class="fas fa-search-plus"/> Images
                                </button>
                                <button type="button" className="btn btn-link delete-color"
                                onClick = {this.removeItem}>
                                    <i className="fas fa-trash-alt"/> Remove from Cart
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
            </div>
        )
    }
}

export default StudentCartItem;