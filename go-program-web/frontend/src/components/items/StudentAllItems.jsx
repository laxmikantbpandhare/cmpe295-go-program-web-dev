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
            pointsAvailable: 0,
            pointsUsed: 0,
            search: "",
            categoryFilter: "",
            pointFilter: "",
            sort: ""
        }
    }

    componentDidMount(){
        this.props.getItems();
        let pointsAvailable = localStorage.getItem('pointsAccumulated') - localStorage.getItem('pointsSpent');
        if(localStorage.getItem('pointsUsed')){
            this.setState({
                pointsUsed: localStorage.getItem('pointsUsed'),
                pointsAvailable
            })
        } else {
            this.setState({
                pointsAvailable
            })
        }
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
                pointFilter: "",
                categoryFilter: "",
                sort: ""
            }
        );   
    }
    
    render() {
        let redirectVar = null;
        if(!localStorage.getItem('token')){
            redirectVar = <Redirect to= "/login"/>
        }
        let sortedItems = [...this.props.items];
        
        if(this.state.sort !== ""){
            this.state.sort === "Ascending" 
            ? sortedItems.sort((item1, item2) => item1.points - item2.points)
            : sortedItems.sort((item1, item2) => item2.points - item1.points);
        }

        let pointsFilteredItems = [...sortedItems];

        if(this.state.pointFilter !== ""){
            if(this.state.pointFilter === "0-20 Points"){
                pointsFilteredItems = pointsFilteredItems.filter(item=> item.points < 21);
            } else if(this.state.pointFilter === "21-50 Points"){
                pointsFilteredItems = pointsFilteredItems.filter(item=> item.points > 20 && item.points < 51);
            } else if(this.state.pointFilter === "51-80 Points"){
                pointsFilteredItems = pointsFilteredItems.filter(item=> item.points > 50 && item.points < 81);
            } else if(this.state.pointFilter === "81-100 Points"){
                pointsFilteredItems = pointsFilteredItems.filter(item=> item.points > 80 && item.points < 101);
            } else if(this.state.pointFilter === "101-150 Points"){
                pointsFilteredItems = pointsFilteredItems.filter(item=> item.points > 100 && item.points < 151);
            } else if(this.state.pointFilter === "151-200 Points"){
                pointsFilteredItems = pointsFilteredItems.filter(item=> item.points > 150 && item.points < 201);
            } else{
                pointsFilteredItems = pointsFilteredItems.filter(item=> item.points > 200);
            }
        }

        let filteredItems = pointsFilteredItems.filter(item => {
            return (item.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 &&
            item.category.indexOf(this.state.categoryFilter)!==-1)
        });

        let noItemText = this.state.search !== "" || this.state.filter !== "" 
        ? "No Item Matching the Search or Filter Criteria"
        : "No Item in the Inventory";
        let pointsBalance = this.state.pointsAvailable - this.state.pointsUsed;
        return(
        <div className="top-align">
            {redirectVar}
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-award"></i> Redeem</h4>
            </div>
            <div className="container-fluid items-below-heading">
                <div className="items-search-section">
                    <h4 className="text-center text-white all-items-heading p-1">All Items</h4>
                    <div className="row">
                        <div  class="col-6 col-sm-2 order-sm-2">
                            <select className="form-control" name="pointFilter" onChange={this.handleChange}
                             value={this.state.pointFilter}>
                                <option selected value="">Filter by Points</option>
                                <option>0-20 Points</option>
                                <option>21-50 Points</option>
                                <option>51-80 Points</option>
                                <option>81-100 Points</option>
                                <option>101-150 Points</option>
                                <option>151-200 Points</option>
                                <option>200+ Points</option>
                            </select>
                        </div>

                        <div  class="col-6 col-sm-2 order-sm-3">
                            <select className="form-control" name="categoryFilter" onChange={this.handleChange}
                             value={this.state.categoryFilter}>
                                <option selected value="">Filter by Category</option>
                                {
                                    this.props.categories.length!==0
                                    ? this.props.categories.map(category => <option>{category}</option>)
                                    : null
                                }
                            </select>
                        </div>

                        <div class="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>

                        <div  class="col-6 col-sm-2 order-sm-3">
                            <select className="form-control" name="sort" onChange={this.handleChange}
                             value={this.state.sort}>
                                <option selected value="">Sort by Points</option>
                                <option>Ascending</option>
                                <option>Descending</option>
                            </select>
                        </div>                        

                        <div class="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>
                        
                        <div className="input-group col-10 col-sm-4 order-sm-1">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fas fa-search"></i></div>
                            </div>
                            <input class="form-control py-2" name="search" placeholder="Search by Item Name"
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
                <h6 style= {{color:"red"}}>{this.props.itemsResponseMessage}</h6>
                <div className="row mt-2">
                {
                    filteredItems.length!==0 ? filteredItems.map((item,index)=>
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