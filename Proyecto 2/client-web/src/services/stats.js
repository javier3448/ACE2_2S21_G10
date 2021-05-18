import axios from 'axios';
import { getUser } from 'services/user';
import { urlServer } from 'config';

/**
 * Recupera el mínimo, máximo y promedio de oxigeno.
 * Si lap se especifica calculara únicamente para
 * esa repetición. Si esa repetición no existe
 * devolverá 0
 * @param {number} lap 
 */
const getOxygen = async (lap = -1) => {
  try {
    const IdUser = getUser().IdUser;
    const response = await axios.get(urlServer + `proyecto2/obtener-oxigenov2/${IdUser}`);
    if (response.data.length) {
      if (lap > -1) {
        const lapNumber = Number(lap);
        const lapSet = response.data.find(e => e.repeticion === lapNumber);
        if (lapSet) {
          return {
            min: lapSet.minOxigeno,
            max: lapSet.maxOxigeno,
            avg: lapSet.avgOxigeno
          }
        }
      } else {
        const sum =
          response.data.reduce((n0, n1) => {
            return n0 + n1.arrayOxigeno.reduce((m0, m1) => {
              return m0 + m1.oxigeno
            }, 0);
          }, 0)
        const noRecords = response.data.reduce((n0, n1) => {
          return n0 + n1.arrayOxigeno.length;
        }, 0);
        const avg = (sum / noRecords).toFixed(2);
        const min = response.data.reduce((n0, n1) => n0 < n1.minOxigeno ? n0 : n1.minOxigeno, 2147483647);
        const max = response.data.reduce((n0, n1) => n0 > n1.maxOxigeno ? n0 : n1.minOxigeno, 0.0);
        return {
          avg,
          min,
          max
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return {
    avg: 0,
    max: 0,
    min: 0
  }
}

/**
 * Recupera el mínimo, máximo y promedio de temperatura.
 * Si lap se especifica calculara únicamente para
 * esa repetición. Si esa repetición no existe
 * devolverá 0
 * @param {number} lap 
 */
const getTemperature = async (lap = -1) => {
  try {
    const IdUser = getUser().IdUser;
    const response = await axios.get(urlServer + `proyecto2/obtener-temperaturav2/${IdUser}`);
    if (response.data.length) {
      if (lap > -1) {
        const lapNumber = Number(lap);
        const lapSet = response.data.find(e => e.repeticion === lapNumber);
        if (lapSet) {
          return {
            min: lapSet.minTemperatura,
            max: lapSet.maxTemperatura,
            avg: lapSet.avgTemperatura
          }
        }
      } else {
        const sum =
          response.data.reduce((n0, n1) => {
            return n0 + n1.arrayTemperatura.reduce((m0, m1) => {
              return m0 + m1.temperatura
            }, 0);
          }, 0)
        const noRecords = response.data.reduce((n0, n1) => {
          return n0 + n1.arrayTemperatura.length;
        }, 0);
        const avg = (sum / noRecords).toFixed(2);
        const min = response.data.reduce((n0, n1) => n0 < n1.minTemperatura ? n0 : n1.minTemperatura, 2147483647);
        const max = response.data.reduce((n0, n1) => n0 > n1.maxTemperatura ? n0 : n1.maxTemperatura, 0.0);
        return {
          avg,
          min,
          max
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return {
    avg: 0,
    max: 0,
    min: 0
  }
}

/**
 * Recupera el mínimo, máximo y promedio de ritmo cardíaco.
 * Si lap se especifica calculara únicamente para
 * esa repetición. Si esa repetición no existe
 * devolverá 0
 * @param {number} lap 
 */
const getHeart = async (lap = -1) => {
  try {
    const IdUser = getUser().IdUser;
    const response = await axios.get(urlServer + `proyecto2/obtener-ritmov2/${IdUser}`);
    if (response.data.length) {
      if (lap > -1) {
        const lapNumber = Number(lap);
        const lapSet = response.data.find(e => e.repeticion === lapNumber);
        if (lapSet) {
          return {
            min: lapSet.minRitmo,
            max: lapSet.maxRitmo,
            avg: lapSet.avgRitmo
          }
        }
      } else {
        const sum =
          response.data.reduce((n0, n1) => {
            return n0 + n1.arrayRitmo.reduce((m0, m1) => {
              return m0 + m1.ritmo
            }, 0);
          }, 0)
        const noRecords = response.data.reduce((n0, n1) => {
          return n0 + n1.arrayRitmo.length;
        }, 0);
        const avg = (sum / noRecords).toFixed(2);
        const min = response.data.reduce((n0, n1) => n0 < n1.minRitmo ? n0 : n1.minRitmo, 2147483647);
        const max = response.data.reduce((n0, n1) => n0 > n1.maxRitmo ? n0 : n1.maxRitmo, 0.0);
        return {
          avg,
          min,
          max
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return {
    avg: 0,
    max: 0,
    min: 0
  }
}

/**
 * Desde acá se pueden obtener medidas de dispersión
 * para determinar si el usuario necesita mejorar 
 * su resistencia
 * @param {number} lap
 */
const getArray = (lap) => {
  const IdUser = getUser().IdUser;
  const lapNumber = Number(lap);
  try {
    const response = await axios.get(urlServer + `proyecto2/obtener-ritmov2/${IdUser}`);
    const data = response.data;
    if (data.length) {
      const lapSet = data.find(e => e.repeticion === lapNumber);
      return lapSet.arrayRitmo;
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export { getHeart, getOxygen, getTemperature, getArray };