import React from 'react';
import { Switch, Route ,Link} from 'react-router-dom';
import AdminDashboard from './dashboard/AdminDashboard';
import AdminNavbar from './navbar/AdminNavbar';
import AdminInventory from './items/AdminInventory';
import AdminAllEvents from './events/AdminAllEvents';
import AllEventsRequests from './requests/AllEventsRequests';
import AllOrdersRequests from './requests/AllOrdersRequests';
import OrderRequestDetails from './requests/OrderRequestDetails';
import AllSuggestedEventsRequests from './requests/AllSuggestedEventsRequests';

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
            <Route path="/admin/suggested-events-requests" component={AllSuggestedEventsRequests}/>
            <Route path="/admin/order-details/:orderId" component={OrderRequestDetails}/>
          </Switch>
      </div>
    );
  }
  
  export default Admin;