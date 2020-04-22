import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import collegeLogo from '../../images/coe_logo.png';
import '../../Common.css';
import './Requests.css';
import {connect} from 'react-redux';
import {getAllEventsRequests} from '../../redux/actions/eventsRequestsAction';
import EventRequest from './EventRequest';

class AllEventsRequests extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: ""
        };
    }

    componentDidMount(){
        this.props.getAllEventsRequests();
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
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-calendar-check"></i> Students Events</h4>
            </div>
            
            <div className="container-fluid requests-below-heading">
                <div className="requests-search-section">
                    <h4 className="text-center text-white all-requests-heading p-1 mt-2">All Requested Events</h4>
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
                <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6>
                {
                    this.props.events.length!==0 ? this.props.events.map((event,index)=>
                    <EventRequest event={event} key={index}/>
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
        getAllEventsRequests: () => {dispatch(getAllEventsRequests())}
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.eventsRequests.getResponseMessage,
        events: state.eventsRequests.events
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllEventsRequests);