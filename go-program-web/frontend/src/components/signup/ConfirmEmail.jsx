import React, {useState, useEffect} from 'react';
import {backendUrl} from '../../config';
import collegeLogo from '../../images/coe_logo.png';


function ConfirmEmail(props) {
  var email = props.match.params.email;
  const [status, setStatus] = useState("success");
  const [message, setMessage] = useState("");
    useEffect(() => {
      fetch(`${backendUrl}/user/verifyEmail/?email=${email}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json,  text/plain, */*',
            'Content-Type': 'application/json'
        },
    })
    .then(res => {
        if(res.status === 200){
            res.json().then(resData => {
                setMessage(resData.message);
                setStatus("success");
            });
        }else{
            res.json().then(resData => {
                setMessage(resData.message);
                setStatus("failed");
            });
        }
    })
    .catch(err => {
        setMessage(`Internal Error - ${err}. Please contact Admin if the problem persists.`);
        setStatus("failed");
    });
    });

  return (

    <div className="container">
            <div className="row d-flex justify-content-center">
                <div className="col-sm-10 col-md-8 col-lg-6">
                    <form className="form-container">
                        <div className="d-flex align-items-center justify-content-center">
                            <img src={collegeLogo} alt="College Logo" className="img-fluid coe-logo text-center"/>
                        </div>
                        <h4 className={`mt-4 status-msg ${status}`}>
                            {message}
                        </h4>
                    </form>
                </div>
            </div>
        </div>
);
}

export default ConfirmEmail;