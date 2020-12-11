import React, {Component} from 'react';
import '../../Common.css';
import './Dashboard.css';
import {connect} from 'react-redux';
import {getPoints, getEvents, getApprovedEvents, getOrders,
    getDeliveredOrders, getSuggestedEvents, getApprovedSuggestedEvents} from '../../redux/actions/studentDashboardAction';

class StudentDashboard extends Component{

    componentDidMount(){
        this.props.getPoints().then(() => {
            localStorage.setItem('pointsAccumulated', this.props.pointsAccumulated);
            localStorage.setItem('pointsSpent', this.props.pointsSpent);
        }).catch(() => {
        });

        this.props.getEvents();
        this.props.getApprovedEvents();

        this.props.getOrders();
        this.props.getDeliveredOrders();

        this.props.getSuggestedEvents();
        this.props.getApprovedSuggestedEvents();
    }
    
    render() {
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-tachometer-alt"></i> Dashboard</h4>
            </div>
            <div className="container-fluid dashboard-below-heading">
                <div className="row mt-4">
                    <div className="col-sm-4">
                        <div className={`status-msg ${this.props.getPointsResponseStatus}`}>
                            {this.props.getPointsResponseMessage}
                        </div>
                        <div className="card">
                            <div className="points-card-header">
                                <h2 className="text-center text-white">Points Earned</h2>
                            </div>
                            <div className="points-card-body p-4">
                                <i className="fas fa-coins fa-7x"></i>
                                <h2 className="float-right font-weight-bold points-card-text">{this.props.pointsAccumulated}<span className="d-block">Points</span></h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className={`status-msg ${this.props.getPointsResponseStatus}`}>
                            {this.props.getPointsResponseMessage}
                        </div>
                        <div className="card">
                            <div className="points-card-header">
                                <h2 className="text-center text-white">Points Spent</h2>
                            </div>
                            <div className="points-card-body p-4">
                                <i className="fas fa-coins fa-7x"></i>
                                <h2 className="float-right font-weight-bold points-card-text">{this.props.pointsSpent}<span className="d-block">Points</span></h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="card">
                            <div className="points-card-header">
                                <h2 className="text-center text-white">Balance Points</h2>
                            </div>
                            <div className="points-card-body p-4">
                                <i className="fas fa-coins fa-7x"></i>
                                <h2 className="float-right font-weight-bold points-card-text">{this.props.pointsAccumulated - this.props.pointsSpent}<span className="d-block">Points</span></h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-sm-6">
                        <h2 className="text-white text-center p-1 events-table-heading">Last 5 Approved Events</h2>
                        <div className="container">
                            <div className={`status-msg ${this.props.getApprovedEventsResponseStatus}`}>
                                {this.props.getApprovedEventsResponseMessage}
                            </div>
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Title</th>
                                        <th>Points</th>
                                        <th>Date Added</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.approvedEvents.length !==0 
                                        ? this.props.approvedEvents.map(event => (
                                            <tr key={event._id}>
                                                <td>{event.event.name}</td>
                                                <td>{event.event.points}</td>
                                                <td>{new Date(event.createdDate).toLocaleString('en-US', { hour12: false })}</td>
                                            </tr>
                                        ))
                                        : <tr><td>No Approved Event.</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <h2 className="text-white text-center p-1 events-table-heading">Last 5 Events</h2>
                        <div className="container">
                            <div className={`status-msg ${this.props.getEventsResponseStatus}`}>
                                {this.props.getEventsResponseMessage}
                            </div>
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Title</th>
                                        <th>Points</th>
                                        <th>Date Submitted</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.events.length !==0 
                                        ? this.props.events.map(event => (
                                            <tr key={event._id}>
                                                <td>{event.event.name}</td>
                                                <td>{event.event.points}</td>
                                                <td>{new Date(event.createdDate).toLocaleString('en-US', { hour12: false })}</td>
                                                <td>{event.status}</td>
                                            </tr>
                                        ))
                                        : <tr><td>No Event is Submitted by you.</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className = "row mt-4">
                    <div className="col-sm-6">
                        <h2 className="text-white text-center p-1 events-table-heading">Last 5 Delivered Orders</h2>
                        <div className="container">
                            <div className={`status-msg ${this.props.getDeliveredOrdersResponseStatus}`}>
                                {this.props.getDeliveredOrdersResponseMessage}
                            </div>
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Order Id</th>
                                        <th>Points</th>
                                        <th>Date Submitted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.deliveredOrders.length !==0 
                                        ? this.props.deliveredOrders.map(order => (
                                            <tr key={order._id}>
                                                <td>{order.id}</td>
                                                <td>{order.points}</td>
                                                <td>{new Date(order.createdDate).toLocaleString('en-US', { hour12: false })}</td>
                                            </tr>
                                        ))
                                        : <tr><td>No Delivered Order.</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <h2 className="text-white text-center p-1 events-table-heading">Last 5 Orders</h2>
                        <div className="container">
                            <div className={`status-msg ${this.props.getOrdersResponseStatus}`}>
                                {this.props.getOrdersResponseMessage}
                            </div>
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Order Id</th>
                                        <th>Points</th>
                                        <th>Date Submitted</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.orders.length !==0 
                                        ? this.props.orders.map(order => (
                                            <tr key={order._id}>
                                                <td>{order.id}</td>
                                                <td>{order.points}</td>
                                                <td>{new Date(order.createdDate).toLocaleString('en-US', { hour12: false })}</td>
                                                <td>{order.status}</td>
                                            </tr>
                                        ))
                                        : <tr><td>No Order is Submitted by you.</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-sm-6">
                        <h2 className="text-white text-center p-1 events-table-heading">Last 5 Approved Suggested Events</h2>
                        <div className="container">
                            <div className={`status-msg ${this.props.getApprovedSuggestedEventsResponseStatus}`}>
                                {this.props.getApprovedSuggestedEventsResponseMessage}
                            </div>
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Title</th>
                                        <th>Date Suggested</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.approvedSuggestedEvents.length !==0 
                                        ? this.props.approvedSuggestedEvents.map(event => (
                                            <tr key={event._id}>
                                                <td>{event.name}</td>
                                                <td>{new Date(event.createdDate).toLocaleString('en-US', { hour12: false })}</td>
                                            </tr>
                                        ))
                                        : <tr><td>No Approved Suggested Event.</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <h2 className="text-white text-center p-1 events-table-heading">Last 5 Suggested Events</h2>
                        <div className="container">
                            <div className={`status-msg ${this.props.getSuggestedEventsResponseStatus}`}>
                                {this.props.getSuggestedEventsResponseMessage}
                            </div>
                            <table className="table">
                                <thead className="events-table-attributes">
                                    <tr>
                                        <th>Title</th>
                                        <th>Date Submitted</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.suggestedEvents.length !==0 
                                        ? this.props.suggestedEvents.map(event => (
                                            <tr key={event._id}>
                                                <td>{event.name}</td>
                                                <td>{new Date(event.createdDate).toLocaleString('en-US', { hour12: false })}</td>
                                                <td>{event.status}</td>
                                            </tr>
                                        ))
                                        : <tr><td>No Event is Suggested by you.</td></tr>
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
        getPoints: () => dispatch(getPoints()),
        getEvents: () => {dispatch(getEvents())},
        getApprovedEvents: () => {dispatch(getApprovedEvents())},
        getOrders: () => {dispatch(getOrders())},
        getDeliveredOrders: () => {dispatch(getDeliveredOrders())},
        getSuggestedEvents: () => {dispatch(getSuggestedEvents())},
        getApprovedSuggestedEvents: () => {dispatch(getApprovedSuggestedEvents())}
    }
}

const mapStateToProps = state => {
    return {
        getPointsResponseMessage: state.studentDashboard.getPointsResponseMessage,
        getPointsResponseStatus: state.studentDashboard.getPointsResponseStatus,
        pointsAccumulated: state.studentDashboard.pointsAccumulated,
        pointsSpent: state.studentDashboard.pointsSpent,
        getEventsResponseMessage: state.studentDashboard.getEventsResponseMessage,
        getEventsResponseStatus: state.studentDashboard.getEventsResponseStatus,
        events: state.studentDashboard.events,
        getApprovedEventsResponseMessage: state.studentDashboard.getApprovedEventsResponseMessage,
        getApprovedEventsResponseStatus: state.studentDashboard.getApprovedEventsResponseStatus,
        approvedEvents: state.studentDashboard.approvedEvents,
        getOrdersResponseMessage: state.studentDashboard.getOrdersResponseMessage,
        getOrdersResponseStatus: state.studentDashboard.getOrdersResponseStatus,
        orders: state.studentDashboard.orders,
        getDeliveredOrdersResponseMessage: state.studentDashboard.getDeliveredOrdersResponseMessage,
        getDeliveredOrdersResponseStatus: state.studentDashboard.getDeliveredOrdersResponseStatus,
        deliveredOrders: state.studentDashboard.deliveredOrders,
        getSuggestedEventsResponseMessage: state.studentDashboard.getSuggestedEventsResponseMessage,
        getSuggestedEventsResponseStatus: state.studentDashboard.getSuggestedEventsResponseStatus,
        suggestedEvents: state.studentDashboard.suggestedEvents,
        getApprovedSuggestedEventsResponseMessage: state.studentDashboard.getApprovedSuggestedEventsResponseMessage,
        getApprovedSuggestedEventsResponseStatus: state.studentDashboard.getApprovedSuggestedEventsResponseStatus,
        approvedSuggestedEvents: state.studentDashboard.approvedSuggestedEvents
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentDashboard);