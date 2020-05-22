import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import '../../Common.css';
import './Events.css'
import AdminNewEventModal from './AdminNewEventModal';
import {connect} from 'react-redux';
import {getEvents} from '../../redux/actions/adminEventsAction';
import AdminEvent from './AdminEvent';

class AdminAllEvents extends Component{
    constructor(props){
        super(props);
        this.state = {
            showAdminNewEventModal: false,
            search: "",
            sort: ""
        };
        this.showAdminNewEventModal = this.showAdminNewEventModal.bind(this);
        this.hideAdminNewEventModal = this.hideAdminNewEventModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentDidMount(){
        this.props.getEvents();
    }

    showAdminNewEventModal = e => {
        this.setState({showAdminNewEventModal: true});
    }
    
    hideAdminNewEventModal = e => {
        this.setState({showAdminNewEventModal: false});
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
                sort: ""
            }
        );   
    }
    
    render() {
        let redirectVar = null;
        if(!localStorage.getItem('token')){
            redirectVar = <Redirect to= "/login"/>
        }
        let sortedEvents = [...this.props.events];
        if(this.state.sort !== ""){
            if(this.state.sort === "Points Asc"){
                sortedEvents.sort((event1, event2) => event1.points - event2.points);
            } else if(this.state.sort === "Points Desc"){
                sortedEvents.sort((event1, event2) => event2.points - event1.points);
            } else if(this.state.sort === "Created Date Asc"){
                sortedEvents.sort((event1, event2) => new Date(event1.createdDate) - new Date(event2.createdDate));
            } else {
                sortedEvents.sort((event1, event2) => new Date(event2.createdDate) - new Date(event1.createdDate));
            }
        }

        let filteredEvents = sortedEvents.filter(event => {
            return (event.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1)
        });
         
        let noEventText = this.state.search !== ""
        ? "No Event Matching the Search or Filter Criteria"
        : "No Event is created yet";
        return(
        <div className="top-align">
            {redirectVar}
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-calendar-check"></i> Events</h4>
            </div>
            
            <div className="container-fluid events-below-heading">
                <div class="row">
                    <div class="col-sm-4 offset-4 offset-sm-5 mt-2">
                        <button className="btn btn-primary btn-style font-weight-bold" onClick = {this.showAdminNewEventModal}>
                            <i class="fas fa-plus"></i> &nbsp;Add Event
                        </button>
                    </div>
                </div>
                <div className="events-search-section">
                    <h4 className="text-center text-white all-events-heading p-1 mt-2">All Events</h4>
                    <div className="row">
                       {/* <div className="col-6 col-sm-2 order-sm-2">
                            <label className="points-filter col-9">Points Filter</label>
                            <div className="col-4">

                            </div>
                        </div> */}

                        <div className="col-sm-2 order-sm-3">
                            <select className="form-control" name="sort" onChange={this.handleChange}
                             value={this.state.sort}>
                                <option selected value="">Sort by</option>
                                <option>Points Asc</option>
                                <option>Points Desc</option>
                                <option>Created Date Asc</option>
                                <option>Created Date Desc</option>
                            </select>
                        </div>

                        <div className="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>
                        
                        <div className="input-group col-10 col-sm-6 order-sm-1">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fas fa-search"></i></div>
                            </div>
                            <input class="form-control py-2" name="search" placeholder="Search by Event Name"
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
                <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6>
                {
                    filteredEvents.length!==0 ? filteredEvents.map((event,index)=>
                    <AdminEvent event={event} key={index}/>
                    )
                    :
                    <h2>{noEventText}</h2>
                    
                }
            </div>
            {this.state.showAdminNewEventModal ? 
            <AdminNewEventModal hideAdminNewEventModal={this.hideAdminNewEventModal}/> : null}
        </div>)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getEvents: () => {dispatch(getEvents())}
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.adminEvents.getResponseMessage,
        events: state.adminEvents.events
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminAllEvents);