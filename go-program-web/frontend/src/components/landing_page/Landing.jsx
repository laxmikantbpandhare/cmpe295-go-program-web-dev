import React from 'react';
import landingImage from '../../image/go-pgm.jpg'
import './Landing.css'

function Landing() {
  return (
    <div>
      <div className="row">
        <div className="col-sm-6 no-gutters my-auto mx-auto justify-content-center">


        
          <button type="button" className="btn btn-primary btn-block w-50">Log in</button>
          <button type="button" className="btn btn-primary btn-block w-50">Sign up</button>
      

        
            
        </div>
        <div className="col-sm-6">
          <img src={landingImage} className=" w-100 h-auto"></img>
        </div>
      </div>
    </div>
  );
}

export default Landing;
