import React from 'react';
import { ProvideAuth, useAuth } from './hooks/useAuth';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

function App() {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route exact path='/signin'>
          </Route>
          <Route exact path='/signup'>
          </Route>
          <PrivateRoute exact path='/profile'>
          </PrivateRoute>
          <PrivateRoute exact path='/dashboard'>
          </PrivateRoute>
          <Route>
          </Route>
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

/**
 * Componente que permite visualizar ciertas
 * vistas dependiendo si existe o no un 
 * usuario logeado
 * @param {*} param0 
 * @returns 
 */
const PrivateRoute = ({ children, rest }) => {
  let auth = useAuth
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return auth.user === true ? (
          children
        ) : (
          <Redirect to={{ pathname: '/signin', state: { from: location } }} />
        )
      }}
    />
  )
}

export default App;
