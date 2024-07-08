import React, { useState, useEffect } from "react";
import { Route, Switch, Link } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ReviewManager from "./ReviewManager";
import UserManager from "./UserManager";

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (e.g., by verifying a token)
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    // Implement your authentication check logic here
    // setIsAuthenticated(true) if the user is authenticated
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="admin-panel">
      <nav>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/reviews">Manage Reviews</Link>
        <Link to="/admin/users">Manage Users</Link>
      </nav>

      <Switch>
        <Route exact path="/admin" component={Dashboard} />
        <Route path="/admin/reviews" component={ReviewManager} />
        <Route path="/admin/users" component={UserManager} />
      </Switch>
    </div>
  );
};

export default AdminPanel;
