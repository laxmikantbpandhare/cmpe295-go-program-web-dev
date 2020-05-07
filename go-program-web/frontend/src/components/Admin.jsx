import React from 'react';
import { Switch, Route ,Link} from 'react-router-dom';
import AdminDashboard from './dashboard/AdminDashboard';
import AdminNavbar from './navbar/AdminNavbar';
import AdminInventory from './items/AdminInventory';
import AdminAllEvents from './events/AdminAllEvents';
import AllEventsRequests from './requests/AllEventsRequests';
import AllOrdersRequests from './requests/AllOrdersRequests';

function Admin() {
    return (
      <div>
          <AdminNavbar/>
          <Switch>
            <Route path="/admin/dashboard" component={AdminDashboard}/>
            <Route path="/admin/inventory" component={AdminInventory}/>
            <Route path="/admin/events" component={AdminAllEvents}/>
            <Route path="/admin/events-requests" component={AllEventsRequests}/>
            <Route path="/admin/orders-requests" component={AllOrdersRequests}/>
          </Switch>
      </div>
    );
  }
  
  export default Admin;