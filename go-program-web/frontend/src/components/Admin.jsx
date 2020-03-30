import React from 'react';
import { Switch, Route ,Link} from 'react-router-dom';
import AdminDashboard from './dashboard/AdminDashboard';

function Admin() {
    return (
      <div>
          {/* <StudentNavbar/> */}
          <Switch>
            <Route path="/admin/dashboard" component={AdminDashboard}/>
          </Switch>
      </div>
    );
  }
  
  export default Admin;