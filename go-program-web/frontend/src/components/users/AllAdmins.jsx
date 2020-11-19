import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../../Common.css';
import './Users.css';
import NewAdminModal from './NewAdminModal';
import {connect} from 'react-redux';
import {getAdmins} from '../../redux/actions/adminUsersAction';
import AdminDetails from './AdminDetails';

class AllAdmins extends Component{
    constructor(props){
        super(props);
        this.state = {
            showNewAdminModal: false,
            searchAdminId: "",
            searchAdminName: "",
            filter: "",
            sort: ""
        };
    }
    
    showNewAdminModal = e => {
        this.setState({showNewAdminModal: true});
    }
    
    hideNewAdminModal = e => {
        this.setState({showNewAdminModal: false});
    }

    componentDidMount(){
        this.props.getAdmins();
    }

    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    resetSearchSection = e => {
        this.setState(
            {
                searchAdminId: "",
                searchAdminName: "",
                filter: "",
                sort: ""
            }
        );   
    }
    
    render() {
        let sortedAdmins = [...this.props.admins];
        if(this.state.sort !== ""){
            if(this.state.sort === "Created Date Ascending"){
                sortedAdmins.sort((admin1, admin2) => new Date(admin1.createdDate) - new Date(admin2.createdDate));
            } else if(this.state.sort === "Created Date Descending"){
                sortedAdmins.sort((admin1, admin2) => new Date(admin2.createdDate) - new Date(admin1.createdDate));
            } else if(this.state.sort === "Update Date Ascending"){
                sortedAdmins.sort((admin2, admin1) => new Date(admin1.updatedDate) - new Date(admin2.updatedDate));
            } else {
                sortedAdmins.sort((admin1, admin2) => new Date(admin2.updatedDate) - new Date(admin1.updatedDate));
            }
        }
        let filteredAdmins = sortedAdmins.filter(admin => {
            var fullName = admin.fname + " " + admin.lname;
            return ( fullName.toLowerCase().indexOf(this.state.searchAdminName.toLowerCase()) !== -1 &&
                admin.id.toLowerCase().indexOf(this.state.searchAdminId.toLowerCase()) !== -1 &&
                admin.status.indexOf(this.state.filter)!==-1)
        });
        
        let noUserText = this.state.searchAdminId !== "" || this.state.searchAdminName !== "" || this.state.filter !== ""
        ? "No Admin Matching the Search or Filter Criteria."
        : "No Admin is yet created.";
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-user"></i> Admin Users</h4>
            </div>
            
            <div className="container-fluid below-heading">
                <div className="row">
                    <div className="col-sm-4 offset-4 offset-sm-5 mt-2">
                        <button className="btn btn-primary btn-style font-weight-bold" onClick = {this.showNewAdminModal}>
                            <i class="fas fa-plus"></i> &nbsp;Admin User
                        </button>
                    </div>
                </div>
                <div className="events-search-section">
                    <h4 className="text-center text-white all-events-heading p-1 mt-2">All Admin Users</h4>
                    <div className="row">
                    <div  class="col-6 col-sm-2 order-sm-3">
                            <select className="form-control" name="filter" onChange={this.handleChange}
                             value={this.state.filter}>
                                <option selected value="">Filter by Status</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>

                        <div  class="col-6 col-sm-2 order-sm-4">
                            <select className="form-control" name="sort" onChange={this.handleChange}
                             value={this.state.sort}>
                                <option selected value="">Sort by</option>
                                <option>Created Date Ascending</option>
                                <option>Created Date Descending</option>
                                <option>Updated Date Ascending</option>
                                <option>Updated Date Descending</option>
                            </select>
                        </div>

                        <div class="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>

                        <div className="input-group col-12 col-sm-3 order-sm-2">
                            <div class="input-group-prepend">
                                <div className="input-group-text"><i className="fas fa-search"></i></div>
                            </div>
                            <input className="form-control py-2" name="searchAdminName" placeholder="Search by Admin Name"
                            onChange={this.handleChange} value={this.state.searchStudentName}></input>
                        </div>

                        <div class="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>

                        <div className="input-group col-10 col-sm-3 order-sm-1">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fas fa-search"></i></div>
                            </div>
                            <input type = "number" className="form-control py-2" name="searchAdminId" placeholder="Search by Admin Id"
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
                <div className={`status-msg ${this.props.responseStatus}`}>
                    {this.props.responseMessage}
                </div>
                {
                    filteredAdmins.length!==0 ? filteredAdmins.map(admin=>
                    <AdminDetails admin={admin} key={admin._id}/>
                    )
                    :
                    <h2>{noUserText}</h2>
                    
                }
            </div>
            {
                this.state.showNewAdminModal
                ? <NewAdminModal hideNewAdminModal={this.hideNewAdminModal}/> 
                : null
            }
        </div>)
    }
}
        
const mapDispatchToProps = dispatch => {
    return {
        getAdmins: () => {dispatch(getAdmins())}
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.adminUsers.getResponseMessage,
        responseStatus: state.adminUsers.getResponseStatus,
        admins: state.adminUsers.admins
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllAdmins);