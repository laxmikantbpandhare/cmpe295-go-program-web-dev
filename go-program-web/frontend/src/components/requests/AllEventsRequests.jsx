import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import collegeLogo from '../../images/coe_logo.png';
import '../../Common.css';
import './Requests.css';
import {connect} from 'react-redux';
import {getAllEvents} from '../../redux/actions/eventsRequestsAction';
import EventRequest from './EventRequest';

class AllEventsRequests extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchEventName: "",
            searchStudentId: "",
            filter: "",
            sort: ""
        };
    }

    componentDidMount(){
        this.props.getAllEvents();
    }

    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    resetSearchSection = e => {
        this.setState(
            {
                searchEventName: "",
                searchStudentId: "",
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

        let sortedEvents = [...this.props.events];
        if(this.state.sort !== ""){
            if(this.state.sort === "Submitted Date Ascending"){
                sortedEvents.sort((event1, event2) => new Date(event1.createdDate) - new Date(event2.createdDate));
            } else {
                sortedEvents.sort((event1, event2) => new Date(event2.createdDate) - new Date(event1.createdDate));
            }
        }

        let filteredEvents = sortedEvents.filter(event => {
            return (event.event.name.toLowerCase().indexOf(this.state.searchEventName.toLowerCase()) !== -1 &&
            event.student.sjsuId.toLowerCase().indexOf(this.state.searchStudentId.toLowerCase()) !== -1 && 
            event.status.indexOf(this.state.filter)!==-1)
        });
        
        let noEventText = this.state.search !== ""
        ? "No Event Matching the Search or Filter Criteria"
        : "No Event is submitted yet by any student.";
        return(
        <div className="top-align">
            {redirectVar}
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-calendar-check"></i> Students Events</h4>
            </div>
            
            <div className="container-fluid requests-below-heading">
                <div className="requests-search-section">
                    <h4 className="text-center text-white all-events-heading p-1 mt-2">All Submitted Events</h4>
                    <div className="row">
                        <div  class="col-6 col-sm-2 order-sm-3">
                            <select className="form-control" name="filter" onChange={this.handleChange}
                             value={this.state.filter}>
                                <option selected value="">Filter by Status</option>
                                {
                                    this.statusOptions.map(option => <option>{option}</option>)
                                }
                            </select>
                        </div>

                        <div  class="col-6 col-sm-2 order-sm-4">
                            <select className="form-control" name="sort" onChange={this.handleChange}
                             value={this.state.sort}>
                                <option selected value="">Sort by</option>
                                <option>Submitted Date Ascending</option>
                                <option>Submitted Date Descending</option>
                            </select>
                        </div>

                        <div class="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>

                        <div className="input-group col-12 col-sm-3 order-sm-2">
                            <div class="input-group-prepend">
                                <div className="input-group-text"><i className="fas fa-search"></i></div>
                            </div>
                            <input className="form-control py-2" name="searchEventName" placeholder="Search by Event Name"
                            onChange={this.handleChange} value={this.state.search}></input>
                        </div>

                        <div class="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>

                        <div className="input-group col-10 col-sm-3 order-sm-1">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fas fa-search"></i></div>
                            </div>
                            <input type = "number" className="form-control py-2" name="searchStudentId" placeholder="Search by Student Id"
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
                <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6>
                {
                    filteredEvents.length!==0 ? filteredEvents.map(event =>
                    <EventRequest event={event} key={event._id}/>
                    )
                    :
                    <h2>{noEventText}</h2>   
                }
            </div>
        </div>)
    }
}
        
const mapDispatchToProps = dispatch => {
    return {
        getAllEvents: () => {dispatch(getAllEvents())}
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.eventsRequests.getResponseMessage,
        events: state.eventsRequests.events
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllEventsRequests);