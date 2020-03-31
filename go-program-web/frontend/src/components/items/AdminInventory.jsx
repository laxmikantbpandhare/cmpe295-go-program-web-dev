import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import collegeLogo from '../../images/coe_logo.png';
import '../../Common.css';
import './Items.css'
import AdminItemModal from './AdminItemModal';

class AdminInventory extends Component{
    constructor(props){
        super(props);
        this.state = {
            showAdminItemModal: false
        };
        this.showAdminItemModal = this.showAdminItemModal.bind(this);
        this.hideAdminItemModal = this.hideAdminItemModal.bind(this);
    }
    
    showAdminItemModal = e => {
        this.setState({showAdminItemModal: true});
    }
    
    hideAdminItemModal = e => {
        this.setState({showAdminItemModal: false});
    }
    
    render() {
        let redirectVar = null;
        if(localStorage.getItem('token')){

        }
        
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-boxes"></i> Inventory</h4>
            </div>
            
            <div className="container-fluid items-below-heading">
                <div class="row">
                    <div class="col-sm-4 offset-4 offset-sm-5 mt-2">
                        <button className="btn btn-primary btn-style font-weight-bold" onClick = {this.showAdminItemModal}>
                            <i class="fas fa-plus"></i> &nbsp;Add Item
                        </button>
                    </div>
                </div>
                <div className="items-search-section">
                    <h4 className="text-center text-white all-items-heading p-1 mt-2">All Items</h4>
                    <div className="row">
                        <div class="col-10 col-sm-6">
                            <input type="search" class="form-control" placeholder="Search by Item Name" />
                        </div>
                        <div  class="col-2 col-sm-2">
                            <button className="btn btn-primary" style={{backgroundColor:"#0056a3"}}>
                                <i className="fas fa-search"></i>
                                <span className="d-none d-sm-inline"> Search</span>
                            </button>
                        </div>
                        <div class="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>
                        <div  class="col-6 col-sm-2">
                            <select className="form-control" name="some">
                                <option selected>Filter</option>
                            </select>
                        </div>
                        <div  class="col-6 col-sm-2">
                            <select className="form-control" name="some1">
                                <option selected>Sort</option>
                            </select>
                        </div>
                    </div>
                    <hr/>
                </div>
                <div className="row d-flex align-items-center justify-content-center mt-2">
                    <div className="col-sm-8">
                        <div className="card d-flex flex-row">
                            <img src={collegeLogo} className="img-fluid events-card-image align-self-center" alt="..."/>
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold">Event title</h5>
                                <p className="card-text">Event description</p>
                                <div className="d-flex flex-row">
                                    <button type="button" onClick = {this.showAdminItemModal} 
                                        className="btn btn-primary btn-style mr-2">Edit</button>
                                    <a href="#" class="btn btn-primary delete-btn-style">Delete</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row d-flex align-items-center justify-content-center mt-2">
                    <div className="col-sm-8">
                        <div className="card d-flex flex-row">
                            <img src={collegeLogo} className="img-fluid events-card-image align-self-center" alt="..."/>
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold">Event title</h5>
                                <p className="card-text">Event description</p>
                                <div className="d-flex flex-row">
                                    <a href="#" class="btn btn-primary btn-style mr-2">Edit</a>
                                    <a href="#" class="btn btn-primary delete-btn-style">Delete</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row d-flex align-items-center justify-content-center mt-2">
                    <div className="col-sm-8">
                        <div className="card d-flex flex-row">
                            <img src={collegeLogo} className="img-fluid events-card-image align-self-center" alt="..."/>
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold">Event title</h5>
                                <p className="card-text">Event description</p>
                                <div className="d-flex flex-row">
                                    <a href="#" class="btn btn-primary btn-style mr-2">Edit</a>
                                    <a href="#" class="btn btn-primary delete-btn-style">Delete</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row d-flex align-items-center justify-content-center mt-2">
                    <div className="col-sm-8">
                        <div className="card d-flex flex-row">
                            <img src={collegeLogo} className="img-fluid events-card-image align-self-center" alt="..."/>
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold">Event title</h5>
                                <p className="card-text">Event description</p>
                                <div className="d-flex flex-row">
                                    <a href="#" class="btn btn-primary btn-style mr-2">Edit</a>
                                    <a href="#" class="btn btn-primary delete-btn-style">Delete</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row d-flex align-items-center justify-content-center mt-2">
                    <div className="col-sm-8">
                        <div className="card d-flex flex-row">
                            <img src={collegeLogo} className="img-fluid events-card-image align-self-center" alt="..."/>
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold">Event title</h5>
                                <p className="card-text">Event description</p>
                                <div className="d-flex flex-row">
                                    <a href="#" class="btn btn-primary btn-style mr-2">Edit</a>
                                    <a href="#" class="btn btn-primary delete-btn-style">Delete</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {this.state.showAdminItemModal ? 
            <AdminItemModal hideAdminItemModal={this.hideAdminItemModal}/> : null}
        </div>)
    }
}
        
export default AdminInventory;