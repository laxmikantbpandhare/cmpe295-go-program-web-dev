import React, {Component} from 'react';
import '../../Common.css';
import EditAdminModal from './EditAdminModal';

class AdminDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            showEditAdminModal: false
        };
    }

    showEditAdminModal = e => {
        this.setState({showEditAdminModal: true});
    }
    
    hideEditAdminModal = e => {
        this.setState({showEditAdminModal: false});
    }
    
    render() {
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                    <div className="card d-flex flex-row">
                        <div className="card-body card-body-lesspad">
                            <h5 className="card-title font-weight-bold">{`${this.props.admin.fname} ${this.props.admin.lname}`}</h5>
                            <p className="card-text font-smaller"><strong>SJSU ID: </strong>{this.props.admin.id}</p>
                            <p className="card-text font-smaller"><strong>Email ID: </strong>{this.props.admin.email}</p>
                            <p className="card-text font-smaller"><strong>Status: </strong>{this.props.admin.status}</p>
                            <p className="card-text font-smaller"><strong>Created Date: </strong>
                                {new Date(this.props.admin.createdDate).toLocaleString()}
                            </p>
                            <p className="card-text font-smaller"><strong>Updated Date: </strong>
                                {new Date(this.props.admin.updatedDate).toLocaleString()}
                            </p>
                            <button type="button" className="btn btn-link view-details-color"
                            onClick = {this.showEditAdminModal}>
                                <i className="fas fa-edit"/> Edit
                            </button>
                        </div>
                    </div>
                </div>
                {this.state.showEditAdminModal ? 
                <EditAdminModal hideEditAdminModal={this.hideEditAdminModal}
                admin={this.props.admin}/> : null}
            </div>
        )
    }
}

export default AdminDetails;