const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

exports.handler = async (event) => {
  console.log("aqui ando");
  let value;
  value = await testFinal(event);
  return value;
};

async function testFinal(event) {
  const test2 = getDataLogin(event);
  const test3 = getDataV2(event);
  const results = await Promise.all([test2, test3]);
  console.log(results);
  let datosUsuarios = results[0];
  let datosSensores = results[1];
  let peso = datosUsuarios[0].peso / 2.205;
  peso = Math.ceil(peso);
  peso = parseFloat(peso.toFixed(2));
  let edad = datosUsuarios[0].edad;
  let genero = datosUsuarios[0].sexo;
  if (genero === "M") {
    genero = 1;
  } else if (genero === "F") {
    genero = 0;
  }
  let valoresUsuario = { peso: peso, edad: edad, genero: genero };
  let caloriasJSON = calculateData(datosSensores, valoresUsuario);
  return caloriasJSON;
}

function calculateData(dataSensors, dataUsers) {
  let index = 0;
  let temporal = [];
  let dataTempo = null;

  let result = [];
  while (true) {
    if (index > dataSensors.length - 1) {
      break;
    }
    /******************************************************* ********************************************************************************/

    if (index + 1 > dataSensors.length - 1) {
      if (dataSensors.length === 1) {
        if (dataSensors[index].ritmo >= 1 && dataSensors[index].tiempo > 1) {
          if (dataSensors[index].ritmo >= 1 && dataSensors[index].ritmo <= 60) {
            dataSensors[index].ritmo += 80;
          } else if (
            dataSensors[index].ritmo >= 61 &&
            dataSensors[index].ritmo <= 100
          ) {
            dataSensors[index].ritmo += 50;
          }
          let calperminute =
            (-55.0969 +
              0.6309 * dataSensors[index].ritmo +
              0.1988 * dataUsers.peso +
              0.2017 * dataUsers.edad) /
            4.184;
          let tiempo = dataSensors[index].tiempo / 3600;
          let calpersecond = calperminute * tiempo;
          calpersecond = parseFloat(calpersecond.toFixed(2));
          temporal.push({
            calpersecond: calpersecond,
            repeticion: dataSensors[index].repeticion,
            tiempo: dataSensors[index].tiempo,
          });
          result.push(getCaloriePerMinute(temporal));
          temporal = [];
        }
        break;
      } else {
        if (dataSensors[index - 1].prueba === dataSensors[index].prueba) {
          if (dataSensors[index].ritmo >= 1 && dataSensors[index].tiempo > 1) {
            if (
              dataSensors[index].ritmo >= 1 &&
              dataSensors[index].ritmo <= 60
            ) {
              dataSensors[index].ritmo += 80;
            } else if (
              dataSensors[index].ritmo >= 61 &&
              dataSensors[index].ritmo <= 100
            ) {
              dataSensors[index].ritmo += 50;
            }
            let calperminute =
              (-55.0969 +
                0.6309 * dataSensors[index].ritmo +
                0.1988 * dataUsers.peso +
                0.2017 * dataUsers.edad) /
              4.184;
            let tiempo = dataSensors[index].tiempo / 3600;
            let calpersecond = calperminute * tiempo;
            calpersecond = parseFloat(calpersecond.toFixed(2));
            temporal.push({
              calpersecond: calpersecond,
              repeticion: dataSensors[index].repeticion,
              tiempo: dataSensors[index].tiempo,
            });
            result.push(getCaloriePerMinute(temporal));
            temporal = [];
          }
          break;
        } else {
          if (dataSensors[index].ritmo >= 1 && dataSensors[index].tiempo > 1) {
            if (
              dataSensors[index].ritmo >= 1 &&
              dataSensors[index].ritmo <= 60
            ) {
              dataSensors[index].ritmo += 80;
            } else if (
              dataSensors[index].ritmo >= 61 &&
              dataSensors[index].ritmo <= 100
            ) {
              dataSensors[index].ritmo += 50;
            }
            let calperminute =
              (-55.0969 +
                0.6309 * dataSensors[index].ritmo +
                0.1988 * dataUsers.peso +
                0.2017 * dataUsers.edad) /
              4.184;
            let tiempo = dataSensors[index].tiempo / 3600;
            let calpersecond = calperminute * tiempo;
            calpersecond = parseFloat(calpersecond.toFixed(2));
            temporal.push({
              calpersecond: calpersecond,
              repeticion: dataSensors[index].repeticion,
              tiempo: dataSensors[index].tiempo,
            });
            result.push(getCaloriePerMinute(temporal));
            temporal = [];
          }
          break;
        }
      }
    }
    /******************************************************** ********************************************************************************/
    if (dataSensors[index].repeticion === dataSensors[index + 1].repeticion) {
      if (dataSensors[index].ritmo >= 1 && dataSensors[index].tiempo > 1) {
        if (dataSensors[index].ritmo >= 1 && dataSensors[index].ritmo <= 60) {
          dataSensors[index].ritmo += 80;
        } else if (
          dataSensors[index].ritmo >= 61 &&
          dataSensors[index].ritmo <= 100
        ) {
          dataSensors[index].ritmo += 50;
        }
        let calperminute =
          (-55.0969 +
            0.6309 * dataSensors[index].ritmo +
            0.1988 * dataUsers.peso +
            0.2017 * dataUsers.edad) /
          4.184;
        let tiempo = dataSensors[index].tiempo / 3600;
        let calpersecond = calperminute * tiempo;
        calpersecond = parseFloat(calpersecond.toFixed(2));
        temporal.push({
          calpersecond: calpersecond,
          repeticion: dataSensors[index].repeticion,
          tiempo: dataSensors[index].tiempo,
          ritmo: dataSensors[index].ritmo,
        });
      }
    } else if (
      dataSensors[index].repeticion != dataSensors[index + 1].repeticion
    ) {
      if (dataSensors[index].ritmo >= 1 && dataSensors[index].tiempo > 1) {
        if (dataSensors[index].ritmo >= 1 && dataSensors[index].ritmo <= 60) {
          dataSensors[index].ritmo += 80;
        } else if (
          dataSensors[index].ritmo >= 61 &&
          dataSensors[index].ritmo <= 100
        ) {
          dataSensors[index].ritmo += 50;
        }
        let calperminute =
          (-55.0969 +
            0.6309 * dataSensors[index].ritmo +
            0.1988 * dataUsers.peso +
            0.2017 * dataUsers.edad) /
          4.184;
        let tiempo = dataSensors[index].tiempo / 3600;
        let calpersecond = calperminute * tiempo;
        calpersecond = parseFloat(calpersecond.toFixed(2));
        temporal.push({
          calpersecond: calpersecond,
          repeticion: dataSensors[index].repeticion,
          tiempo: dataSensors[index].tiempo,
          ritmo: dataSensors[index].ritmo,
        });
        result.push(getCaloriePerMinute(temporal));
        temporal = [];
      }
    }
    index += 1;
  }
  return result;
}

