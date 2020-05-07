import React from 'react';
import '../../Common.css';
import './Requests.css'

const ViewEventRequestModal = (props) => {

    var updatedDate = null;
    var updatedBy = null;
    if(props.event.updatedBy){
        updatedDate = (
            <div class="row">
                <label className="col-3"><strong>Last Updated By</strong></label>
                <div className="col-9">
                    <p className="text-pre-wrap">{props.event.updatedBy}</p>
                </div>
            </div>
        );
        updatedBy = (
            <div class="row">
                <label className="col-3"><strong>Updated</strong></label>
                <div className="col-9">
                    <p className="text-pre-wrap">{new Date(props.event.updatedDate).toLocaleString()}</p>
                </div>
            </div>
        );
    }
    
    const hideModal = e => {
        props.hideViewEventRequestModal();
    }
    
    return(
        <div>
            <div className="modal">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="eventModal">
                            View Event Request
                            </h5>
                        </div>
                            <div className="modal-body">
                                <h5 style = {{textDecoration:'underline'}}>Student Details</h5>  
                                <div class="row">
                                    <label className="col-3"><strong>Name</strong></label>
                                    <div className="col-9">
                                        <p>{`${props.event.student.fname} ${props.event.student.lname}`}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <label className="col-3"><strong>SJSU ID</strong></label>
                                    <div className="col-9">
                                        <p>{props.event.student.sjsuId}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <label className="col-3"><strong>Email ID</strong></label>
                                    <div className="col-9">
                                        <p>{props.event.student.email}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <label className="col-3"><strong>Major</strong></label>
                                    <div className="col-9">
                                        <p>{props.event.student.major}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <label className="col-3"><strong>Year</strong></label>
                                    <div className="col-9">
                                        <p>{props.event.student.year}</p>
                                    </div>
                                </div>
                                <h5 style = {{textDecoration:'underline'}}>Request Details</h5>
                                <div class="row">
                                    <label className="col-3"><strong>Event</strong></label>
                                    <div className="col-9">
                                        <p>{props.event.event.name}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <label className="col-3"><strong>Description</strong></label>
                                    <div className="col-9">
                                        <p className="text-pre-wrap">{props.event.description}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <label className="col-3"><strong>Points</strong></label>
                                    <div className="col-9">
                                        <p className="text-pre-wrap">{props.event.event.points}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <label className="col-3"><strong>Status</strong></label>
                                    <div className="col-9">
                                        <p className="text-pre-wrap">{props.event.status}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <label className="col-3"><strong>Completed</strong></label>
                                    <div className="col-9">
                                        <p className="text-pre-wrap">{new Date(props.event.completedDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <label className="col-3"><strong>Submitted</strong></label>
                                    <div className="col-9">
                                        <p className="text-pre-wrap">{new Date(props.event.createdDate).toLocaleString()}</p>
                                    </div>
                                </div>
                                {updatedBy}
                                {updatedDate}
                                {/* {
                                    props.event.updatedBy 
                                    ? <div class="row">
                                        <label className="col-3"><strong>Updated</strong></label>
                                        <div className="col-9">
                                            <p className="text-pre-wrap">{new Date(props.event.updatedDate).toLocaleString()}</p>
                                        </div>
                                    </div>

                                } */}
                                
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

export default ViewEventRequestModal;