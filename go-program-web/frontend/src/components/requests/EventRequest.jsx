import React, {Component} from 'react';
import '../../Common.css';
import './Requests.css'
import ViewEventRequestModal from './ViewEventRequestModal';
import Lightbox from 'react-image-lightbox';
import {connect} from 'react-redux';

class EventRequest extends Component{
    constructor(props){
        super(props);
        this.state = {
            showViewEventRequestModal: false,
            photoIndex: 0,
            isOpen: false
            // isMore: false
        };
    }

    showViewEventRequestModal = e => {
        this.setState({showViewEventRequestModal: true});
    }
    
    hideViewEventRequestModal = e => {
        this.setState({showViewEventRequestModal: false});
    }

    // toggleMore = () => {
    //     this.setState({ isMore: !this.state.isMore });
    // }
    
    render() {
        const { photoIndex, isOpen } = this.state;
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
                    <div className="card d-flex flex-row">
                        <img src={this.props.event.images[0]} className="img-fluid events-card-image m-1" alt="..."/>
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
                            <p className="card-text"><strong>Status: </strong>{this.props.event.status}</p>
                            {/* <p className="card-text"><strong>Completed Date: </strong>
                                {new Date(this.props.event.completedDate).toLocaleDateString()}
                            </p> */}
                            <p className="card-text"><strong>Submitted Date: </strong>
                                {new Date(this.props.event.createdDate).toLocaleString()}
                            </p>
                            <div className="d-flex flex-row">
                                <button type="button" className="btn btn-link view-details-color"
                                onClick={() => this.setState({ isOpen: true })}>
                                    <i class="fas fa-search-plus"/> View Images
                                </button>
                                <button type="button" className="btn btn-link view-details-color"
                                onClick = {this.showViewEventRequestModal}
                                >
                                    <i className="fas fa-eye"/> View Details
                                </button>
                                {/* <button type="button" className="btn btn-link delete-color"
                                onClick = {this.handleDelete}>
                                    <i className="fas fa-trash-alt"/> Delete
                                </button> */}
                                <button type="button" className="btn btn-link view-details-color">
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
            </div>
        )
    }
}

// const mapDispatchToProps = dispatch => {
//     return {
//         deleteEvent: id => {dispatch(deleteEvent(id))}
//     }
// }

const mapStateToProps = state => {
    return {
        responseMessage: state.adminEvents.deleteResponseMessage
    }
}

// export default connect(mapStateToProps, mapDispatchToProps)(EventRequest);
export default connect(mapStateToProps)(EventRequest);