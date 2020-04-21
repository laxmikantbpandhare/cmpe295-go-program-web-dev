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
            search: ""
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
    
    render() {
        let redirectVar = null;
        if(!localStorage.getItem('token')){
            redirectVar = <Redirect to= "/login"/>
        }
        
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
                        <div class="col-10 col-sm-6">
                            <input type="search" class="form-control" placeholder="Search by Event Title" />
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
                <h6 style= {{color:"red"}}>{this.props.adminResponseMessage}</h6>
                <h6 style= {{color:"red"}}>{this.props.studentResponseMessage}</h6>
                {
                    this.props.studentEvents.length!==0 ? this.props.studentEvents.map((event,index)=>
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