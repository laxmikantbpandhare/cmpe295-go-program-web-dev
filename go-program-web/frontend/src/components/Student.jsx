import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {Redirect} from 'react-router';
import StudentNavbar from './navbar/StudentNavbar';
import StudentAllEvents from './events/StudentAllEvents';
import StudentDashboard from './dashboard/StudentDashboard';
import StudentAllItems from './items/StudentAllItems';
import StudentItemDetails from './items/StudentItemDetails';
import StudentOrders from './orders/StudentOrders';
import StudentCart from './orders/StudentCart';
import StudentOrderDetails from './orders/StudentOrderDetails';
import StudentAllSuggestions from './suggestions/StudentAllSuggestions';
import StudentProfile from './users/StudentProfile';
import ChangePassword from './password/ChangePassword';
import PageNotFound from './PageNotFound';

function Student() {
    let redirectVar = null;
    if(!localStorage.getItem('userType')|| (localStorage.getItem('userType') !== "manager" &&
      localStorage.getItem('userType') !== "admin" && localStorage.getItem('userType') !== "student")){
        localStorage.clear();
    }
    if(!localStorage.getItem('token')){
        redirectVar = <Redirect to= "/login"/>
    } else if(localStorage.getItem('userType') !== "student"){
        redirectVar = <Redirect to= "/login"/>
    }
    return (
      <div>
          {redirectVar}
          <StudentNavbar/>
          <Switch>
            <Route path="/student/dashboard" component={StudentDashboard}/>
            <Route path="/student/events" component={StudentAllEvents}/>
            <Route path="/student/redeem" component={StudentAllItems}/>
            <Route path="/student/item-details/:itemId" component={StudentItemDetails}/>
            <Route path="/student/orders" component={StudentOrders}/>
            <Route path="/student/suggestions" component={StudentAllSuggestions}/>
            <Route path="/student/cart" component={StudentCart}/>
            <Route path="/student/order-details/:orderId" component={StudentOrderDetails}/>
            <Route path="/student/change-password" component={ChangePassword}/>
            <Route path="/student/profile" component={StudentProfile}/>
            <Route component={PageNotFound}/>
          </Switch>
      </div>
    );
  }
  
  export default Student;