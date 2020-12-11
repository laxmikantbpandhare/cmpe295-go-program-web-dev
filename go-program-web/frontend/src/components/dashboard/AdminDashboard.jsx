import React, {Component} from 'react';
import '../../Common.css';
import './Dashboard.css';
import {connect} from 'react-redux';
import {getPendingApprovalEvents, getSubmittedOrders,
    getPendingApprovalSuggestedEvents} from '../../redux/actions/adminDashboardAction';

class AdminDashboard extends Component{
    
    componentDidMount(){
        this.props.getPendingApprovalEvents();
        this.props.getSubmittedOrders();
        this.props.getPendingApprovalSuggestedEvents();
    }
    
    render() {
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-tachometer-alt"></i> Dashboard</h4>
            </div>
            <div className="container-fluid dashboard-below-heading">
                <div className="row mt-4">
                    <div className="col-sm-6">
                        <h2 className="text-white text-center p-1 events-table-heading">Last 5 Pending Approval Events Requests</h2>
                        <div className="container">
                            <div className={`status-msg ${this.props.getPendingApprovalEventsResponseStatus}`}>
                                {this.props.getPendingApprovalEventsResponseMessage}
                            </div>
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Student Id</th>
                                        <th>Event</th>
                                        <th>Points</th>
                                        <th>Date Submitted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.pendingApprovalEvents.length !==0 
                                        ? this.props.pendingApprovalEvents.map(event => (
                                            <tr key={event._id}>
                                                <td>{event.student.sjsuId}</td>
                                                <td>{event.event.name}</td>
                                                <td>{event.event.points}</td>
                                                <td>{new Date(event.createdDate).toLocaleString('en-US', { hour12: false })}</td>
                                            </tr>
                                        ))
                                        : <tr><td>No Event requires Approval.</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <h2 className="text-white text-center p-1 events-table-heading">Last 5 Submitted Orders Requests</h2>
                        <div className="container">
                            <div className={`status-msg ${this.props.getSubmittedOrdersResponseStatus}`}>
                                {this.props.getSubmittedOrdersResponseMessage}
                            </div>
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Student Id</th>
                                        <th>Order Id</th>
                                        <th>Points</th>
                                        <th>Date Submitted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.submittedOrders.length !==0 
                                        ? this.props.submittedOrders.map(order => (
                                            <tr key={order._id}>
                                                <td>{order.student.sjsuId}</td>
                                                <td>{order.id}</td>
                                                <td>{order.points}</td>
                                                <td>{new Date(order.createdDate).toLocaleString('en-US', { hour12: false })}</td>
                                            </tr>
                                        ))
                                        : <tr><td>No Submitted Order.</td></tr>
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
                            <div className={`status-msg ${this.props.getPendingApprovalSuggestedEventsResponseStatus}`}>
                                {this.props.getPendingApprovalSuggestedEventsResponseMessage}
                            </div>
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Student Id</th>
                                        <th>Event</th>
                                        <th>Date Submitted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.pendingApprovalSuggestedEvents.length !==0 
                                        ? this.props.pendingApprovalSuggestedEvents.map(event => (
                                            <tr key={event._id}>
                                                <td>{event.student.sjsuId}</td>
                                                <td>{event.name}</td>
                                                <td>{new Date(event.createdDate).toLocaleString('en-US', { hour12: false })}</td>
                                            </tr>
                                        ))
                                        : <tr><td>No Suggested Event requires Approval.</td></tr>
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
        getPendingApprovalEventsResponseStatus: state.adminDashboard.getPendingApprovalEventsResponseStatus,
        pendingApprovalEvents: state.adminDashboard.pendingApprovalEvents,
        getSubmittedOrdersResponseMessage: state.adminDashboard.getSubmittedOrdersResponseMessage,
        getSubmittedOrdersResponseStatus: state.adminDashboard.getSubmittedOrdersResponseStatus,
        submittedOrders: state.adminDashboard.submittedOrders,
        getPendingApprovalSuggestedEventsResponseMessage: state.adminDashboard.getPendingApprovalSuggestedEventsResponseMessage,
        getPendingApprovalSuggestedEventsResponseStatus: state.adminDashboard.getPendingApprovalSuggestedEventsResponseStatus,
        pendingApprovalSuggestedEvents: state.adminDashboard.pendingApprovalSuggestedEvents
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);