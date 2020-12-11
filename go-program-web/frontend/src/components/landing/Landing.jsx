import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import mainImage from '../../images/landing_image.jpg';
import collegeLogo from '../../images/coe_logo.png';
import './Landing.css';
import '../../Common.css';

function Landing() {
  let redirectVar = null;
  if(localStorage.getItem('token')){
    redirectVar = <Redirect to= "/login"/>;
  }
  return (
    <div>
      {redirectVar}
    <div className="container-fluid p-0">
      <div className="row landing-height">
       <div className="col-sm-9">
         <img src={mainImage} className="img-fluid landing-image" alt="Landing page Pic"/>
         </div>
         <div className="col-sm-3 d-flex align-items-center flex-column justify-content-center">
         <img src={collegeLogo} alt="College Logo" className="img-fluid landing-coe-logo"/>
         <br/>
         <div className="landing-left">
           <span className="msg-go-program-landing">Want to know more about GO Program?
             <a target="_blank" rel="noopener noreferrer" href="https://www.sjsu.edu/engineering/student-success/ease/go/index.php"> Click Here!</a>
           </span>
           <br/>
           <br/>
           <span className="msg-login">GO now.</span>
           <Link to="/login">
             <button type="button" className="btn btn-primary btn-block login-btn-landing">Log in</button>
           </Link>
           <Link to="/signup">
            <button type="button" className="btn btn-primary btn-block signup-btn-landing">Student Sign up</button>
           </Link>
         </div>
       </div>
     </div>
   </div>
 </div>
  );
}

export default Landing;
