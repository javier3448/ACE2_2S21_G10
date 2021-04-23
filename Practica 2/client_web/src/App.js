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
import NavBar from "./components/nav-bar/NavBarView";
import { ProvideAuth, useAuth } from "./services/useInfo";
import ErrorView from "./components/error-page/Error";
import SignUpView from "./components/sign-up/SignUpView";
import AllGraphics from "./components/graphics/history/AllGraphics";
import AllMeasure from "./components/graphics/realtime/AllMeasure";

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
          <Route exact path="/signin">
            <SignIn />
          </Route>
          <Route exact path='/signup'>
            <SignUpView />
          </Route>
          <Route exact path="/">
            <Redirect to='/dashboard' />
          </Route>
          <PrivateRoute exact path="/coach">
            <NavBar />
            <CoachView />
          </PrivateRoute>
          <PrivateRoute exact path="/info-user">
            <NavBar />
            <ProfileView />
          </PrivateRoute>
          <PrivateRoute exact path="/dashboard">
            <NavBar />
            <DashboardView />
          </PrivateRoute>
          <PrivateRoute exact path="/dashboard/:id">
            <NavBar />
            <DashboardView />
          </PrivateRoute>
          <PrivateRoute exact path="/athlete/stats/vo2max/:id">
            <NavBar />
            <AllGraphics />
          </PrivateRoute>
          <PrivateRoute exact path="/athlete/stats-history/vo2max/:id">
            <NavBar />
            <AllMeasure />
          </PrivateRoute>
          <Route>
            <ErrorView  data={{"error": "404 - Recurso no encontrado"}} />
          </Route>
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
