import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../../Common.css';
import './Items.css'
import AdminItem from './AdminItem';
import AdminNewItemModal from './AdminNewItemModal';
import {connect} from 'react-redux';
import {getItems} from '../../redux/actions/adminInventoryAction';

class AdminInventory extends Component{
    constructor(props){
        super(props);
        this.state = {
            showAdminNewItemModal: false,
            search: "",
            filter: "",
            sort: ""
        };
    }
    
    componentDidMount(){
        this.props.getItems();
    }

    showAdminNewItemModal = e => {
        this.setState({showAdminNewItemModal: true});
    }
    
    hideAdminNewItemModal = e => {
        this.setState({showAdminNewItemModal: false});
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
    
    render() {
        let sortedItems = [...this.props.items];
        
        if(this.state.sort !== ""){
            this.state.sort === "Ascending" 
            ? sortedItems.sort((item1, item2) => item1.points - item2.points)
            : sortedItems.sort((item1, item2) => item2.points - item1.points);
        }

        let filteredItems = sortedItems.filter(item => {
            return (item.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 &&
            item.category.indexOf(this.state.filter)!==-1)
        });
         
        let noItemText = this.state.search !== "" || this.state.filter !== "" 
        ? "No Item Matching the Search or Filter Criteria"
        : "No Item in the Inventory";
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-boxes"></i> Inventory</h4>
            </div>
            
            <div className="container-fluid below-heading">
                <div class="row">
                    <div class="col-sm-4 offset-4 offset-sm-5 mt-2">
                        <button className="btn btn-primary btn-style font-weight-bold" onClick = {this.showAdminNewItemModal}>
                            <i class="fas fa-plus"></i> &nbsp;Add Item
                        </button>
                    </div>
                </div>
                <div className="entities-search-section">
                    <h4 className="text-center text-white all-entity-heading p-1 mt-2">All Items</h4>
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
                                <option selected value="">Sort by Points</option>
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
                <div className={`status-msg ${this.props.responseStatus}`}>
                    {this.props.responseMessage}
                </div>
                {
                    filteredItems.length!==0 ? filteredItems.map(item=>
                    <AdminItem item={item} key={item._id}/>
                    )
                    :
                    <h2>{noItemText}</h2>
                    
                }
            </div>
            {this.state.showAdminNewItemModal ? 
            <AdminNewItemModal hideAdminNewItemModal={this.hideAdminNewItemModal}/> : null}
        </div>)
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
        responseStatus: state.inventory.getResponseStatus,
        items: state.inventory.items,
        categories: state.inventory.categories
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminInventory);