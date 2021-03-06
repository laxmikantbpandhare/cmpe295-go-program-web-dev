import React, {Component} from 'react';
import '../../Common.css';
import {connect} from 'react-redux';
import {getAllStudents} from '../../redux/actions/usersRequestsAction';
import UserRequest from './UserRequest';

class AllUserRequests extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchStudentId: "",
            searchStudentName: "",
            filter: "",
            sort: ""
        };
    }

    componentDidMount(){
        this.props.getAllStudents();
    }

    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    resetSearchSection = e => {
        this.setState(
            {
                searchStudentId: "",
                searchStudentName: "",
                filter: "",
                sort: ""
            }
        );   
    }

    render() {
        let sortedStudents = [...this.props.students];
        if(this.state.sort !== ""){
            if(this.state.sort === "Created Date Ascending"){
                sortedStudents.sort((student1, student2) => new Date(student1.user.createdDate) - new Date(student2.user.createdDate));
            } else if(this.state.sort === "Created Date Descending"){
                sortedStudents.sort((student1, student2) => new Date(student2.user.createdDate) - new Date(student1.user.createdDate));
            } else if(this.state.sort === "Update Date Ascending"){
                sortedStudents.sort((student2, student1) => new Date(student1.user.updatedDate) - new Date(student2.user.updatedDate));
            } else {
                sortedStudents.sort((student1, student2) => new Date(student2.user.updatedDate) - new Date(student1.user.updatedDate));
            }
        }
        let filteredStudents = sortedStudents.filter(student => {
            var fullName = student.user.fname + " " + student.user.lname;
            return ( fullName.toLowerCase().indexOf(this.state.searchStudentName.toLowerCase()) !== -1 &&
                student.sjsuId.toLowerCase().indexOf(this.state.searchStudentId.toLowerCase()) !== -1 &&
                student.user.status.indexOf(this.state.filter)!==-1)
        });
        
        let noUserText = this.state.searchStudentId !== "" || this.state.searchStudentName !== "" || this.state.filter !== ""
        ? "No Student Matching the Search or Filter Criteria."
        : "No Student has signed up yet.";
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-user"></i> Users</h4>
            </div>
            
            <div className="container-fluid below-heading">
                <div className="entities-search-section">
                    <h4 className="text-center text-white all-entity-heading p-1 mt-2">All Students</h4>
                    <div className="row">
                        <div className="col-6 col-sm-2 order-sm-3">
                            <select className="form-control" name="filter" onChange={this.handleChange}
                             value={this.state.filter}>
                                <option value="">Filter by Status</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>

                        <div className="col-6 col-sm-2 order-sm-4">
                            <select className="form-control" name="sort" onChange={this.handleChange}
                             value={this.state.sort}>
                                <option value="">Sort by</option>
                                <option>Created Date Ascending</option>
                                <option>Created Date Descending</option>
                                <option>Updated Date Ascending</option>
                                <option>Updated Date Descending</option>
                            </select>
                        </div>

                        <div className="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>

                        <div className="input-group col-12 col-sm-3 order-sm-2">
                            <div className="input-group-prepend">
                                <div className="input-group-text"><i className="fas fa-search"></i></div>
                            </div>
                            <input className="form-control py-2" name="searchStudentName" placeholder="Search by Student Name"
                            onChange={this.handleChange} value={this.state.searchStudentName}></input>
                        </div>

                        <div className="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>

                        <div className="input-group col-10 col-sm-3 order-sm-1">
                            <div className="input-group-prepend">
                                <div className="input-group-text"><i className="fas fa-search"></i></div>
                            </div>
                            <input type = "number" className="form-control py-2" name="searchStudentId" placeholder="Search by Student Id"
                            onChange={this.handleChange} value={this.state.searchStudentId}></input>
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
                <div className={`status-msg ${this.props.responseStatus}`}>
                    {this.props.responseMessage}
                </div>
                {
                    filteredStudents.length!==0 ? filteredStudents.map(student =>
                    <UserRequest student={student} key={student._id}/>
                    )
                    :
                    <h2>{noUserText}</h2>   
                }
            </div>
        </div>)
    }
}
        
const mapDispatchToProps = dispatch => {
    return {
        getAllStudents: () => {dispatch(getAllStudents())}
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.usersRequests.getResponseMessage,
        responseStatus: state.usersRequests.getResponseStatus,
        students: state.usersRequests.students
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllUserRequests);