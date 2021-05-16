/**
 * Recupera la información del usuario
 * @returns 
 */
export const getUser = () => {
  const userInfo = localStorage.getItem('userInfo');
  try {
    return JSON.parse(userInfo);
  } catch (e) {
    return undefined;
  }
}