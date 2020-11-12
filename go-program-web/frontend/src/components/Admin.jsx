import React from 'react';
import { Switch, Route ,Link} from 'react-router-dom';
import AdminDashboard from './dashboard/AdminDashboard';
import AdminNavbar from './navbar/AdminNavbar';
import AdminInventory from './items/AdminInventory';
import AdminAllEvents from './events/AdminAllEvents';
import AllEventRequests from './requests/AllEventRequests';
import AllOrderRequests from './requests/AllOrderRequests';
import OrderRequestDetails from './requests/OrderRequestDetails';
import AllSuggestedEventRequests from './requests/AllSuggestedEventRequests';
import AllUserRequests from './requests/AllUserRequests';
import AllAdmins from './users/AllAdmins';
import ChangePassword from './password/ChangePassword';

function Admin() {
    return (
      <div>
          <AdminNavbar/>
          <Switch>
            <Route path="/admin/dashboard" component={AdminDashboard}/>
            <Route path="/admin/inventory" component={AdminInventory}/>
            <Route path="/admin/events" component={AdminAllEvents}/>
            <Route path="/admin/users" component={AllAdmins}/>
            <Route path="/admin/events-requests" component={AllEventRequests}/>
            <Route path="/admin/orders-requests" component={AllOrderRequests}/>
            <Route path="/admin/suggested-events-requests" component={AllSuggestedEventRequests}/>
            <Route path="/admin/users-requests" component={AllUserRequests}/>
            <Route path="/admin/order-details/:orderId" component={OrderRequestDetails}/>
            <Route path="/admin/change-password" component={ChangePassword}/>
          </Switch>
      </div>
    );
  }
  
  export default Admin;