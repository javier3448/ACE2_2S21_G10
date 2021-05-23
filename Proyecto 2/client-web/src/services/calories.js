import { getUser } from 'services/user';

const bmr = () => {
  /// Recupera la edad, el sexo y el peso del usuario
  const userInfo = getUser();
  /// Peso en kilogramos
  const peso = userInfo.peso / 2.205;
  const edad = userInfo.edad;
  /// Altura en centimetros
  const altura = userInfo.altura * 100;
  /// Calculó de BMR por sexo
  var bmr = (10 * peso) + (6.25 * altura) - (5 * edad);
  if (userInfo.sexo === "M") {
    bmr += 5;
  } else if (userInfo.sexo === "F") {
    bmr -= 161;
  }
  return bmr;
}

/**
 * Calorías netas dado las calorías quemadas por minuto
 * @param {number} gross calorías brutas
 * @returns 
 */
const netBurn = (gross) => {
  /// Actividad por minuto
  const rmrcb = ((bmr() * 1.1) / 1440);
  const netBurn = gross - rmrcb;
  return Math.round(netBurn > 0 ? netBurn : 0);
}

/**
 * Determina cuantos repeticiones deberá
 * realizar para alcanzar cierta meta
 * @param {number} avg promedio de latido de corazón
 * @param {number} calExpected calorías que se esperan quemar
 */
const getLaps = (avg, calExpected) => {
  /// Recupera la edad, el sexo y el peso del usuario
  const userInfo = getUser();
  /// Peso en kilogramos
  const peso = userInfo.peso / 2.205;
  const edad = userInfo.edad;
  if (userInfo.sexo === "M") {
    const calories = (-55.0969 + (0.6309 * avg) + (0.1988 * peso) + (0.2017 * edad)) / 4.184
    return Math.round(calExpected / calories);
  } else if (userInfo.sexo === "F") {
    const calories = (-20.4022 + (0.4472 * avg) - (0.1263 * peso) + (0.074 * edad)) / 4.184;
    return Math.round(calExpected / calories);
  }
  return 0;
}

export { netBurn, getLaps };