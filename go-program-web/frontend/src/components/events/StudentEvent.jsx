import React, {Component} from 'react';
import '../../Common.css';
import './Events.css'
import AdminViewEventModal from './AdminViewEventModal';
import Lightbox from 'react-image-lightbox';
// import {connect} from 'react-redux';
// import {deleteEvent} from '../../redux/actions/adminEventsAction';

class StudentEvent extends Component{
    constructor(props){
        super(props);
        this.state = {
            showAdminViewEventModal: false,
            photoIndex: 0,
            isOpen: false,
            isMore: false
        };
    }

    showAdminViewEventModal = e => {
        this.setState({showAdminViewEventModal: true});
    }
    
    hideAdminViewEventModal = e => {
        this.setState({showAdminViewEventModal: false});
    }

    // handleDelete = () => {
    //     confirmAlert({
    //         title: 'Delete Event',
    //         message: 'Are you sure you want to delete this Event?',
    //         buttons: [
    //           {
    //             label: 'Yes',
    //             onClick: () => {this.props.deleteEvent(this.props.event._id);}
    //           },
    //           {
    //             label: 'No',
    //             onClick: () => {}
    //           }
    //         ]
    //       });
    // }

    toggleMore = () => {
        this.setState({ isMore: !this.state.isMore });
    }
    
    render() {
        const { photoIndex, isOpen } = this.state;
        var isLongDesc = false;
        let trimmedDescription = this.props.event.description.split('\n')[0];
        if(trimmedDescription.length> 25 || this.props.event.description.split('\n').length>1){
            isLongDesc = true;
        }
        trimmedDescription = trimmedDescription.length > 25 
                                    ? trimmedDescription.substring(0,25)
                                    : trimmedDescription;
        return(
            <div className="row justify-content-center mt-3">
                <div className="col-sm-8">
                {/* <h6 style= {{color:"red"}}>{this.props.responseMessage}</h6> */}
                    <div className="card d-flex flex-row">
                        <img src={this.props.event.images[0]} className="img-fluid events-card-image m-1" alt="..."/>
                        <div className="card-body card-body-lesspad">
                            <h5 className="card-title font-weight-bold">{this.props.event.event.name}</h5>
                            {/* <p className="card-text" style={{whiteSpace:'pre-wrap', color:'red'}}>{trimmedDescription}</p> */}
                            {
                                isLongDesc
                                ? <p className="card-text text-pre-wrap">
                                    {this.state.isMore ? this.props.event.description : `${trimmedDescription} ...`}
                                    <button type="button" className="btn btn-link view-details-color"
                                        onClick = {this.toggleMore}>
                                        {this.state.isMore ? 'Read Less' : 'Read More'}</button>
                                </p>
                                : <p className="card-text">{this.props.event.description}</p>
                            }
                            <p className="card-text"><strong>Points: </strong>{this.props.event.event.points}</p>
                            <p className="card-text"><strong>Status: </strong>{this.props.event.status}</p>
                            <p className="card-text"><strong>Completed Date: </strong>
                                {new Date(this.props.event.completedDate).toLocaleDateString()}
                            </p>
                            <p className="card-text"><strong>Submitted Date: </strong>
                                {new Date(this.props.event.createdDate).toLocaleString()}
                            </p>
                            <div className="d-flex flex-row">
                                <button type="button" className="btn btn-link view-details-color"
                                onClick={() => this.setState({ isOpen: true })}>
                                    <i class="fas fa-search-plus"/> Images
                                </button>
                                <button type="button" className="btn btn-link view-details-color"
                                onClick = {this.showAdminViewItemModal}>
                                    <i className="fas fa-edit"/> Edit
                                </button>
                                {/* <button type="button" className="btn btn-link delete-color"
                                onClick = {this.handleDelete}>
                                    <i className="fas fa-trash-alt"/> Delete
                                </button> */}
                                <button type="button" className="btn btn-link view-details-color"
                                onClick = {this.handleDelete}>
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
                {this.state.showAdminViewEventModal ? 
                <AdminViewEventModal hideAdminViewEventModal={this.hideAdminViewEventModal}
                event={this.props.event}/> : null}
            </div>
        )
    }
}

// const mapDispatchToProps = dispatch => {
//     return {
//         deleteEvent: id => {dispatch(deleteEvent(id))}
//     }
// }

// const mapStateToProps = state => {
//     return {
//         responseMessage: state.adminEvents.deleteResponseMessage
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(StudentEvent);
export default StudentEvent;