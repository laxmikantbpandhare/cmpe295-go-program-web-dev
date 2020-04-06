import React from 'react';
import { Switch, Route ,Link} from 'react-router-dom';
import AdminDashboard from './dashboard/AdminDashboard';
import AdminNavbar from './navbar/AdminNavbar';
import AdminInventory from './items/AdminInventory';
import AdminAllEvents from './events/AdminAllEvents';

function Admin() {
    return (
      <div>
          <AdminNavbar/>
          <Switch>
            <Route path="/admin/dashboard" component={AdminDashboard}/>
            <Route path="/admin/inventory" component={AdminInventory}/>
            <Route path="/admin/events" component={AdminAllEvents}/>
          </Switch>
      </div>
    );
  }
  
  export default Admin;