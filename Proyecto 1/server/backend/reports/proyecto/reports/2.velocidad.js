const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

let temporal = [];
let temporalVelocidad = [];
let result = [];

exports.handler = (event, context, callback) => {
  console.log("Welcome to report velocidad alcanzada!");
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
      let dataVelocidad = [];
      for (let index = 0; index < length; index++) {
        if (event.idUser === array[index].idUser.S) {
          dataVelocidad.push({
            tiempo: +array[index].tiempo.N,
            repeticion: +array[index].repeticion.N,
            velocidad: +array[index].velocidad.N,
            dateTime: array[index].dateTime.S,
          });
        }
      }
      let items = null;
      dataVelocidad.sort(dynamicSort("dateTime"));
      dataVelocidad = calculateData(dataVelocidad);
      if (result.length > 0) {
        items = result.map((dataField) => {
          return {
            max: dataField.max,
            min: dataField.min,
            avgtiempo: dataField.avgtiempo,
            avgvelocidad: dataField.avgvelocidad,
            repeticion: dataField.repeticion,
          };
        });
      }
      result = [];
      temporal = [];
      temporalVelocidad = [];
      callback(null, items);
    }
  });
};

function getReport(tempo, repeticion, velocidad) {
  let min = Math.min.apply(Math, tempo);
  let max = Math.max.apply(Math, tempo);
  const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;
  let avgtiempo = average(tempo);
  let avgvelocidad = average(velocidad);
  result.push({
    max: max,
    min: min,
    avgtiempo: avgtiempo,
    avgvelocidad: avgvelocidad,
    repeticion: repeticion,
  });
  return;
}

function calculateData(dataVelocidad) {
  let index = 0;
  while (true) {
    if (index > dataVelocidad.length - 1) {
      break;
    }
    if (index + 1 > dataVelocidad.length - 1) {
      if (dataVelocidad.length === 1) {
        temporal.push(dataVelocidad[index].tiempo);
        temporalVelocidad.push(dataVelocidad[index].velocidad);
        getReport(temporal, dataVelocidad[index].repeticion, temporalVelocidad);
        break;
      } else {
        if (
          dataVelocidad[index - 1].repeticion ===
          dataVelocidad[index].repeticion
        ) {
          temporal.push(dataVelocidad[index].tiempo);
          temporalVelocidad.push(dataVelocidad[index].velocidad);
          getReport(
            temporal,
            dataVelocidad[index].repeticion,
            temporalVelocidad
          );
          break;
        } else {
          temporal.push(dataVelocidad[index].tiempo);
          temporalVelocidad.push(dataVelocidad[index].velocidad);
          getReport(
            temporal,
            dataVelocidad[index].repeticion,
            temporalVelocidad
          );
          break;
        }
      }
    }
    if (
      dataVelocidad[index].repeticion === dataVelocidad[index + 1].repeticion
    ) {
      temporal.push(dataVelocidad[index].tiempo);
      temporalVelocidad.push(dataVelocidad[index].velocidad);
    } else if (
      dataVelocidad[index].repeticion != dataVelocidad[index + 1].repeticion
    ) {
      temporal.push(dataVelocidad[index].tiempo);
      temporalVelocidad.push(dataVelocidad[index].velocidad);
      getReport(temporal, dataVelocidad[index].repeticion, temporalVelocidad);
      temporal = [];
      temporalVelocidad = [];
    }
    index += 1;
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
