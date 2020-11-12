import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../../Common.css';
import OrderItem from '../orders/OrderItem';
import {backendUrl} from '../../config';

class OrderRequestDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            responseMessage: ""
        };
    }

    componentDidMount(){
        const token = localStorage.getItem('token');
        fetch(`${backendUrl}/admin/specificOrder/?orderId=${this.props.match.params.orderId}`,{
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
                        order: data.order
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
    }
    
    render() {
        let redirectVar = null;
        if(!localStorage.getItem('token')){
            redirectVar = <Redirect to= "/login"/>
        }
        return(
        <div className="top-align">
            {redirectVar}
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-receipt"></i> Student Orders</h4>
            </div>
            <div className="container-fluid below-heading">
                <div className="orders-search-section">  {/*This class will support the sticky subheading */}
                    <h4 className="text-center text-white all-items-heading p-1">Order Details</h4>
                </div>
                <h6 style= {{color:"red"}}>{this.state.responseMessage}</h6>
                {
                    this.state.order
                    ? <div>
                        <div className="row justify-content-center">
                            <div className="col-sm-8 card-body-lesspad">
                                <h5 style = {{textDecoration:'underline', fontSize: '1rem'}}
                                className="font-weight-bold">Order Details:</h5>
                                <p className="font-smaller"><strong>Order Id# </strong>{this.state.order.id}</p>
                                <p className="font-smaller"><strong>Order Status: </strong>{this.state.order.status}</p>
                                <p className="font-smaller"><strong>Total Points for this Order: </strong>{this.state.order.points}</p>
                                <p className="font-smaller"><strong>Submitted On: </strong>
                                    {new Date(this.state.order.createdDate).toLocaleString()}
                                </p>
                                <h5 style = {{textDecoration:'underline', fontSize: '1rem'}}
                                className="font-weight-bold">Student Details:</h5>
                                <p className="font-smaller"><strong>SJSU Id: </strong>{this.state.order.student.sjsuId}</p>
                                <p className="font-smaller"><strong>Name: </strong>{`${this.state.order.student.user.fname} ${this.state.order.student.user.lname}`}</p>
                                <p className="font-smaller"><strong>Email: </strong>{this.state.order.student.user.email}</p>
                                <p className="font-smaller"><strong>Major: </strong>{this.state.order.student.major}</p>
                                <p className="font-smaller"><strong>Year: </strong>{this.state.order.student.year}</p>
                                <button className="btn btn-primary btn-sm btn-style mr-2"
                                onClick={() => this.props.history.push("/admin/orders-requests")}>
                                    Go to Orders Requests Page
                                </button>
                            </div>
                        </div>
                        {
                            this.state.order.items.map((orderItem,index)=>
                            <OrderItem item={orderItem} key={index} 
                            itemIndex={index} onRemove={this.removeItem}/>
                            )
                            
                        }
                    </div>
                : <div>
                    <h2>The order id specified in the URL does not belong to you.</h2>
                    <button className="btn btn-primary btn-sm btn-style mr-2"
                    onClick={() => this.props.history.push("/student/orders")}>
                        Your Orders
                    </button>
                </div>
                }
            </div>
        </div>
        )
    }
}

export default OrderRequestDetails;