function getCaloriePerMinute(data) {
  let sumCalorie = 0;
  for (let index = 0; index < data.length; index++) {
    sumCalorie += data[index].calpersecond;
  }
  sumCalorie = Math.ceil(sumCalorie);
  sumCalorie = parseFloat(sumCalorie.toFixed(2));
  let result = { arrayCaloriasPorSegundo: data, calperminute: sumCalorie };
  return result;
}
async function getDataLogin(event) {
  console.log("Welcome to get all inhalado y exhalado!");
  const params = {
    TableName: "Users",
  };

  try {
    const data = await dynamodb.scan(params).promise();
    console.log("Success");
    // console.log(data)
    let array = data.Items;
    let length = array.length;
    let dataSensors = [];
    for (let index = 0; index < length; index++) {
      if (event.IdUser === array[index].IdUser.S) {
        let peso = +array[index].peso.N;
        peso = Math.round(peso);
        peso = parseFloat(peso.toFixed(2));
        let edad = +array[index].edad.N;
        edad = Math.round(edad);
        edad = parseFloat(edad.toFixed(2));
        dataSensors.push({
          peso: peso,
          altura: +array[index].altura.N,
          edad: edad,
          sexo: array[index].sexo.S,
        });
      }
    }
    console.log(dataSensors);
    return dataSensors;
  } catch (e) {
    console.log("Failure", e.message);
  }
}

async function getDataV2(event) {
  const params = {
    TableName: "Sensors",
  };
  try {
    const data = await dynamodb.scan(params).promise();
    let array = data.Items;
    let length = array.length;
    let dataSensors = [];
    for (let index = 0; index < length; index++) {
      if (event.IdUser === array[index].idUser.S) {
        let ritmo = +array[index].ritmo.N;
        ritmo = Math.round(ritmo);
        ritmo = parseFloat(ritmo.toFixed(2));
        let tiempo = +array[index].tiempo.N;
        tiempo = Math.round(tiempo);
        tiempo = parseFloat(tiempo.toFixed(2));
        dataSensors.push({
          ritmo: ritmo,
          repeticion: +array[index].repeticion.N,
          tiempo: tiempo,
          dateTime: array[index].dateTime.S,
        });
      }
    }
    dataSensors.sort(dynamicSort("dateTime"));
    return dataSensors;
  } catch (e) {
    console.log("Failure", e.message);
  }
}

function dynamicSort(property) {
  let sortOrder = 1;

  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function (a, b) {
    let result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}
