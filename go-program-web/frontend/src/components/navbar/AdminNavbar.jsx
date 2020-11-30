import React from 'react';
import {Link} from 'react-router-dom';
import collegeLogo from '../../images/coe_logo.png';
import './Navbar.css';
import '../../Common.css';

function AdminNavbar() {
    return (
    <div>
        <nav className="navbar navbar-dark navbar-custom navbar-expand-sm fixed-top">
            <a class="navbar-brand" href="/admin/dashboard">
                <img src={collegeLogo} className="navbar-logo" alt="Logo"/>
            </a>
            <button className="navbar-toggler" data-toggle="collapse" data-target="#menu">
                <span><i class="fas fa-bars"></i></span>
            </button>
            <div className="collapse navbar-collapse" id="menu">
                <ul className="navbar-nav">
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <a className="nav-link" href="/admin/dashboard"><i className="fas fa-tachometer-alt"></i> Dashboard</a>
                    </li>
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <a className="nav-link" href="/admin/events"><i className="fas fa-calendar-check"></i> Events</a>
                    </li>
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <a className="nav-link" href="/admin/inventory"><i className="fas fa-boxes"></i> Inventory</a>
                    </li>
                    {
                        localStorage.getItem('userType') === 'manager' && 
                        (<li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                            <a className="nav-link" href="/admin/users"><i className="fas fa-user"></i> Manage Admin Users</a>
                        </li>)
                    }
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <div className="dropdown">
                            <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#"><i className="fas fa-bell"></i> Requests</a>
                            <div className="dropdown-menu">
                                <a href="/admin/events-requests" className="dropdown-item"><i className="fas fa-calendar-check"></i> Students Events</a>
                                <a href="/admin/orders-requests" className="dropdown-item"><i className="fas fa-receipt"></i> Students Orders</a>
                                <a href="/admin/suggested-events-requests" className="dropdown-item"><i className="fas fa-lightbulb"></i> Students Suggested Events</a>
                                <a href="/admin/users-requests" className="dropdown-item"><i className="fas fa-user"></i> Users</a>
                            </div>
                        </div>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <div className="dropdown">
                            <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#"><i className="fas fa-id-badge"></i> Hi,{localStorage.getItem('fname')}</a>
                            <div className="dropdown-menu rightmost-menu">
                                <Link to="/admin/change-password" className="dropdown-item"><i className="fas fa-key"></i>Change Password</Link>
                                <Link to="/" className="dropdown-item" onClick = {handleLogout}><i className="fas fa-sign-out-alt"></i>Log Out</Link>
                            </div>
                        </div>
                    </li> 
                </ul>
            </div>
        </nav>
    </div>
    );
}

function handleLogout() {
    localStorage.clear();
}

export default AdminNavbar;