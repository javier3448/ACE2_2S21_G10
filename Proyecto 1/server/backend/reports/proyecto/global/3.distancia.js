const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

exports.handler = (event, context, callback) => {
  const params = {
    TableName: "Sensors",
  };

  dynamodb.scan(params, function (err, data) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      console.log(data);
      let array = data.Items;
      let length = array.length;
      let dataRepeticion = [];
      for (let index = 0; index < length; index++) {
        if (event.idUser === array[index].idUser.S) {
          dataRepeticion.push({
            distancia: +array[index].distancia.N,
            repeticion: +array[index].repeticion.N,
            dateTime: array[index].dateTime.S,
          });
        }
      }
      let items = null;
      dataRepeticion.sort(dynamicSort("dateTime"));
      dataRepeticion = calculateAcumulated(dataRepeticion);
      if (dataRepeticion.length > 0) {
        items = dataRepeticion;
      }

      callback(null, items);
    }
  });
};

function calculateAcumulated(dataRepeticion) {
  let data = 0;
  let index = 0;
  let result = [];
  let temporal = [];
  while (true) {
    if (index > dataRepeticion.length - 1) {
      break;
    }

    /*********************************************************************************************************************************/
    if (index + 1 > dataRepeticion.length - 1) {
      if (dataRepeticion.length === 1) {
        result.push({
          distancia: dataRepeticion[index].distancia,
          repeticion: dataRepeticion[index].repeticion,
        });
        break;
      } else {
        if (
          dataRepeticion[index - 1].repeticion ===
          dataRepeticion[index].repeticion
        ) {
          temporal.push(dataRepeticion[index].distancia);
          let resultados = summateDistance(temporal);
          result.push({
            distancia: resultados,
            repeticion: dataRepeticion[index].repeticion,
          });
          break;
        } else {
          result.push({
            distancia: dataRepeticion[index].distancia,
            repeticion: dataRepeticion[index].repeticion,
          });
          break;
        }
      }
    }
    /*********************************************************************************************************************************/
    if (
      dataRepeticion[index].repeticion === dataRepeticion[index + 1].repeticion
    ) {
      temporal.push(dataRepeticion[index].distancia);
    } else if (
      dataRepeticion[index].repeticion != dataRepeticion[index + 1].repeticion
    ) {
      temporal.push(dataRepeticion[index].distancia);
      let resultados = summateDistance(temporal);
      result.push({
        distancia: resultados,
        repeticion: dataRepeticion[index].repeticion,
      });
      temporal = [];
    }
    index += 1;
    /*********************************************************************************************************************************/
  }
  console.log(result);
  for (let index = 0; index < result.length; index++) {
    const element = +result[index].distancia;
    data += element;
  }
  let result2 = [];
  result2.push({ result: result, distanciaTotal: data });
  return result2;
}
function summateDistance(result) {
  let data = 0;
  for (let index = 0; index < result.length; index++) {
    const element = +result[index];
    data += element;
  }
  data = data.toFixed(2);
  return data;
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
