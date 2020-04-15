import React from 'react';
import {Link} from 'react-router-dom';
import collegeLogo from '../../images/coe_logo.png';
import './Navbar.css';
import '../../Common.css';

function AdminNavbar() {
    return (
    <div>
        <nav className="navbar navbar-dark navbar-custom navbar-expand-sm fixed-top">
            <a class="navbar-brand" href="#/admin/dashboard">
                <img src={collegeLogo} className="navbar-logo" alt="Logo"/>
            </a>
            <button className="navbar-toggler" data-toggle="collapse" data-target="#menu">
                <span><i class="fas fa-bars"></i></span>
            </button>
            <div className="collapse navbar-collapse" id="menu">
                <ul className="navbar-nav">
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <a className="nav-link" href="#/admin/dashboard"><i className="fas fa-tachometer-alt"></i> Dashboard</a>
                    </li>
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <a className="nav-link" href="#/admin/events"><i className="fas fa-calendar-check"></i> Events</a>
                    </li>
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <a className="nav-link" href="#/admin/inventory"><i className="fas fa-boxes"></i> Inventory</a>
                    </li>
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <a className="nav-link" href="#/admin/orders"><i className="fas fa-receipt"></i> Orders</a>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <div className="dropdown">
                            <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#"><i className="fas fa-id-badge"></i> UserName</a>
                            <div className="dropdown-menu">
                                <a href="#/profile" className="dropdown-item"><i className="fas fa-id-card"></i> Profile</a>
                            </div>
                        </div>
                    </li>
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <Link to="/" className="nav-link" onClick = {handleLogout}><i className="fas fa-sign-out-alt"></i>Log Out</Link>
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