import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import SignIn from "./components/signin/SignInView";
import CoachView from "./components/coach-profile/CoachView";
import ProfileView from "./components/user-profile/ProfileView";
import DashboardView from "./components/dashboard/DashboardView";
import OxygenView from "./components/graphic/OxygenView";
import TemperatureView from "./components/graphic/TemperatureView";
import HeartView from "./components/graphic/HeartView";
import NavBar from "./components/nav-bar/NavBarView";
import { ProvideAuth, useAuth } from "./services/useInfo";

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
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route path="/signin">
            <SignIn />
          </Route>
          <PrivateRoute path="/coach">
            <NavBar />
            <CoachView />
          </PrivateRoute>
          <PrivateRoute path="/info-user">
            <NavBar />
            <ProfileView />
          </PrivateRoute>
          <PrivateRoute path="/dashboard">
            <NavBar />
            <DashboardView />
          </PrivateRoute>
          <PrivateRoute path="/dashboard/:id">
            <NavBar />
            <DashboardView />
          </PrivateRoute>
          <PrivateRoute path="/athlete/info/:id">
            <NavBar />
            <ProfileView />
          </PrivateRoute>
          <PrivateRoute path="/athlete/stats/heart/:id">
            <NavBar />
            <HeartView />
          </PrivateRoute>
          <PrivateRoute path="/athlete/stats/temp/:id">
            <NavBar />
            <TemperatureView />
          </PrivateRoute>
          <PrivateRoute path="/athlete/stats/oxygen/:id">
            <NavBar />
            <OxygenView />
          </PrivateRoute>
          <PrivateRoute path="/">
            <NavBar />
            <DashboardView />
          </PrivateRoute>
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

/**
 * Crea un componente que utiliza como base <Route>
 * Si hay un usuario logeado, permitirá el paso a la ruta 'privada'
 * Si no hay un usuario logeado, redirigirá a la página signin
 * @param {*} param0 
 */
function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return auth.user === true ? (
          children
        ) : (
          <Redirect to={{ pathname: "/signin", state: { from: location } }} />
        );
      }}
    />
  );
}

export default App;
