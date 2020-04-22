import React, {Component} from 'react';
// import {Link} from 'react-router-dom';
// import {Redirect} from 'react-router';
import collegeLogo from '../../images/coe_logo.png';
import '../../Common.css';
import './Items.css';
import queryString from 'query-string';

class StudentItemDetails extends Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    componentDidMount(){
        console.log("test",this.props)
        const {id} = queryString.parse(this.props.location.search);
        console.log(id)
    }
    
    render() {
        let redirectVar = null;
        if(localStorage.getItem('token')){

        }
        return(
        <div className="top-align">
            <div className="heading py-1">
                <h4 className="font-weight-bold">&nbsp;&nbsp;<i className="fas fa-award"></i> Claim Points</h4>
                </div>
                <div className="container-fluid items-below-heading">
                    <div className="items-search-section">  {/*This class will support the sticky subheading */}
                        <h4 className="text-center text-white all-items-heading p-1">Item Details</h4>
                    </div>
                    <h3>SONORO KATE Bed Sheets Set Sheets Microfiber Super Soft 1800 Thread Count Luxury Egyptian Sheets 16-Inch Deep Pocket Wrinkle Fade and Hypoallergenic - 4 Piece (Twin, Grey)</h3>
                    <div className="row">
                        <div className="col-sm-4 d-flex align-items-center justify-content-center">
                            <img src={collegeLogo} alt="" className="item-details-image img-fluid"/>
                        </div>
                        <div className="col-sm-6 my-auto">
                            <p className="h6">Points: 600</p>
                            <p className="h6">Select a Size:</p>
                            <div className="row" style={{margin:'0'}}><button type="button" class="btn btn-outline-dark mr-1">XS</button>
                            {/* {
                                this.props.item.attributes.filter(attribute=> attribute.size > 0)
                                .map(attribute => <button type="button" class="btn btn-outline-dark mr-1">{attribute.size}</button>)
                            } */}
                            <button type="button" class="btn btn-outline-dark mr-1">S</button>
                            <button type="button" class="btn btn-outline-dark mr-1">M</button>
                            <button type="button" class="btn btn-outline-dark mr-1">L</button>
                            <button type="button" class="btn btn-outline-dark mr-1">XL</button>
                            <button type="button" class="btn btn-outline-dark mr-1">XXL</button>
                        </div>
                        {/* <p className="h6 mt-2">Select a Color:</p>
                        <div className="row" style={{margin:'0'}}>
                            <button type="button" class="btn btn-outline-dark mr-1">Black</button>
                            <button type="button" class="btn btn-outline-dark mr-1">White</button>
                            <button type="button" class="btn btn-outline-dark mr-1">Red</button>
                            <button type="button" class="btn btn-outline-dark mr-1">Red</button>
                        </div> */}
                        <button type="button" class="btn btn-primary btn-style mt-2">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default StudentItemDetails;