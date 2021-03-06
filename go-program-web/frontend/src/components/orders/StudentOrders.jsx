import React, {Component} from 'react';
import '../../Common.css';
import './Orders.css'
import {connect} from 'react-redux';
import {getOrders} from '../../redux/actions/studentOrdersAction';
import StudentOrder from './StudentOrder';

class StudentOrders extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: "",
            filter: "",
            sort: ""
        };
    }

    componentDidMount(){
        this.props.getStudentOrders();
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

    statusOptions = ['Submitted', 'Pending Delivery', 'Delivered', 'Cancelled'];
    
    render() { 
        let sortedOrders = [...this.props.studentOrders];
        if(this.state.sort !== ""){
            this.state.sort === "Ascending" 
            ? sortedOrders.sort((order1, order2) => new Date(order1.createdDate) - new Date(order2.createdDate))
            : sortedOrders.sort((order1, order2) => new Date(order2.createdDate) - new Date(order1.createdDate));
        }

        let filteredOrders = this.state.filter !== ""
        ? sortedOrders.filter(order => order.status.indexOf(this.state.filter)!==-1)
        : [...sortedOrders];

        let searchedOrders = this.state.search !== ""
        ? filteredOrders.filter(order => order.id === parseInt(this.state.search))
        : [...filteredOrders];
        
        let noOrderText = this.state.search !== "" || this.state.filter !== "" 
        ? "No Order Matching the Search or Filter Criteria"
        : "No Order is submitted yet by you.";
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-receipt"></i> Orders</h4>
            </div>
            
            <div className="container-fluid below-heading">
                <div className="entities-search-section">
                    <h4 className="text-center text-white all-entity-heading p-1 mt-2">Your Orders</h4>
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
                                <option value="">Sort by Submitted Date</option>
                                <option>Ascending</option>
                                <option>Descending</option>
                            </select>
                        </div>

                        <div className="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>
                        
                        <div className="input-group col-10 col-sm-5 order-sm-1">
                            <div className="input-group-prepend">
                                <div className="input-group-text"><i className="fas fa-search"></i></div>
                            </div>
                            <input className="form-control py-2" name="search" placeholder="Search by Order Id"
                            type = "number" onChange={this.handleChange} value={this.state.search}></input>
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
                    searchedOrders.length!==0 ? searchedOrders.map(order=>
                    <StudentOrder order={order} key={order.id}/>
                    )
                    :
                    <h2>{noOrderText}</h2>
                    
                }
            </div>
        </div>)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getStudentOrders: () => {dispatch(getOrders())}
    }
}

const mapStateToProps = state => {
    return {
        responseMessage:state.studentOrders.getResponseMessage,
        responseStatus:state.studentOrders.getResponseStatus,
        studentOrders: state.studentOrders.orders
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentOrders);