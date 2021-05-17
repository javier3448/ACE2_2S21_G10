import React from 'react';
import { ProvideAuth, useAuth } from 'hooks/useAuth';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import Auth from 'views/Auth';
import SignUp from 'pages/SignUp';
import SignIn from 'pages/SignIn';
import User from 'views/User';
import Profile from 'pages/Profile';
import Dashboard from 'pages/Dashboard';
import RealTime from 'pages/RealTime';
import Advice from 'pages/Advice';

function App() {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route exact path='/signin'>
            <Auth>
              <SignIn />
            </Auth>
          </Route>
          <Route exact path='/signup'>
            <Auth>
              <SignUp />
            </Auth>
          </Route>
          <Route exact path='/'>
            <Redirect to='/dashboard'/>
          </Route>
          <PrivateRoute exact path='/profile'>
            <User>
              <Profile />
            </User>           
          </PrivateRoute>
          <PrivateRoute exact path='/dashboard'>
            <User>
              <Dashboard />
            </User>
          </PrivateRoute>
          <PrivateRoute exact path='/realtime'>
            <User>
              <RealTime />
            </User>
          </PrivateRoute>
          <PrivateRoute exact path='/dashboard/:lap'>
            <User>
              <Dashboard />
            </User>
          </PrivateRoute>
          <PrivateRoute exact path='/advice'>
            <User>
              <Advice />
            </User>
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
const PrivateRoute = ({ children, ...rest }) => {
  let auth = useAuth();
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

