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

/**
 * 
 * @returns {{actualLaps:number,goal:number,calories:number,actualCal:number}} 
 */
export const getGoal = () => {
  const user = getUser();
  const goal = localStorage.getItem(`goal-${user.IdUser}`);
  try {
    return JSON.parse(goal);
  } catch (e) {
    return undefined;
  }
}

/**
 * 
 * @param {{actualLaps:number,goal:number,calories:number,actualCal:number}} goal 
 * @returns 
 */
export const setGoal = (goal) => {
  const user = getUser();
  if (user) {
    localStorage.setItem(`goal-${user.IdUser}`, JSON.stringify(goal));
    return true;
  }
  return false;
}

/**
 * Elimina la meta actual 
 * @returns boolean
 */
export const removeGoal = () => {
  const user = getUser();
  if (user) {
    localStorage.removeItem(`goal-${user.IdUser}`);
    return true;
  }
  return false;
}