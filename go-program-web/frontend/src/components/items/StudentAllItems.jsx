import React, {Component} from 'react';
import '../../Common.css';
import './Items.css';
import {connect} from 'react-redux';
import {getItems} from '../../redux/actions/adminInventoryAction';
import StudentItem from './StudentItem';

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
        const disabledSelectText = "Please note: Select button is disabled if you have insufficient points or if an item is not available.";
        
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

        let noItemText = this.state.search !== "" || this.state.pointFilter !== "" 
        ? "No Item Matching the Search or Filter Criteria"
        : "No Item in the Inventory";
        let pointsBalance = this.state.pointsAvailable - this.state.pointsUsed;
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-award"></i> Redeem</h4>
            </div>
            <div className="container-fluid below-heading">
                <div className="entities-search-section">
                    <h4 className="text-center text-white all-entity-heading p-1">All Items</h4>
                    <div className="row">
                        <div  className="col-6 col-sm-2 order-sm-2">
                            <select className="form-control" name="pointFilter" onChange={this.handleChange}
                             value={this.state.pointFilter}>
                                <option value="">Filter by Points</option>
                                <option>0-20 Points</option>
                                <option>21-50 Points</option>
                                <option>51-80 Points</option>
                                <option>81-100 Points</option>
                                <option>101-150 Points</option>
                                <option>151-200 Points</option>
                                <option>200+ Points</option>
                            </select>
                        </div>

                        <div  className="col-6 col-sm-2 order-sm-3">
                            <select className="form-control" name="categoryFilter" onChange={this.handleChange}
                             value={this.state.categoryFilter}>
                                <option value="">Filter by Category</option>
                                {
                                    this.props.categories.length!==0
                                    ? this.props.categories.map((category, idx) => <option key={idx}>{category}</option>)
                                    : null
                                }
                            </select>
                        </div>

                        <div className="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>

                        <div  className="col-6 col-sm-2 order-sm-3">
                            <select className="form-control" name="sort" onChange={this.handleChange}
                             value={this.state.sort}>
                                <option value="">Sort by Points</option>
                                <option>Ascending</option>
                                <option>Descending</option>
                            </select>
                        </div>                        

                        <div className="w-100 d-block d-sm-none mt-2 mt-sm-0"></div>
                        
                        <div className="input-group col-10 col-sm-4 order-sm-1">
                            <div className="input-group-prepend">
                                <div className="input-group-text"><i className="fas fa-search"></i></div>
                            </div>
                            <input className="form-control py-2" name="search" placeholder="Search by Item Name"
                            onChange={this.handleChange} value={this.state.search}></input>
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
                <h6 style= {{fontStyle:"Italic"}}>{disabledSelectText}</h6>
                
                <div className="row mt-2">
                {
                    filteredItems.length!==0 ? filteredItems.map(item=>
                    <StudentItem item={item} key={item._id} pointsBalance = {pointsBalance}/>
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
        responseMessage: state.inventory.getResponseMessage,
        responseStatus: state.inventory.getResponseStatus,
        items: state.inventory.items,
        categories: state.inventory.categories
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentAllItems);