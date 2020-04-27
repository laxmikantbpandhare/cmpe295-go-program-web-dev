import React, {Component} from 'react';
// import {Link} from 'react-router-dom';
// import {Redirect} from 'react-router';
import '../../Common.css';
import './Dashboard.css';

class AdminDashboard extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            password: "",
            message: ""
        }
    }
    
    render() {
        // let redirectVar = null;
        if(localStorage.getItem('token')){

        }
        
        return(
        <div className="top-align">
           Admin Dashboard
        </div>
        )
    }
}

export default AdminDashboard;