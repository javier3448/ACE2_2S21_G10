import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import React from 'react';
import {ProvideAuth} from '../hooks/useInfo';
import {PrivateRoute} from './PrivateRoute'

function App() {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route exact path="/signin">
            <h1>Este es el login</h1>
          </Route>
          <Route exact path="/signup">
            <h1>Este es el registro</h1>
          </Route>
          <PrivateRoute exact path="/profile">
            <h1>Este es el perfil</h1>
          </PrivateRoute>
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

export default App;
