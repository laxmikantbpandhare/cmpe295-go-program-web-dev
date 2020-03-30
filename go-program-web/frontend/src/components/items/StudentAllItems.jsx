import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import collegeLogo from '../../images/coe_logo.png';
import '../../Common.css';
import './Items.css'

class StudentAllItems extends Component{
    constructor(props){
        super(props);
        this.state = {}
    }
    
    render() {
        let redirectVar = null;
        if(localStorage.getItem('token')){

        }
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-award"></i> Claim Points</h4>
            </div>
            <div className="container-fluid items-below-heading">
                <div className="items-search-section">
                    <h4 className="text-center text-white all-items-heading p-1">All Items</h4>
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
                                <option selected>Filter by Tier</option>
                                <option>Tier 1(400-500 Points)</option>
                                <option>Tier 2(200-399 Points)</option>
                                <option>Tier 3(100-199 Points)</option>
                            </select>
                        </div>
                        <div className="col-6 col-sm-2">
                            <select className="form-control" name="some1">
                                <option selected>Filter by Category</option>
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

export default StudentAllItems;