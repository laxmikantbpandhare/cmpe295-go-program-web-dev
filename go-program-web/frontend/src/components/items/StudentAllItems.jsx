import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import '../../Common.css';
import './Items.css';
import {connect} from 'react-redux';
import {getItems} from '../../redux/actions/adminInventoryAction';
import StudentItem from './StudentItem';
import {backendUrl} from '../../config';

class StudentAllItems extends Component{
    constructor(props){
        super(props);
        this.state = {
            pointsAccumulated: 0,
            pointsUsed: 0,
            search: "",
            filter: ""
        }
    }

    componentDidMount(){
        this.props.getItems();
        if(localStorage.getItem('pointsUsed')){
            this.setState({
                pointsUsed: localStorage.getItem('pointsUsed'),
                pointsAccumulated: localStorage.getItem('pointsAccumulated')
            })
        } else {
            this.setState({
                pointsAccumulated: localStorage.getItem('pointsAccumulated')
            })
        }
    }
    
    render() {
        let redirectVar = null;
        if(localStorage.getItem('token')){

        }
        let noItemText = this.state.search !== "" || this.state.filter !== "" 
        ? "No Item Matching the Search or Filter Criteria"
        : "No Item in the Inventory";
        let pointsBalance = this.state.pointsAccumulated - this.state.pointsUsed;
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-award"></i> Claim Points</h4>
            </div>
            <div className="container-fluid items-below-heading">
                <div className="items-search-section">
                    <h4 className="text-center text-white all-items-heading p-1">All Items</h4>
                    <div className="row">
                        <div className="col-10 col-sm-6">
                            <input type="search" class="form-control" placeholder="Search by Item Name" />
                        </div>
                        <div className="col-2 col-sm-2">
                            <button className="btn btn-primary" style={{backgroundColor:"#0056a3"}}>
                                <i className="fas fa-search"></i>
                                <span className="d-none d-sm-inline"> Search</span>
                            </button>
                        </div>
                        <div className="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>
                        <div className="col-6 col-sm-2">
                            <select className="form-control" name="some">
                                <option selected>Filter by Tier</option>
                                <option>Tier 1(400-500 Points)</option>
                                <option>Tier 2(200-399 Points)</option>
                                <option>Tier 3(100-199 Points)</option>
                            </select>
                        </div>
                        <div className="col-6 col-sm-2">
                            <select className="form-control" name="some1">
                                <option selected>Filter by Category</option>
                            </select>
                        </div>
                    </div>
                    <hr/>
                </div>
                <h6 style= {{color:"red"}}>{this.props.itemsResponseMessage}</h6>
                <div className="row mt-2">
                {
                    this.props.items.length!==0 ? this.props.items.map((item,index)=>
                    <StudentItem item={item} key={index} pointsBalance = {pointsBalance}/>
                    )
                    :
                    <h2>{noItemText}</h2>
                }
                </div>
            </div>
        </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getItems: () => {dispatch(getItems())}
    }
}

const mapStateToProps = state => {
    return {
        itemsResponseMessage: state.inventory.getResponseMessage,
        items: state.inventory.items,
        categories: state.inventory.categories
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentAllItems);