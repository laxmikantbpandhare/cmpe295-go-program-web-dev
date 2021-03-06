import React from 'react';
import {Link} from 'react-router-dom';
import collegeLogo from '../../images/coe_logo.png';
import './Navbar.css';
import '../../Common.css';

function StudentNavbar() {
    return (
    <div>
        <nav className="navbar navbar-dark navbar-custom navbar-expand-sm fixed-top">
            <a className="navbar-brand" href="/student/dashboard">
                <img src={collegeLogo} className="navbar-logo" alt="Logo"/>
            </a>
            <button className="navbar-toggler" data-toggle="collapse" data-target="#menu">
                <span><i className="fas fa-bars"></i></span>
            </button>
            <div className="collapse navbar-collapse" id="menu">
                <ul className="navbar-nav">
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <a className="nav-link" href="/student/dashboard"><i className="fas fa-tachometer-alt"></i> Dashboard</a>
                    </li>
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <a className="nav-link" href="/student/events"><i className="fas fa-calendar-check"></i> Events</a>
                    </li>
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <a className="nav-link" href="/student/redeem"><i className="fas fa-award"></i> Redeem</a>
                    </li>
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <a className="nav-link" href="/student/orders"><i className="fas fa-receipt"></i> Orders</a>
                    </li>
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <a className="nav-link" href="/student/suggestions"><i className="fas fa-lightbulb"></i> Suggestions</a>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <Link to="/student/cart" className="nav-link"><i className="fas fa-shopping-cart"></i>Cart</Link>
                    </li>
                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <div className="dropdown">
                            <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#"><i className="fas fa-id-badge"></i> Hi,{localStorage.getItem('fname')}</a>
                            <div className="dropdown-menu rightmost-menu">
                                <Link to="/student/profile" className="dropdown-item"><i className="fas fa-id-card"></i>&nbsp;Profile</Link>
                                <Link to="/student/change-password" className="dropdown-item"><i className="fas fa-key"></i>&nbsp;Change Password</Link>
                                <Link to="/" className="dropdown-item" onClick = {handleLogout}><i className="fas fa-sign-out-alt"></i>&nbsp;Log Out</Link>
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

export default StudentNavbar;