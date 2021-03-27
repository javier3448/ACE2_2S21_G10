const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

exports.handler = (event, context, callback) => {
  console.log("Welcome to report distancia alcanzada!");
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
      let dataDistancia = [];
      for (let index = 0; index < length; index++) {
        if (event.idUser === array[index].idUser.S) {
          dataDistancia.push({
            distancia: +array[index].distancia.N,
            repeticion: +array[index].repeticion.N,
            dateTime: array[index].dateTime.S,
          });
        }
      }
      let items = null;
      dataDistancia.sort(dynamicSort("dateTime"));
      let result = calculateData(dataDistancia);
      if (result.length > 0) {
        items = result;
      }
      callback(null, items);
    }
  });
};

function getReport(tempo, repeticion) {
  const sumatoria = (arr) => arr.reduce((p, c) => p + c, 0);
  let sum = sumatoria(tempo);
  sum = sum.toFixed(2);
  let result = { distancia: sum, repeticion: repeticion };

  return result;
}

function calculateData(dataDistancia) {
  let index = 0;
  let temporal = [];
  let result = [];
  while (true) {
    if (index > dataDistancia.length - 1) {
      break;
    }
    if (index + 1 > dataDistancia.length - 1) {
      if (dataDistancia.length === 1) {
        temporal.push(dataDistancia[index].distancia);
        result.push(getReport(temporal, dataDistancia[index].repeticion));
        break;
      } else {
        if (
          dataDistancia[index - 1].repeticion ===
          dataDistancia[index].repeticion
        ) {
          temporal.push(dataDistancia[index].distancia);
          result.push(getReport(temporal, dataDistancia[index].repeticion));
          break;
        } else {
          temporal.push(dataDistancia[index].distancia);
          result.push(getReport(temporal, dataDistancia[index].repeticion));
          break;
        }
      }
    }
    if (
      dataDistancia[index].repeticion === dataDistancia[index + 1].repeticion
    ) {
      temporal.push(dataDistancia[index].distancia);
    } else if (
      dataDistancia[index].repeticion != dataDistancia[index + 1].repeticion
    ) {
      temporal.push(dataDistancia[index].distancia);
      result.push(getReport(temporal, dataDistancia[index].repeticion));
      temporal = [];
    }
    index += 1;
  }
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
