import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { urlServer } from '../config';

const authContext = createContext();

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

/**
 * 
 * @returns 
 */
export const useAuth = () => {
  return useContext(authContext);
}
/**
 * 
 * @returns 
 */
const useProvideAuth = () => {
  const [user, setUser] = useState(localStorage.getItem('userInfo') !== null);
  const signIn = async (credentials) => {
    const url = urlServer + `login/${credentials.username}/${credentials.password}`;
    const response = await axios.get(url);
    if (response.status === 200) {
      if(!response.data[0]) {
        localStorage.setItem('userInfo', JSON.stringify(response.data[0]));
        setUser(true);
        return true;
      }
    }
    return false;
  };
  const signOut = async() => {
    const response = await axios.delete(urlServer+'login');
    localStorage.removeItem('userInfo');
    setUser(false);
  };
  return {
    user,
    signIn,
    signOut
  }
}