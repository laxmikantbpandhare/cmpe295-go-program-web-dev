import React, {Component} from 'react';
import '../../Common.css';
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
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-calendar-check"></i> Events</h4>
            </div>
            
            <div className="container-fluid below-heading">
                <div className="row">
                    <div className="col-sm-4 offset-4 offset-sm-5 mt-2">
                        <button className="btn btn-primary btn-style font-weight-bold" onClick = {this.showStudentNewEventModal}>
                            <i className="fas fa-plus"></i> &nbsp;Submit Event
                        </button>
                    </div>
                </div>
                <div className="entities-search-section">
                    <h4 className="text-center text-white all-entity-heading p-1 mt-2">All Submitted Events</h4>
                    <div className="row">
                        <div  className="col-6 col-sm-2 order-sm-2">
                            <select className="form-control" name="filter" onChange={this.handleChange}
                             value={this.state.filter}>
                                <option value="">Filter by Status</option>
                                {
                                    this.statusOptions.map((option, idx) => <option key={idx}>{option}</option>)
                                }
                            </select>
                        </div>

                        <div  className="col-6 col-sm-3 order-sm-3">
                            <select className="form-control" name="sort" onChange={this.handleChange}
                             value={this.state.sort}>
                                <option value="">Sort by</option>
                                <option>Points Ascending</option>
                                <option>Points Descending</option>
                                <option>Submitted Date Ascending</option>
                                <option>Submitted Date Descending</option>
                            </select>
                        </div>

                        <div className="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>
                        
                        <div className="input-group col-10 col-sm-5 order-sm-1">
                            <div className="input-group-prepend">
                                <div className="input-group-text"><i className="fas fa-search"></i></div>
                            </div>
                            <input className="form-control py-2" name="search" placeholder="Search by Event Name"
                            onChange={this.handleChange} value={this.state.search}></input>
                        </div>

                        <div  className="col-2 col-sm-2 order-sm-4">
                            <button className="btn btn-primary" style={{backgroundColor:"#0056a3"}}
                                onClick={this.resetSearchSection}>
                                <i className="fas fa-sync"></i>
                                <span className="d-none d-sm-inline"> Reset</span>
                            </button>
                        </div>
                    </div>
                    <hr/>
                </div>
                <div className={`status-msg ${this.props.adminResponseStatus}`}>
                    {this.props.adminResponseMessage}
                </div>
                <div className={`status-msg ${this.props.studentResponseStatus}`}>
                    {this.props.studentResponseMessage}
                </div>
                {
                    filteredEvents.length!==0 ? filteredEvents.map(event=>
                    <StudentEvent event={event} key={event._id}/>
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
        adminResponseStatus: state.adminEvents.getResponseStatus,
        studentResponseMessage:state.studentEvents.getResponseMessage,
        studentResponseStatus:state.studentEvents.getResponseStatus,
        adminEvents: state.adminEvents.activeEvents,
        studentEvents: state.studentEvents.events
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentAllEvents);