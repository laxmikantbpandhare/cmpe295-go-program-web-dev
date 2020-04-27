import React, {Component} from 'react';
// import {Link} from 'react-router-dom';
// import {Redirect} from 'react-router';
import collegeLogo from '../../images/coe_logo.png';
import '../../Common.css';
import './Orders.css'


class StudentOrders extends Component{
    constructor(props){
        super(props);
        this.state = {}
    }
    
    componentDidMount(){

    }
    

    render() {
        // let redirectVar = null;
        if(localStorage.getItem('token')){
       
        }


        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-receipt"></i> Orders</h4>
            </div>
            <div className="container-fluid orders-below-heading">
                <div className="orders-search-section">
                    <h4 className="text-center text-white your-orders-heading p-1">Your Orders</h4>
                    <div className="row">
                        <div className="col-10 col-sm-6">
                            <input type="search" class="form-control" placeholder="Search by Item Name" />
                        </div>
                        <div className="col-2 col-sm-2">
                            <button className="btn btn-primary" style={{backgroundColor:"#0056a3"}}>
                                <i className="fas fa-search"></i>
                                <span className="d-none d-sm-inline"> Search</span>
                            </button>
                        </div>
                        <div className="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>
                        <div className="col-6 col-sm-2">
                            <select className="form-control" name="some">
                                <option selected>Filter by Status</option>
                                <option>Pending</option>
                                <option>Delivered</option>
                            </select>
                        </div>
                    </div>
                    <hr/>
                </div>
                <div className="row mt-2">
                    <div className="col-sm-6 my-1">
                        <div className="card d-flex flex-row">
                            <img src={collegeLogo} className="img-fluid items-card-image align-self-center" alt="..."/>
                            <div className="card-body">
                                <h6 className="card-title font-weight-bold">Shirt</h6>
                                <h6 className="card-text">Tier 2</h6>
                                <h6 className="card-text">299 Points</h6>
                                <button type="button" className="btn btn-primary btn-style">Select</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 my-1">
                        <div className="card d-flex flex-row">
                            <img src={collegeLogo} className="img-fluid items-card-image align-self-center" alt="..."/>
                            <div className="card-body">
                                <h6 className="card-title font-weight-bold">Shirt</h6>
                                <h6 className="card-text">Tier 2</h6>
                                <h6 className="card-text">299 Points</h6>
                                <button type="button" className="btn btn-primary btn-style">Select</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default StudentOrders;