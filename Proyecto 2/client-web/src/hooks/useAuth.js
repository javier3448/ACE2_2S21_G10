import axios from "axios";
import { createContext, useContext, useState } from "react";
import { urlServer } from "config";

const authContext = createContext();

export const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};

export const useProvideAuth = () => {
  /// Recupera 'useInfo' desde localStorage
  const storage = localStorage.getItem('userInfo');
  const [user, setUser] = useState(storage !== null);
  /// Servicio para iniciar sesión
  const signIn = (credentials) => {
    const { username, password } = credentials;
    const endpoint = urlServer + `login/${username}/${password}`;
    axios.get(endpoint).then((response) => {
      if (response.data) {
        localStorage.setItem("userInfo", JSON.stringify(response.data[0]));
        setUser(true);
        return true;
      }
    }).catch(() => {
      return false
    });
  };
  /// Servicio para cerrar sesión
  const signOut = async () => {
    try {
      await axios.delete(urlServer + 'login');
      localStorage.removeItem('userInfo');
      setUser(false);
    } catch {
    }
  };
  return {
    user,
    signIn,
    signOut
  }
}