import React, {Component} from 'react';
import '../../Common.css';
import './Orders.css'
import CommentsModal from '../comments/CommentsModal';


class StudentOrder extends Component{
    constructor(props){
        super(props);
        this.state = {
            showCommentsModal: false
        };
    }

    showCommentsModal = e => {
        this.setState({showCommentsModal: true});
    }
    
    hideCommentsModal = e => {
        this.setState({showCommentsModal: false});
    }
    
    render() {
        const { photoIndex, isOpen } = this.state;
        const updateEnabled = this.state.initialStatus === this.props.event.status ? false : true;
        // var isLongDesc = false;
        // let trimmedDescription = this.props.event.description.split('\n')[0];
        // if(trimmedDescription.length> 25 || this.props.event.description.split('\n').length>1){
        //     isLongDesc = true;
        // }
        // trimmedDescription = trimmedDescription.length > 25 
        //                             ? trimmedDescription.substring(0,25)
        //                             : trimmedDescription;
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                {/* <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6> */}
                {
                    this.props.event._id === this.props.updatedEvent
                    ? <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6>
                    : null
                }
                    <div className="card d-flex flex-row">
                        {/* <img src={this.props.event.images[0]} className="img-fluid events-card-image m-1" alt="..."/> */}
                        <div className="card-body card-body-lesspad">
                            <h5 className="card-title font-weight-bold">{`${this.props.event.student.fname} ${this.props.event.student.lname}`}</h5>
                            <p className="card-text"><strong>SJSU ID: </strong>{this.props.event.student.sjsuId}</p>
                            {/* <p className="card-text"><strong>Major: </strong>{this.props.event.student.major}</p>
                            <p className="card-text"><strong>Year: </strong>{this.props.event.student.year}</p> */}
                            <p className="card-text"><strong>Event: </strong>{this.props.event.event.name}</p>
                            {/* <p className="card-text" style={{whiteSpace:'pre-wrap', color:'red'}}>{trimmedDescription}</p> */}
                            {/* {
                                isLongDesc
                                ? <p className="card-text text-pre-wrap"><strong>Description: </strong>
                                    {this.state.isMore ? this.props.event.description : `${trimmedDescription} ...`}
                                    <button type="button" className="btn btn-link view-details-color"
                                        onClick = {this.toggleMore}>
                                        {this.state.isMore ? 'Read Less' : 'Read More'}</button>
                                </p>
                                : <p className="card-text"><strong>Description: </strong>{this.props.event.description}</p>
                            } */}
                            <p className="card-text"><strong>Points: </strong>{this.props.event.event.points}</p>
                            {/* <p className="card-text"><strong>Completed Date: </strong>
                                {new Date(this.props.event.completedDate).toLocaleDateString()}
                            </p> */}
                            <p className="card-text"><strong>Submitted Date: </strong>
                                {new Date(this.props.event.createdDate).toLocaleString()}
                            </p>
                            {/* <p className="card-text"><strong>Status: </strong>{this.props.event.status}</p> */}
                            {
                                this.state.initialStatus === "Approved" 
                                ? <p className="card-text"><strong>Status: </strong>{this.props.event.status}</p>
                                : <div class="row">
                                <div className="col-sm-3 col-6">
                                    <select className="form-control-sm"
                                    name="status" onChange={this.handleSelectChange}>
                                        {/* <option selected value="">Select an Event</option> */}
                                        {
                                            this.options.map( option => {
                                                if(option === this.props.event.status){
                                                    return <option selected>{option}</option> ;
                                                } else {
                                                    return <option>{option}</option> ;
                                                }
                                            }
                                            )}
                                    </select>
                                </div>
                                <div className="col-sm-3 col-6">
                                    <button className="btn btn-primary btn-sm" style={{backgroundColor:"#0056a3"}}
                                        onClick={this.handleUpdate} disabled = {!updateEnabled}>
                                        Update Status</button>
                                </div>
                            </div>
                            }
                            {/* <div class="row">
                                <div className="col-sm-3 col-6">
                                    <select className="form-control-sm"
                                    name="status" onChange={this.handleSelectChange}>
                                        {
                                            this.options.map( option => {
                                                if(option === this.props.event.status){
                                                    return <option selected>{option}</option> ;
                                                } else {
                                                    return <option>{option}</option> ;
                                                }
                                            }
                                            )}
                                    </select>
                                </div>
                                <div className="col-sm-3 col-6">
                                    <button className="btn btn-primary btn-sm" style={{backgroundColor:"#0056a3"}}
                                        onClick={this.handleUpdate} disabled = {!updateEnabled}>
                                        Update Status</button>
                                </div>
                            </div> */}
                            <div className="d-flex flex-row">
                                <button type="button" className="btn btn-link view-details-color"
                                onClick={() => this.setState({ isOpen: true })}>
                                    <i class="fas fa-search-plus"/> View Images
                                </button>
                                <button type="button" className="btn btn-link view-details-color"
                                onClick = {this.showViewEventRequestModal}>
                                    <i className="fas fa-eye"/> View Details
                                </button>
                                {/* <button type="button" className="btn btn-link delete-color"
                                onClick = {this.handleDelete}>
                                    <i className="fas fa-trash-alt"/> Delete
                                </button> */}
                                <button type="button" className="btn btn-link view-details-color"
                                onClick = {this.showCommentsModal}>
                                    <i className="fas fa-comment"/> Comments
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {isOpen && (
                <Lightbox
                    mainSrc={this.props.event.images[photoIndex]}
                    nextSrc={this.props.event.images[(photoIndex + 1) % this.props.event.images.length]}
                    prevSrc={this.props.event.images[(photoIndex + this.props.event.images.length - 1) % this.props.event.images]}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                    onMovePrevRequest={() =>
                    this.setState({
                        photoIndex: (photoIndex + this.props.event.images.length - 1) % this.props.event.images.length,
                    })
                    }
                    onMoveNextRequest={() =>
                    this.setState({
                        photoIndex: (photoIndex + 1) % this.props.event.images.length,
                    })
                    }
                />
                )}
                {this.state.showViewEventRequestModal ? 
                <ViewEventRequestModal hideViewEventRequestModal={this.hideViewEventRequestModal}
                event={this.props.event}/> : null}
                
                {this.state.showCommentsModal ? 
                <CommentsModal hideCommentsModal={this.hideCommentsModal}
                id={this.props.event._id} comments={this.props.event.comments}
                commenter="Admin" type="Event"/> : null}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        handleSelectChange: (id, value) => {dispatch(eventSelectChangeHandler(id, value))},
        handleUpdate: data => dispatch(updateEventStatus(data))
    }
}

const mapStateToProps = state => {
    return {
        responseMessage: state.eventsRequests.updateResponseMessage,
        updatedEvent: state.eventsRequests.updatedEvent
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentOrder);