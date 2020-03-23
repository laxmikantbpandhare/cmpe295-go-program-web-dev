import React from 'react';
import {Route,Switch} from 'react-router-dom';
import Landing from './landing/Landing';
import StudentLogin from './studentLogin/StudentLogin';
import Navbar from './navbar/Navbar';
import Dashboard from './dashboard/Dashboard';
import Events from './events/Events';
import AllItems from './items/AllItems';
import ItemDetails from './items/ItemDetails';
import Orders from './orders/Orders';

//Create a Main Functional Component
function Main() {
  return (
    <div>
        <Navbar/>
        <Switch>
          <Route path="/" exact component={Landing}/>
          <Route path="/student-login" exact component={StudentLogin}/>
          <Route path="/dashboard" exact component={Dashboard}/>
          <Route path="/events" exact component={Events}/>
          <Route path="/claim-points" exact component={AllItems}/>
          <Route path="/item-details/:id" exact component={ItemDetails}/>
          <Route path="/orders" exact component={Orders}/>
        </Switch>
    </div>
  );
}

//Export The Main Component
export default Main;