import React, {Component} from 'react';
// import {Link} from 'react-router-dom';
// import {Redirect} from 'react-router';
// import collegeLogo from '../../images/coe_logo.png';
import '../../Common.css';
import './Items.css'
import {connect} from 'react-redux';
import {getItems} from '../../redux/actions/adminInventoryAction';
// import { confirmAlert } from 'react-confirm-alert';
// import AdminItem from '../items/AdminItem';

class StudentAllItems extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: "",
            filter: "",
            sort: "",
            divide:""
        };
        this.handleChange = this.handleChange.bind(this);
    }
    

    componentDidMount(){
        // console.log("In Componenent DID Mount");
        this.props.getItems();
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

    handleSelect = (item) => {
        console.log("Verify data here",item)
        this.props.history.push(`/student/item-details/?id=${item._id}`);
    }


    render() {

        // let redirectVar = null;
        // if(localStorage.getItem('token')){
        //     redirectVar = <Redirect to= "/login"/>
        // }

        // this.state.divide = Math.floor(this.props.items.length/2);
        // let sortedItems = [...this.props.items];

        let view = null;

        view = this.props.items.map(item => {

            return  (
                <div className="col-sm-6 my-1">
                <div className="card d-flex flex-row">
                    <img src={item.images[0]}  className="img-fluid items-card-image align-self-center" alt="..."/>
                    <div className="card-body">     
                        <h6 className="card-title font-weight-bold">{item.name}</h6>
                        <h6 className="card-text">Tier 3</h6>
                        <h6 className="card-text">{item.points} Points</h6>
                        <button type="button" className="btn btn-primary btn-style" 
                                onClick={() => this.handleSelect(item)}>Select</button>
                    </div>
                </div>
            </div>
            )
        })

        // let noItemText = this.state.search !== "" || this.state.filter !== "" 
        // ? "No Item  Matching the Search or Filter Criteria"
        // : "No Item in the Inventory";

        // let filteredItems = sortedItems.filter(item => {
        //     return (item.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 &&
        //     item.category.indexOf(this.state.filter)!==-1)
        // });

        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-award"></i> Claim Prizes</h4>
            </div>
            <div className="container-fluid items-below-heading">
                <div className="items-search-section">
                    <h4 className="text-center text-white all-items-heading p-1">All Items</h4>
                    <div className="row">

                    <div  class="col-6 col-sm-2 order-sm-2">
                            <select className="form-control" name="filter" onChange={this.handleChange}
                             value={this.state.filter}>
                                <option selected value="">Filter by Category</option>
                                {
                                    this.props.categories.length!==0
                                    ? this.props.categories.map(category => <option>{category}</option>)
                                    : null
                                }
                            </select>
                        </div>

                        <div  class="col-6 col-sm-2 order-sm-3">
                            <select className="form-control" name="sort" onChange={this.handleChange}
                             value={this.state.sort}>
                                <option selected>Filter by Tier</option>
                                <option>Ascending</option>
                                <option>Descending</option>
                            </select>
                        </div>

                        <div class="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>
                        
                        <div className="input-group col-10 col-sm-6 order-sm-1">
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
                <div className="row mt-2">
                    {view}
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