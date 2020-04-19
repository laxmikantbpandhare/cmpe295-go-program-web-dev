import React from 'react';
import { Switch, Route ,Link} from 'react-router-dom';
import StudentNavbar from './navbar/StudentNavbar';
import StudentAllEvents from './events/StudentAllEvents';
import StudentDashboard from './dashboard/StudentDashboard';
import StudentAllItems from './items/StudentAllItems';
import StudentItemDetails from './items/StudentItemDetails';
import StudentOrders from './orders/StudentOrders';

function Student() {
    return (
      <div>
          <StudentNavbar/>
          <Switch>
            <Route path="/student/dashboard" component={StudentDashboard}/>
            <Route path="/student/events" component={StudentAllEvents}/>
            <Route path="/student/claim-points" component={StudentAllItems}/>
            <Route path="/student/item-details" component={StudentItemDetails}/>
            <Route path="/student/orders" component={StudentOrders}/>
          </Switch>
      </div>
    );
  }
  
  export default Student;