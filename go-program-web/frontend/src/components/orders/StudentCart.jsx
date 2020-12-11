import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../../Common.css';
import './Orders.css';
import StudentCartItem from './StudentCartItem';
import {backendUrl} from '../../config';

class StudentCart extends Component{
    constructor(props){
        super(props);
        this.state = {
            pointsAvailable: 0,
            pointsUsed: 0,
            cart: [],
            message: "",
            status: "success",
            loader: false
        };
    }

    componentDidMount(){
        if(localStorage.getItem('cart')){
            const cart = JSON.parse(localStorage.getItem('cart'));
            this.setState({
                cart: this.state.cart.concat(cart),
                pointsUsed: parseInt(localStorage.getItem('pointsUsed')),
                pointsAvailable: parseInt(localStorage.getItem('pointsAccumulated')) - parseInt(localStorage.getItem('pointsSpent'))
            })
        }
    }

    emptyCart = () => {
        this.setState({
            pointsAvailable: 0,
            pointsUsed: 0,
            cart: [],
            message: "",
            status: "success"
        });
        localStorage.removeItem('cart');
        localStorage.removeItem('pointsUsed');
    }

    handleSetState = (itemIndex, pointsUsed, successcb) => {
        this.setState( state => {
            const cart = state.cart.filter((cartItem, currIndex) => itemIndex !== currIndex);
            return {
                cart,
                pointsUsed
            }
        }, function () {successcb()});
        
    }

    removeItem = itemIndex => {
        if(this.state.cart.length === 1){
            this.setState({
                pointsAvailable: 0,
                pointsUsed: 0,
                cart: [],
                message: "",
                status: "success"
            });
            localStorage.removeItem('cart');
            localStorage.removeItem('pointsUsed');
        } else {
            let pointsAdjusted = this.state.cart[itemIndex].points * this.state.cart[itemIndex].quantity;
            let pointsUsed = this.state.pointsUsed - pointsAdjusted;
            this.handleSetState(itemIndex, pointsUsed, ()=> {
                localStorage.setItem('pointsUsed', this.state.pointsUsed);
                localStorage.setItem('cart', JSON.stringify(this.state.cart));
            });
        }
    };

    //below function will filter out attributes asynchronously that are not needed for the DB
    prepareOrderItems = successcb => {
        const orderItems = this.state.cart.map(cartItem => {
            return {
                item: cartItem._id, 
                size: cartItem.size, 
                quantity: cartItem.quantity
            }
        });
        const inventoryItems = this.state.cart.map(cartItem => {
            return {
                itemId: cartItem._id, 
                attributeId: cartItem.attributeId, 
                newQuantity: cartItem.originalQuantity - cartItem.quantity
            }
        });
        successcb(orderItems, inventoryItems);
    }

    confirmOrder = () => {
        this.prepareOrderItems((orderItems, inventoryItems) => {
            this.setState({loader: true});
            const data = {
                student: {

                },
                orderItems,
                inventoryItems,
                points: this.state.pointsUsed
            }
            const token = localStorage.getItem('token');
            fetch(`${backendUrl}/student/createOrder`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json,  text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(data)
            })
            .then(res => {
                if(res.status === 200){
                    res.json().then(resData => {
                        const currPointsSpent = parseInt(localStorage.getItem('pointsSpent'));
                        const newPointsSpent = currPointsSpent + this.state.pointsUsed;
                        localStorage.setItem('pointsSpent', newPointsSpent);
                        this.setState({
                            pointsAvailable: 0,
                            pointsUsed: 0,
                            cart: [],
                            message: resData.message,
                            status: "success",
                            loader: false
                        });
                        localStorage.removeItem('cart');
                        localStorage.removeItem('pointsUsed');
                    });
                }else{
                    res.json().then(resData => {
                        this.setState({
                            message: resData.message,
                            status: "failed",
                            loader: false
                        })
                    })
                }
            })
            .catch(err => {
                this.setState({
                    message: err.message,
                    status: "failed",
                    loader: false
                })
            });
        })
    }
    
    render() {
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fas fa-shopping-cart"></i> Cart</h4>
            </div>
            <div className="container-fluid below-heading">
                <div className="entities-search-section">  {/*This class will support the sticky subheading */}
                    <h4 className="text-center text-white all-entity-heading p-1">Cart Items</h4>
                </div>
                <div className={`status-msg ${this.state.status}`}>
                    {this.state.message}
                </div>
                {
                    this.state.cart.length > 0
                    ? <div>
                        <div className="row justify-content-center">
                            <div className="col-sm-8">
                                <p><strong>Total Points for this Order: </strong>{this.state.pointsUsed}</p>
                                <div className="d-flex align-items-center">
                                    <button className="btn btn-primary btn-sm btn-style mr-2"
                                        onClick={this.emptyCart}>
                                        Empty Cart
                                    </button>
                                    <button className="btn btn-primary btn-sm btn-style mr-2"
                                        onClick={() => this.props.history.push("/student/redeem")}>
                                            Add More Item
                                    </button>
                                    <button className="btn btn-primary btn-sm btn-style mr-2"
                                        onClick={this.confirmOrder}>
                                            Confirm Order
                                    </button>
                                    {
                                        this.state.loader
                                        ? <div className="spinner-border text-primary" role="status"/>
                                        : null
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            this.state.cart.map((cartItem,index)=>
                            <StudentCartItem item={cartItem} key={index} 
                            itemIndex={index} onRemove={this.removeItem}/>
                            )
                            
                        }
                    </div>
                : <div>
                    <h2>Cart is Empty</h2>
                    <Link to = "/student/redeem">
                        <button type="button" className="btn btn-primary btn-style mt-2 mr-2">
                            Add Item
                        </button>
                    </Link>
                    <Link to = "/student/orders">
                        <button type="button" className="btn btn-primary btn-style mt-2">
                            All Orders
                        </button>
                    </Link>
                </div>
                }

            </div>
        </div>
        )
    }
}

export default StudentCart;