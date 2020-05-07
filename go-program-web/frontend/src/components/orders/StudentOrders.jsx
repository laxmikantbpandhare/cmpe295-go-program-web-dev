import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import '../../Common.css';
import './Orders.css'
import {connect} from 'react-redux';
import {getOrders} from '../../redux/actions/studentOrdersAction';
import StudentOrder from './StudentOrder';

class StudentOrders extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: ""
        };
    }

    componentDidMount(){
        this.props.getStudentOrders();
    }
    
    render() {
        let redirectVar = null;
        if(!localStorage.getItem('token')){
            redirectVar = <Redirect to= "/login"/>
        }
        
        let noOrderText = this.state.search !== ""
        ? "No Order Matching the Search or Filter Criteria"
        : "No Order is submitted yet by you.";
        return(
        <div className="top-align">
            {redirectVar}
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-receipt"></i> Orders</h4>
            </div>
            
            <div className="container-fluid orders-below-heading">
                <div className="orders-search-section">
                    <h4 className="text-center text-white your-orders-heading p-1 mt-2">Your Orders</h4>
                    <div className="row">
                        <div class="col-10 col-sm-6">
                            <input type="search" class="form-control" placeholder="Search by Order Number" />
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
                <h6 style= {{color:"red"}}>{this.props.studentResponseMessage}</h6>
                {
                    this.props.studentOrders.length!==0 ? this.props.studentOrders.map((order,index)=>
                    <StudentOrder order={order} key={index}/>
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
        studentResponseMessage:state.studentOrders.getResponseMessage,
        studentOrders: state.studentOrders.orders
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentOrders);