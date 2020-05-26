import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import '../../Common.css';
import './Dashboard.css';
import {connect} from 'react-redux';
import {getPendingApprovalEvents, getSubmittedOrders,
    getPendingApprovalSuggestedEvents} from '../../redux/actions/adminDashboardAction';

class AdminDashboard extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.getPendingApprovalEvents();
        this.props.getSubmittedOrders();
        this.props.getPendingApprovalSuggestedEvents();
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
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-tachometer-alt"></i> Dashboard</h4>
            </div>
            <div className="container-fluid dashboard-below-heading">
                <div className="row mt-4">
                    <div className="col-sm-6">
                        <h2 className="text-white text-center p-1 events-table-heading">Last 5 Pending Approval Events Requests</h2>
                        <div className="container">
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Student Id</th>
                                        <th>Event</th>
                                        <th>Points</th>
                                        <th>Date Submitted</th>
                                    </tr>
                                </thead>
                                <h6 style= {{color:"red"}}>{this.props.getPendingApprovalEventsResponseMessage}</h6>
                                <tbody>
                                    {
                                        this.props.pendingApprovalEvents.length !==0 
                                        ? this.props.pendingApprovalEvents.map(event => (
                                            <tr>
                                                <td>{event.student.sjsuId}</td>
                                                <td>{event.event.name}</td>
                                                <td>{event.event.points}</td>
                                                <td>{new Date(event.createdDate).toLocaleString('en-US', { hour12: false })}</td>
                                            </tr>
                                        ))
                                        : <h6>No Event requires Approval.</h6>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <h2 className="text-white text-center p-1 events-table-heading">Last 5 Submitted Orders Requests</h2>
                        <div className="container">
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Student Id</th>
                                        <th>Order Id</th>
                                        <th>Points</th>
                                        <th>Date Submitted</th>
                                    </tr>
                                </thead>
                                <h6 style= {{color:"red"}}>{this.props.getSubmittedOrdersResponseMessage}</h6>
                                <tbody>
                                    {
                                        this.props.submittedOrders.length !==0 
                                        ? this.props.submittedOrders.map(order => (
                                            <tr>
                                                <td>{order.student.sjsuId}</td>
                                                <td>{order.id}</td>
                                                <td>{order.points}</td>
                                                <td>{new Date(order.createdDate).toLocaleString('en-US', { hour12: false })}</td>
                                            </tr>
                                        ))
                                        : <h6>No Submitted Order.</h6>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-sm-8">
                        <h2 className="text-white text-center p-1 events-table-heading">Last 5 Pending Approval Suggested Events Requests</h2>
                        <div className="container">
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Student Id</th>
                                        <th>Event</th>
                                        <th>Date Submitted</th>
                                    </tr>
                                </thead>
                                <h6 style= {{color:"red"}}>{this.props.getPendingApprovalSuggestedEventsResponseMessage}</h6>
                                <tbody>
                                    {
                                        this.props.pendingApprovalSuggestedEvents.length !==0 
                                        ? this.props.pendingApprovalSuggestedEvents.map(event => (
                                            <tr>
                                                <td>{event.student.sjsuId}</td>
                                                <td>{event.name}</td>
                                                <td>{new Date(event.createdDate).toLocaleString('en-US', { hour12: false })}</td>
                                            </tr>
                                        ))
                                        : <h6>No Suggested Event requires Approval.</h6>
                                    }
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

const mapDispatchToProps = dispatch => {
    return {
        getPendingApprovalEvents: () => {dispatch(getPendingApprovalEvents())},
        getSubmittedOrders: () => {dispatch(getSubmittedOrders())},
        getPendingApprovalSuggestedEvents: () => {dispatch(getPendingApprovalSuggestedEvents())}
    }
}

const mapStateToProps = state => {
    return {
        getPendingApprovalEventsResponseMessage: state.adminDashboard.getPendingApprovalEventsResponseMessage,
        pendingApprovalEvents: state.adminDashboard.pendingApprovalEvents,
        getSubmittedOrdersResponseMessage: state.adminDashboard.getSubmittedOrdersResponseMessage,
        submittedOrders: state.adminDashboard.submittedOrders,
        getPendingApprovalSuggestedEventsResponseMessage: state.adminDashboard.getPendingApprovalSuggestedEventsResponseMessage,
        pendingApprovalSuggestedEvents: state.adminDashboard.pendingApprovalSuggestedEvents
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);