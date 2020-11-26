import React, {Component} from 'react';
import '../../Common.css';
import {connect} from 'react-redux';
import {getAllOrders} from '../../redux/actions/ordersRequestsAction';
import OrderRequest from './OrderRequest';

class AllOrderRequests extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchOrderId: "",
            searchStudentId: "",
            filter: "",
            sort: ""
        };
    }

    componentDidMount(){
        this.props.getAllOrders();
    }

    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    resetSearchSection = e => {
        this.setState(
            {
                searchOrderId: "",
                searchStudentId: "",
                filter: "",
                sort: ""
            }
        );   
    }

    statusOptions = ['Submitted', 'Pending Delivery', 'Delivered', 'Cancelled'];
    
    render() {
        let sortedOrders = [...this.props.orders];
        if(this.state.sort !== ""){
            if(this.state.sort === "Created Date Ascending"){
                sortedOrders.sort((order1, order2) => new Date(order1.createdDate) - new Date(order2.createdDate));
            } else {
                sortedOrders.sort((order1, order2) => new Date(order2.createdDate) - new Date(order1.createdDate));
            }
        }

        let searchedOrdersById = this.state.searchOrderId !== ""
        ? sortedOrders.filter(order => order.id === parseInt(this.state.searchOrderId))
        : [...sortedOrders];

        let filteredOrders = searchedOrdersById.filter(order => {
            return (order.student.sjsuId.toLowerCase().indexOf(this.state.searchStudentId.toLowerCase()) !== -1 &&
            order.status.indexOf(this.state.filter)!==-1)
        });
        
        let noOrderText = this.state.searchOrderId !== "" || this.state.searchStudentId !== "" || this.state.filter !== ""
        ? "No Order Matching the Search or Filter Criteria"
        : "No Order is submitted yet by any student.";
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-receipt"></i> Students Orders</h4>
            </div>
            
            <div className="container-fluid below-heading">
                <div className="entities-search-section">
                    <h4 className="text-center text-white all-entity-heading p-1 mt-2">All Submitted Events</h4>
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
                                <option>Created Date Ascending</option>
                                <option>Created Date Descending</option>
                            </select>
                        </div>

                        <div class="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>

                        <div className="input-group col-12 col-sm-3 order-sm-2">
                            <div class="input-group-prepend">
                                <div className="input-group-text"><i className="fas fa-search"></i></div>
                            </div>
                            <input type = "number"  className="form-control py-2" name="searchStudentId" placeholder="Search by Student Id"
                            onChange={this.handleChange} value={this.state.searchStudentId}></input>
                        </div>

                        <div class="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>

                        <div className="input-group col-10 col-sm-3 order-sm-1">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fas fa-search"></i></div>
                            </div>
                            <input type = "number" className="form-control py-2" name="searchOrderId" placeholder="Search by Order Id"
                            onChange={this.handleChange} value={this.state.searchOrderId}></input>
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
                    filteredOrders.length!==0 ? filteredOrders.map(order=>
                    <OrderRequest order={order} key={order.id}/>
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
        getAllOrders: () => {dispatch(getAllOrders())}
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.ordersRequests.getResponseMessage,
        responseStatus: state.ordersRequests.getResponseStatus,
        orders: state.ordersRequests.orders
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllOrderRequests);