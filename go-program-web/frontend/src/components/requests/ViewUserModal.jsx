import React from 'react';
import '../../Common.css';
import './Requests.css'

const ViewUserModal = (props) => {

    var updatedDate = null;
    var updatedBy = null;
    if(props.student.user.updatedBy){
        updatedDate = (
            <div class="row">
                <label className="col-3"><strong>Last Updated By</strong></label>
                <div className="col-9">
                    <p className="text-pre-wrap">{props.student.user.updatedBy}</p>
                </div>
            </div>
        );
        updatedBy = (
            <div class="row">
                <label className="col-3"><strong>Updated</strong></label>
                <div className="col-9">
                    <p className="text-pre-wrap">{new Date(props.student.user.updatedDate).toLocaleString()}</p>
                </div>
            </div>
        );
    }
    
    const hideModal = e => {
        props.hideViewUserModal();
    }
    
    return(
        <div>
            <div className="modal">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="userModal">
                            View Student
                            </h5>
                        </div>
                            <div className="modal-body">
                                <h5 style = {{textDecoration:'underline'}}>Student Details</h5>  
                                <div class="row">
                                    <label className="col-3"><strong>Name</strong></label>
                                    <div className="col-9">
                                        <p>{`${props.student.user.fname} ${props.student.user.lname}`}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <label className="col-3"><strong>SJSU ID</strong></label>
                                    <div className="col-9">
                                        <p>{props.student.sjsuId}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <label className="col-3"><strong>Email ID</strong></label>
                                    <div className="col-9">
                                        <p>{props.student.user.email}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <label className="col-3"><strong>Major</strong></label>
                                    <div className="col-9">
                                        <p>{props.student.major}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <label className="col-3"><strong>Year</strong></label>
                                    <div className="col-9">
                                        <p>{props.student.year}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <label className="col-3"><strong>Created</strong></label>
                                    <div className="col-9">
                                        <p className="text-pre-wrap">{new Date(props.student.user.createdDate).toLocaleString()}</p>
                                    </div>
                                </div>
                                {updatedBy}
                                {updatedDate}
                        </div>
                        <div className="modal-footer">
                                <button onClick = {hideModal} className="btn btn-primary btn-style" 
                                data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewUserModal;