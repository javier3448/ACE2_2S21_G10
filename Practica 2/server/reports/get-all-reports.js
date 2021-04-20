const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});



exports.handler = (event, context, callback) => {
  console.log("Welcome to get report max-min exhaldo!");
  const params = {
    TableName: "SensorsV2",
  };

  dynamodb.scan(params, function (err, data) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      console.log(data);
      let array = data.Items;
      let length = array.length;
      let dataSensors = [];
      for (let index = 0; index < length; index++) {
        if (event.idUser === array[index].idUser.S) {
          dataSensors.push({
            exhalado: +array[index].exhalado.N,
            inhalado: +array[index].inhalado.N,
            vo2max: +array[index].vo2.N,
            prueba: +array[index].prueba.N,
            dateTime: array[index].dateTime.S,
          });
        }
      }
      let items = null;
      dataSensors.sort(dynamicSort("dateTime"));
      let result = calculateData(dataSensors);
      if (result.length > 0) {
        items = result;
      }
      callback(null, items);
    }
  });
};


function calculateData(dataSensors) {
  let index = 0;
  let inhalados = [];
  let exhalados = [];
  let dataTempo = null;
  let result = [];
  while (true) {
    if (index > dataSensors.length - 1) {
      break;
    }
/******************************************************* ********************************************************************************/
    if (index + 1 > dataSensors.length - 1) {
      if (dataSensors.length === 1) {
        inhalados.push(dataSensors[index].inhalado);
        exhalados.push(dataSensors[index].exhalado);
        let vo2max = dataSensors[index].vo2max;
        let dateTime = dataSensors[index].dateTime;
        let prueba = dataSensors[index].prueba;
        dataTempo = getResults(inhalados,exhalados,vo2max,prueba,dateTime);
        result.push(dataTempo);
        break;
      } else {
        if (dataSensors[index - 1].prueba === dataSensors[index].prueba) {
          inhalados.push(dataSensors[index].inhalado);
          exhalados.push(dataSensors[index].exhalado);
          let vo2max = dataSensors[index].vo2max;
          let dateTime = dataSensors[index].dateTime;
          let prueba = dataSensors[index].prueba;
          dataTempo = getResults(inhalados,exhalados,vo2max,prueba,dateTime);
          result.push(dataTempo);
          break;
        } else {
          inhalados.push(dataSensors[index].inhalado);
          exhalados.push(dataSensors[index].exhalado);
          let vo2max = dataSensors[index].vo2max;
          let dateTime = dataSensors[index].dateTime;
          let prueba = dataSensors[index].prueba;
          dataTempo = getResults(inhalados,exhalados,vo2max,prueba,dateTime);
          result.push(dataTempo);
          break;
        }
      }
    }
/******************************************************** ********************************************************************************/
    if (dataSensors[index].prueba === dataSensors[index + 1].prueba) {
      inhalados.push(dataSensors[index].inhalado);
      exhalados.push(dataSensors[index].exhalado);
    } else if (dataSensors[index].prueba != dataSensors[index + 1].prueba) {

      inhalados.push(dataSensors[index].inhalado);
      exhalados.push(dataSensors[index].exhalado);
      let vo2max = dataSensors[index].vo2max;
      let dateTime = dataSensors[index].dateTime;
      let prueba = dataSensors[index].prueba;
      dataTempo = getResults(inhalados,exhalados,vo2max,prueba,dateTime);
      result.push(dataTempo);
      inhalados = [];
      exhalados = [];
    }
    index += 1;
  }
  return result;
}

function getResults(inhalados, exhalados, vo2max, prueba, dateTime) {
  let minInhalado = Math.min.apply(Math, inhalados);
  let maxInhalado = Math.max.apply(Math, inhalados);
  let minExhalado = Math.min.apply(Math, exhalados);
  let maxExhalado = Math.max.apply(Math, exhalados);
  let sumInhalado = 0;
  let sumExhalado = 0;
  for (let index = 0; index < inhalados.length; index++) {
    sumInhalado += inhalados[index];
  }
  let avgInhalado = sumInhalado/inhalados.length;
  avgInhalado = avgInhalado.toFixed(2);
  for (let index = 0; index < exhalados.length; index++) {
    sumExhalado += exhalados[index];
  }
  let avgExhalado = sumExhalado/exhalados.length;
  avgExhalado = avgExhalado.toFixed(2);
  let result = {minInhalado: minInhalado, 
                maxInhalado: maxInhalado,
                minExhalado: minExhalado,
                maxExhalado: maxExhalado,
                avgInhalado: avgInhalado,
                avgExhalado: avgExhalado,
                vo2max: vo2max,
                prueba: prueba,
                dateTime: dateTime}
  return result;
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
