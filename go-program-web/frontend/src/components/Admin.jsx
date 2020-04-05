import React from 'react';
import { Switch, Route ,Link} from 'react-router-dom';
import AdminDashboard from './dashboard/AdminDashboard';
import AdminNavbar from './navbar/AdminNavbar';
import AdminInventory from './items/AdminInventory';
import AdminItemDetails from './items/AdminItemDetails';

function Admin() {
    return (
      <div>
          <AdminNavbar/>
          <Switch>
            <Route path="/admin/dashboard" component={AdminDashboard}/>
            <Route exact path="/admin/inventory" component={AdminInventory}/>
            <Route path="/admin/inventory/item/:id" component={AdminItemDetails}/>
          </Switch>
      </div>
    );
  }
  
  export default Admin;