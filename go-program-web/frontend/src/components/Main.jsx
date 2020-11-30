import React from 'react';
import {Route,Switch} from 'react-router-dom';
import Landing from './landing/Landing';
import Login from './login/Login';
import Signup from './signup/Signup';
import ResendEmail from './signup/ResendEmail';
import ConfirmEmail from './signup/ConfirmEmail';
import Student from './Student';
import Admin from './Admin';
import ResetPassword from './password/ResetPassword';
import PageNotFound from './PageNotFound';

//Create a Main Functional Component
function Main() {
  return (
    <Switch>
      <Route path="/" exact component={Landing}/>
      <Route path="/login" component={Login}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/reset-password" component={ResetPassword}/>
      <Route path="/resend-email" component={ResendEmail}/>
      <Route path="/confirm-email/:email" component={ConfirmEmail}/>
      <Route path="/student/:id" component={Student}/>
      <Route path="/admin/:id" component={Admin}/>
      <Route component={PageNotFound}/>
    </Switch>
  );
}

//Export The Main Component
export default Main;