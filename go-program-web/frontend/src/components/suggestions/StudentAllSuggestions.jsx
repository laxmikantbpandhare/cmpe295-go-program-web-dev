import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../../Common.css';
import './Suggestions.css';
import StudentNewSuggestionModal from './StudentNewSuggestionModal';
import {connect} from 'react-redux';
import {getEvents} from '../../redux/actions/suggestedEventsAction';
import StudentSuggestion from './StudentSuggestion';

class StudentAllSuggestions extends Component{
    constructor(props){
        super(props);
        this.state = {
            showStudentNewSuggestionModal: false,
            search: "",
            filter: "",
            sort: ""
        };
    }
    
    showStudentNewSuggestionModal = e => {
        this.setState({showStudentNewSuggestionModal: true});
    }
    
    hideStudentNewSuggestionModal = e => {
        this.setState({showStudentNewSuggestionModal: false});
    }

    componentDidMount(){
        this.props.getEvents();
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

    statusOptions = ['Pending Approval', 'Approved', 'Rejected'];
    
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
            return (event.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 &&
            event.status.indexOf(this.state.filter)!==-1)
        });
        
        let noEventText = this.state.search !== ""
        ? "No Event Matching the Search or Filter Criteria"
        : "No Event is suggested yet by you.";
        return(
        <div className="top-align">
            {redirectVar}
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-lightbulb"></i> Suggestions</h4>
            </div>
            
            <div className="container-fluid below-heading">
                <div className="row">
                    <div style={{fontSize:"1.2em"}} className="offset-sm-3 mt-2 font-weight-bold">
                        Can't find an event to submit? Suggest and send an event to admin for approval.
                    </div>
                    <div className="col-sm-4 offset-4 offset-sm-5 mt-2">
                        <button className="btn btn-primary btn-style font-weight-bold" onClick = {this.showStudentNewSuggestionModal}>
                            <i class="fas fa-plus"></i> &nbsp;Suggest Event
                        </button>
                    </div>
                </div>
                <div className="events-search-section">
                    <h4 className="text-center text-white all-events-heading p-1 mt-2">All Suggested Events</h4>
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
                <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6>
                {
                    filteredEvents.length!==0 ? filteredEvents.map(event=>
                    <StudentSuggestion event={event} key={event._id}/>
                    )
                    :
                    <h2>{noEventText}</h2>
                    
                }
            </div>
            {
                this.state.showStudentNewSuggestionModal
                ? <StudentNewSuggestionModal hideStudentNewSuggestionModal={this.hideStudentNewSuggestionModal}/> 
                : null
            }
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
        responseMessage: state.suggestedEvents.getResponseMessage,
        events: state.suggestedEvents.events
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentAllSuggestions);