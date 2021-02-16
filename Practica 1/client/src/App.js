import { useState } from "react";
import {
  BrowserRouter as Router,

  Route, Switch
} from "react-router-dom";
import './App.css';
import SingIn from './components/singin/SingInView';
import CoachView from './components/coach-profile/CoachView';
import ProfileView from './components/user-profile/ProfileView';
import DashboardView from './components/dashboard/DashboardView';
import OxygenView from './components/graphic/OxygenView';
import TemperatureView from './components/graphic/TemperatureView';
import HeartView from './components/graphic/HeartView';
import { Component } from "react";
import NavBar from "./components/nav-bar/NavBarView";

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {

}

const NavRoute = ({exact, path, component: Component}) => (
  <Route exact={exact} path={path} render={(props) => (
    <>
      <NavBar />
      <Component {...props} />
    </>
  )}/>
)

/**
 * Vista de login
 * Vista de coach
 * Vista de perfil (usuario y atleta)
 * Dashboard (usuario y atleta)
 * Metrica de latidos (usuario y atleta) (historial y tiempo real)
 * Metrica de oxigeno (usuario y atleta) (historial y tiempo real)
 * Metrica de temperatura (usuario y atleta) (historial y tiempo real)
 */
function App() {
  //const token = getToken();
  // if (!token) {
  //   return <SingIn setToken = {setToken}/>
  // }
  return (
      <Router>
        <Switch> 
          <Route path="/singin">
            <SingIn />
          </Route>
          <Route path='/coach'>
            <NavBar />
            <CoachView />
          </Route>
          <Route path='/info-user'>
            <NavBar />
            <ProfileView />
          </Route>
          <Route path='/dashboard'>
            <NavBar />
            <DashboardView />
          </Route>
          <Route path='/athlete/info/:id'>
            <NavBar />
            <ProfileView />
          </Route>
          <Route path='/athlete/stats/heart/:id'>
            <NavBar />
            <HeartView />
          </Route>
          <Route path='/athlete/stats/temp/:id'>
            <NavBar />
            <TemperatureView />
          </Route>
          <Route path='/athlete/stats/oxygen/:id'>
            <NavBar />
            <OxygenView />
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
