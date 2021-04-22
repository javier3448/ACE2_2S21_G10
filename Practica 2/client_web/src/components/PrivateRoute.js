import {
  Route,
  Redirect
} from 'react-router-dom';
import React from 'react';
import { useAuth } from '../hooks/useInfo';

/**
 * Crea un componente que utiliza como base <Route>
 * Si hay un usuario logeado, permitirá el paso a la ruta 'privada'
 * Si no hay un usuario logeado, redirigirá a la página signin
 * @param {*} param0 
 */
export default PrivateRoute = ({children, ...rest}) => {
  let auth = useAuth();
  return (
    <Route 
      {...rest}
      render={({location}) => {
        return auth.user === true ? (
          children
        ) : (
          <Redirect to={{pathname='/signin',state: {from:location}}} />
        );
      }}
    />
  );
}