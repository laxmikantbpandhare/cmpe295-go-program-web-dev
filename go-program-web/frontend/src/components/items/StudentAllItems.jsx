import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import collegeLogo from '../../images/coe_logo.png';
import '../../Common.css';
import './Items.css'
import {connect} from 'react-redux';
import {getItems} from '../../redux/actions/adminInventoryAction';
import AdminItem from '../items/AdminItem';

class StudentAllItems extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: "",
            filter: "",
            sort: "",
            divide:""
        }
    }
    

    componentDidMount(){
        console.log("In Componenent DID Mount");
        this.props.getItems();
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


    render() {

        let redirectVar = null;
        if(localStorage.getItem('token')){
            redirectVar = <Redirect to= "/login"/>
        }

        this.state.divide = Math.floor(this.props.items.length/2);
        let sortedItems = [...this.props.items];

        let view = null;
        let view1 = null;
        if(this.props.items.length === 1 ){
            console.log("only one 1")
            view = this.props.items.map(item => {
                    return (
                        <div className="col-sm-6 my-1">
                        <div className="card d-flex flex-row">
                            <img src={item.images[0]} className="img-fluid items-card-image align-self-center" alt="..."/>
                            <div className="card-body">
                                <h6 className="card-title font-weight-bold">{item.name}</h6>
                                <h6 className="card-text">Tier 3</h6>
                                <h6 className="card-text">{item.points} Points</h6>
                                <button type="button" className="btn btn-primary btn-style">Select</button>
                            </div>
                        </div>
                    </div>
                    )
            })
        }
        else{
            console.log("More than 2")
            if(this.props.items.length%2 === 0){
                this.state.divide = this.state.divide - 1;
            }
            view = this.props.items.slice(0,this.state.divide).map(item => {
                return  (
                    <div className="col-sm-6 my-1">
                    <div className="card d-flex flex-row">
                        <img src={item.images[0]}  className="img-fluid items-card-image align-self-center" alt="..."/>
                        <div className="card-body">
                            <h6 className="card-title font-weight-bold">{item.name}</h6>
                            <h6 className="card-text">Tier 3</h6>
                            <h6 className="card-text">{item.points} Points</h6>
                            <button type="button" className="btn btn-primary btn-style">Select</button>
                        </div>
                    </div>
                </div>
                )
            })

            view1 = this.props.items.slice(this.state.divide,this.props.items.length).map(item => {
                return  (
                    <div className="col-sm-6 my-1">
                    <div className="card d-flex flex-row">
                        <img src={item.images[0]}  className="img-fluid items-card-image align-self-center" alt="..."/>
                        <div className="card-body">
                            <h6 className="card-title font-weight-bold">{item.name}</h6>
                            <h6 className="card-text">Tier 2</h6>
                            <h6 className="card-text">{item.points} Points</h6>
                            <button type="button" className="btn btn-primary btn-style">Select</button>
                        </div>
                    </div>
                </div>
                )
            })
        }
        let noItemText = this.state.search !== "" || this.state.filter !== "" 
        ? "No Item  Matching the Search or Filter Criteria"
        : "No Item in the Inventory";

        let filteredItems = sortedItems.filter(item => {
            return (item.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 &&
            item.category.indexOf(this.state.filter)!==-1)
        });

        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-award"></i> Claim Prizes</h4>
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
                                {
                                    this.props.categories.length!==0
                                    ? this.props.categories.map(category => <option>{category}</option>)
                                    : null
                                }
                            </select>
                        </div>
                    </div>
                    <hr/>
                </div>
                <div className="row mt-2">
                    {/* <div className="col-sm-6 my-1">
                        <div className="card d-flex flex-row">
                            <img src={collegeLogo} className="img-fluid items-card-image align-self-center" alt="..."/>
                            <div className="card-body">
                                <h6 className="card-title font-weight-bold">Shirt</h6>
                                <h6 className="card-text">Tier 3</h6>
                                <h6 className="card-text">{this.props.items.points} Points</h6>
                                   <button type="button" className="btn btn-primary btn-style">Select</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 my-1">
                        <div className="card d-flex flex-row">
                            <img src={collegeLogo} className="img-fluid items-card-image align-self-center" alt="..."/>
                            <div className="card-body">
                                <h6 className="card-title font-weight-bold">Shirt</h6>
                                <h6 className="card-text">Tier 2</h6>
                                  <h6 className="card-text">{this.props.items.points} Points</h6>
                                <button type="button" className="btn btn-primary btn-style">Select</button>
                            </div>
                        </div>
                    </div> */}
                    {view}
                    {view1}
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
        responseMessage: state.inventory.getResponseMessage,
        items: state.inventory.items,
        categories: state.inventory.categories
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentAllItems);