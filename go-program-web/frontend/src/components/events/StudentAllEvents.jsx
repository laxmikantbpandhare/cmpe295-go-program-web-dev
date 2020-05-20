import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import collegeLogo from '../../images/coe_logo.png';
import '../../Common.css';
import './Events.css';
import StudentNewEventModal from './StudentNewEventModal';
import {connect} from 'react-redux';
import {getActiveEvents} from '../../redux/actions/adminEventsAction';
import {getEvents} from '../../redux/actions/studentEventsAction';
import StudentEvent from './StudentEvent';

class StudentAllEvents extends Component{
    constructor(props){
        super(props);
        this.state = {
            showStudentNewEventModal: false,
            search: "",
            filter: "",
            sort: ""
        };
        this.showStudentNewEventModal = this.showStudentNewEventModal.bind(this);
        this.hideStudentNewEventModal = this.hideStudentNewEventModal.bind(this);
    }
    
    showStudentNewEventModal = e => {
        this.setState({showStudentNewEventModal: true});
    }
    
    hideStudentNewEventModal = e => {
        this.setState({showStudentNewEventModal: false});
    }

    componentDidMount(){
        this.props.getActiveEvents();
        this.props.getStudentEvents();
    }

    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    resetSearchSection = e => {
        this.setState(
            {
                search: "",
                filter: "",
                sort: ""
            }
        );   
    }

    statusOptions = ['Pending Approval', 'Approved', 'Rejected', 'Action Required'];
    
    render() {
        let redirectVar = null;
        if(!localStorage.getItem('token')){
            redirectVar = <Redirect to= "/login"/>
        }

        let sortedEvents = [...this.props.studentEvents];
        if(this.state.sort !== ""){
            if(this.state.sort === "Points Ascending"){
                sortedEvents.sort((event1, event2) => event1.event.points - event2.event.points);
            } else if(this.state.sort === "Points Descending"){
                sortedEvents.sort((event1, event2) => event2.event.points - event1.event.points);
            } else if(this.state.sort === "Submitted Date Ascending"){
                sortedEvents.sort((event1, event2) => new Date(event1.createdDate) - new Date(event2.createdDate));
            } else {
                sortedEvents.sort((event1, event2) => new Date(event2.createdDate) - new Date(event1.createdDate));
            }
        }

        let filteredEvents = sortedEvents.filter(event => {
            return (event.event.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 &&
            event.status.indexOf(this.state.filter)!==-1)
        });
        
        let noEventText = this.state.search !== ""
        ? "No Event Matching the Search or Filter Criteria"
        : "No Event is submitted yet by you.";
        return(
        <div className="top-align">
            {redirectVar}
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-calendar-check"></i> Events</h4>
            </div>
            
            <div className="container-fluid events-below-heading">
                <div class="row">
                    <div class="col-sm-4 offset-4 offset-sm-5 mt-2">
                        <button className="btn btn-primary btn-style font-weight-bold" onClick = {this.showStudentNewEventModal}>
                            <i class="fas fa-plus"></i> &nbsp;Submit Event
                        </button>
                    </div>
                </div>
                <div className="events-search-section">
                    <h4 className="text-center text-white all-events-heading p-1 mt-2">All Submitted Events</h4>
                    <div className="row">
                        <div  class="col-6 col-sm-2 order-sm-2">
                            <select className="form-control" name="filter" onChange={this.handleChange}
                             value={this.state.filter}>
                                <option selected value="">Filter by Status</option>
                                {
                                    this.statusOptions.map(option => <option>{option}</option>)
                                }
                            </select>
                        </div>

                        <div  class="col-6 col-sm-3 order-sm-3">
                            <select className="form-control" name="sort" onChange={this.handleChange}
                             value={this.state.sort}>
                                <option selected value="">Sort by</option>
                                <option>Points Ascending</option>
                                <option>Points Descending</option>
                                <option>Submitted Date Ascending</option>
                                <option>Submitted Date Descending</option>
                            </select>
                        </div>

                        <div class="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>
                        
                        <div className="input-group col-10 col-sm-5 order-sm-1">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fas fa-search"></i></div>
                            </div>
                            <input class="form-control py-2" name="search" placeholder="Search by Event Name"
                            onChange={this.handleChange} value={this.state.search}></input>
                        </div>

                        <div  class="col-2 col-sm-2 order-sm-4">
                            <button className="btn btn-primary" style={{backgroundColor:"#0056a3"}}
                                onClick={this.resetSearchSection}>
                                <i className="fas fa-sync"></i>
                                <span className="d-none d-sm-inline"> Reset</span>
                            </button>
                        </div>
                    </div>
                    <hr/>
                </div>
                <h6 style= {{color:"red"}}>{this.props.adminResponseMessage}</h6>
                <h6 style= {{color:"red"}}>{this.props.studentResponseMessage}</h6>
                {
                    filteredEvents.length!==0 ? filteredEvents.map((event,index)=>
                    <StudentEvent event={event} key={index}/>
                    )
                    :
                    <h2>{noEventText}</h2>
                    
                }
            </div>
            {
                this.state.showStudentNewEventModal
                ? <StudentNewEventModal hideStudentNewEventModal={this.hideStudentNewEventModal}
                events = {this.props.adminEvents}/> 
                : null
            }
        </div>)
    }
}
        
const mapDispatchToProps = dispatch => {
    return {
        getActiveEvents: () => {dispatch(getActiveEvents())},
        getStudentEvents: () => {dispatch(getEvents())}
    }
}

const mapStateToProps = state => {
    return {
        adminResponseMessage: state.adminEvents.getResponseMessage,
        studentResponseMessage:state.studentEvents.getResponseMessage,
        adminEvents: state.adminEvents.activeEvents,
        studentEvents: state.studentEvents.events
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentAllEvents);