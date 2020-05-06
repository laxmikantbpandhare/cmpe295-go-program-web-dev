import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import '../../Common.css';
import './Items.css';
import {backendUrl} from '../../config';
import Lightbox from 'react-image-lightbox';

class StudentItemDetails extends Component{
    constructor(props){
        super(props);
        this.cart = [];
        this.pointsUsed = 0;
        this.state = {
            responseMessage: "",
            size: "",
            quantity: 0,
            item : {
                _id: "",
                images: [],
                points: 0,
                description: "",
                attributes: [],
                name: "",
                category: ""
            },
            sizeIndex: 0,
            photoIndex: 0,
            isOpen: false,
            pointsAccumulated: 0,
            insufficientPointsInfo: ""
        }
        this.handleSizeSelection = this.handleSizeSelection.bind(this);
    }

    handleInputChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    componentDidMount(){
        const token = localStorage.getItem('token');
        fetch(`${backendUrl}/admin/item/?id=${this.props.match.params.itemId}`,{
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        })
        .then(res => {
            if(res.status === 200){
                res.json().then(data => {
                    this.setState({
                        ...this.state,
                        item: data.item,
                        pointsAccumulated: localStorage.getItem('pointsAccumulated')
                    });  
                });
            }else{
                res.json().then(data => {
                    this.setState({
                        responseMessage: data.message
                    });
                })
            }
        })
        .catch(err => {
            this.setState({
                responseMessage: err.message
            });
        });  
        if(localStorage.getItem('cart')){
            const cart = JSON.parse(localStorage.getItem('cart'));
            this.cart = cart;
            this.pointsUsed = localStorage.getItem('pointsUsed');
        }
    }

    handleSizeSelection = (e, index) => {
        this.setState({
            size: e.target.value,
            sizeIndex: index
        });
    }

    checkSufficientQuantityAndPoints = () => {
        let pointsRequired = this.state.item.points * this.state.quantity;
        let pointsBalance = this.state.pointsAccumulated - this.pointsUsed;
        var itemExists = this.cart.findIndex(cartItem => 
            cartItem._id === this.state.item._id && cartItem.size === this.state.size);
        if(itemExists !== -1){
            pointsBalance += this.cart[itemExists].quantity * this.cart[itemExists].points
        }
        let availableQuantity = parseInt(this.state.item.attributes[this.state.sizeIndex].quantity);
        if(pointsRequired > pointsBalance || this.state.quantity > availableQuantity) {
            return false;
        } else {
            return true;
        }
    }

    updateCart = successcb => {
        let item = {
            _id: this.state.item._id,
            name: this.state.item.name,
            points: this.state.item.points,
            size: this.state.size,
            quantity: this.state.quantity,
            images: this.state.item.images
        }
        if(this.cart.length !== 0){
            let pointsAdjusted = 0;
            var itemExists = this.cart.findIndex(cartItem => 
                cartItem._id === item._id && cartItem.size === item.size);
            if(itemExists === -1){
                this.cart = [item, ...this.cart];
            } else {
                pointsAdjusted = this.cart[itemExists].quantity * this.cart[itemExists].points;
                this.cart[itemExists].quantity = item.quantity;
            }
            let newTotalPoints = parseInt(item.points) * parseInt(item.quantity);
            this.pointsUsed = parseInt(this.pointsUsed) + newTotalPoints - pointsAdjusted;
        } else {            
            this.cart = [item, ...this.cart];
            let newTotalPoints = parseInt(item.points) * parseInt(item.quantity);
            this.pointsUsed = parseInt(this.pointsUsed) + newTotalPoints;
        }
        localStorage.setItem('cart', JSON.stringify(this.cart));
        localStorage.setItem('pointsUsed', this.pointsUsed);
        successcb();
    }

    addToCart = () => {
        if(this.checkSufficientQuantityAndPoints()){
            this.updateCart(()=> {
                this.props.history.push("/student/cart");
            })
            
        } else {
            this.setState({
                insufficientPointsInfo: "Either insufficient points or entered quantity is more than available."
            });
            return;
        }

    }
    
    render() {
        let redirectVar = null;
        if(localStorage.getItem('token')){

        }

        let quantityTooltip = "Enter a quantity that is EITHER less than or equal to the available quantity\nOR equivalent to your accumulated points";
        const { photoIndex, isOpen } = this.state;
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-award"></i> Claim Points</h4>
            </div>
            <div className="container-fluid items-below-heading">
                <div className="items-search-section">  {/*This class will support the sticky subheading */}
                    <h4 className="text-center text-white all-items-heading p-1">Item Details</h4>
                </div>
                <h2 className="text-center">{this.state.item.name}</h2>
                <div className="row">
                    <div className="col-sm-4 text-center">
                        <img src={this.state.item.images[0]} alt="" className="item-details-image img-fluid"/>
                        <div className="row justify-content-center" >
                        {
                            this.state.item.images.length > 0 
                            ? this.state.item.images.filter((image,index)=> index>0).map((image,index) => 
                                (<div className="col-3 m-1" key ={index}>
                                        <img className="rounded img-thumbnail" src= {image} 
                                        alt="Responsive image"style={{cursor:"pointer"}}
                                        onClick={() => this.setState({ isOpen: true })}/>
                                    </div>
                                ))
                            : null
                        }
                        </div>
                    </div>
                    <div className="col-sm-6 my-auto">
                        <h6 style= {{color:"red"}}>{this.state.insufficientPointsInfo}</h6>
                        <p className="h6 text-pre-wrap"><strong>Description: </strong>{this.state.item.description}</p>
                        <p className="h6"><strong>Points: </strong>{this.state.item.points}</p>
                        <p className="h6"><strong>Select a Size:</strong></p>
                        <div className="row pb-1" style={{margin:'0'}}>
                            {
                                this.state.item.attributes.filter(attribute=> attribute.quantity > 0)
                                .map((attribute, index) => (
                                    <button key = {index} type="button"onClick={e => this.handleSizeSelection(e,index)} value={attribute.size}
                                        className={`btn btn-outline-dark mr-1 ${this.state.size===attribute.size?'item-selected':''}`}>
                                        {attribute.size}
                                    </button>
                                    )
                                )
                            }
                        </div>
                        {
                            this.state.size!==""
                            ? (
                                <div>
                                    <p className="h6"><strong>Available quantity: </strong>
                                        {this.state.item.attributes[this.state.sizeIndex].quantity}
                                    </p>
                                </div>
                            )
                            : null
                        }
                        {/* <p className="h6">
                            <strong>
                                Enter a quantity: 
                                <i className="fas fa-info-circle" data-tip = "wwww"></i>
                                <ReactTooltip />
                            </strong>{this.state.item.points}
                        </p> */}
                        <p className="h6"><strong>Enter Quantity:</strong></p>
                        <input disabled = {this.state.size === ""} type="number" name="quantity" onChange={this.handleInputChange}
                            style={{width: '10rem'}} placeholder="Quantity"
                            className={`form-control ${this.state.quantity?'orig-inp-valid':'orig-inp-invalid'}`}/>
                        <div className="d-flex flex-row mt-2">
                            <button type="button" className="btn btn-primary btn-style m-1"
                                onClick={this.addToCart} disabled = {this.state.quantity < 1}>
                                    Add to cart</button>
                            <Link to = "/student/claim-points">
                                <button type="button" className="btn btn-primary btn-style m-1">All Items</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <Lightbox
                    mainSrc={this.state.item.images[photoIndex]}
                    nextSrc={this.state.item.images[(photoIndex + 1) % this.state.item.images.length]}
                    prevSrc={this.state.item.images[(photoIndex + this.state.item.images.length - 1) % this.state.item.images]}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                    onMovePrevRequest={() =>
                    this.setState({
                        photoIndex: (photoIndex + this.state.item.images.length - 1) % this.state.item.images.length,
                    })
                    }
                    onMoveNextRequest={() =>
                    this.setState({
                        photoIndex: (photoIndex + 1) % this.state.item.images.length,
                    })
                    }
                />
                )}
        </div>
        )
    }
}

export default StudentItemDetails;