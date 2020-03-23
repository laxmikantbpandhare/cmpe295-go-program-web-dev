import React from 'react';
import {Link} from 'react-router-dom';
import mainImage from '../../images/landing_image.jpg';
import collegeLogo from '../../images/coe_logo.png';
import './Landing.css';
import '../../Common.css';

function Landing() {
  return (
    <div>
    <div className="container-fluid p-0">
      <div className="row landing-height">
       <div className="col-sm-6">
         <img src={mainImage} className="img-fluid landing-image" alt="Landing page image"/>
         </div>
         <div className="col-sm-6 d-flex align-items-center flex-column justify-content-center">
         <img src={collegeLogo} className="img-fluid coe-logo"/>
         <br/>
         <div className="landing-left">
           <span className="msg-go-program-landing">Want to know more about GO Program?
             <a href="https://engineering.sjsu.edu/go" target="_blank"> Click Here!</a>
           </span>
           <br/>
           <br/>
           <span className="msg-login">GO now.</span>
           <Link to="/student-login">
             <button type="button" className="btn btn-primary btn-block login-btn-landing">Log in</button>
           </Link>
           <button type="button" className="btn btn-primary btn-block signup-btn-landing">Sign up</button>
         </div>
       </div>
     </div>
   </div>
 </div>
  );
}

export default Landing;
