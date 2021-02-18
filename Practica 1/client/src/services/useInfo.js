import axios from "axios";
import { createContext, useContext, useState } from "react";
import { urlServer } from "../config";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  // Crea un 'hook' y lo inicializa con
  // la variable de sesión 'userInfo'
  // que es donde se guarda la información
  // que devuelve el servidor luego de 
  // que un usuario se logea  correctamente
  const [user, setUser] = useState(localStorage.getItem('userInfo') !== null);

  const signIn = async (credentials) => {
    const response = await axios.get(
      urlServer + `login/${credentials.username}/${credentials.password}`
    );
    if (response.status === 200) {
      //Status:OK
      if (response.data[0] !== undefined) {
        // El servidor debe responder con un array
        localStorage.setItem("userInfo", JSON.stringify(response.data[0]));
        setUser(true);
        return true;
      }
    }
    console.log(user);
    return false;
  };
  const signOut = () => {
    localStorage.removeItem("userInfo");
    setUser(false);
  };
  return {
    user,
    signIn,
    signOut,
  };
}
