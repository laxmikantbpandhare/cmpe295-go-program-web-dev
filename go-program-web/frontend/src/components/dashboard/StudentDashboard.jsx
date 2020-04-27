import React, {Component} from 'react';
// import {Link} from 'react-router-dom';
// import {Redirect} from 'react-router';
import '../../Common.css';
import './Dashboard.css';

class StudentDashboard extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            password: "",
            message: ""
        }
    }
    
    render() {
        // let redirectVar = null;
        if(localStorage.getItem('token')){

        }
        
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-tachometer-alt"></i> Dashboard</h4>
            </div>
            <div className="container-fluid dashboard-below-heading">
                <div className="row">
                    <div className="col-sm-4 mt-4">
                        <div className="card">
                            <div className="points-card-header">
                                <h2 className="text-center text-white">Total Points</h2>
                            </div>
                            <div className="points-card-body p-4">
                                <i className="fas fa-coins fa-7x"></i>
                                <h2 className="float-right font-weight-bold points-card-text">1000<span className="d-block">Points</span></h2>
                            </div>
                            <div className="card-footer">
                                <h6 className="text-center"><a href=""> View Details<i className="fas fa-arrow-alt-circle-right"></i></a></h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8 mt-4">
                        <h2 className="text-white text-center p-1 events-table-heading">Last 5 Approved Events</h2>
                        <div className="container">
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Title</th>
                                        <th>Points</th>
                                        <th>Date Added</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Career Fair - COE</td>
                                        <td>15</td>
                                        <td>28 Apr 2019</td>
                                        <td><a href="#" className="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>Talk and Seminar</td>
                                        <td>30</td><td>20 Apr 2019</td>
                                        <td><a href="#" class="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>RSA Conference</td>
                                        <td>18</td>
                                        <td>28 Mar 2019</td>
                                        <td><a href="#" class="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>Career Meeting</td>
                                        <td>10</td><td>20 Mar 2019</td>
                                        <td><a href="#" class="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>Some Event Title</td>
                                        <td>40</td>
                                        <td>28 Feb 2019</td>
                                        <td><a href="#" class="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 mt-4">
                        <h2 className="text-white text-center p-1 events-table-heading">Last 5 Submitted Events</h2>
                        <div className="container">
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Title</th>
                                        <th>Points</th>
                                        <th>Date Added</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Career Fair - COE</td>
                                        <td>15</td>
                                        <td>28 Dec 2019</td>
                                        <td>Submitted</td>
                                        <td><a href="#" className="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>Talk and Seminar</td>
                                        <td>30</td>
                                        <td>20 Dec 2019</td>
                                        <td>Approved</td>
                                        <td><a href="#" class="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>RSA Conference</td>
                                        <td>20</td>
                                        <td>28 Nov 2019</td>
                                        <td>Rejected</td>
                                        <td><a href="#" class="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>Career Meeting</td>
                                        <td>10</td>
                                        <td>20 Nov 2019</td>
                                        <td>Approved</td>
                                        <td><a href="#" class="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>Some long long long Title</td>
                                        <td>40</td>
                                        <td>28 Jun 2019</td>
                                        <td>Approved</td>
                                        <td><a href="#" class="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-sm-6 mt-4">
                        <h2 className="text-white text-center p-1 events-table-heading">Last 5 Claims</h2>
                        <div className="container">
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Item</th>
                                        <th>Points</th>
                                        <th>Date Claimed</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Bag</td>
                                        <td>15</td>
                                        <td>28 Jan 2020</td>
                                        <td><a href="#" className="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>Pen</td>
                                        <td>30</td>
                                        <td>20 Jan 2020</td>
                                        <td><a href="#" class="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>Football</td>
                                        <td>18</td>
                                        <td>28 Dec 2019</td>
                                        <td><a href="#" class="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>Magazine</td>
                                        <td>10</td>
                                        <td>20 Dec 2019</td>
                                        <td><a href="#" class="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>Donate</td>
                                        <td>40</td>
                                        <td>28 Feb 2019</td>
                                        <td><a href="#" class="btn btn-warning btn-sm">Details <i></i></a></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default StudentDashboard;