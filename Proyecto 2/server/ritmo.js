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
        if (event.IdUser === array[index].idUser.S) {
          dataDistancia.push({
            ritmo: +array[index].ritmo.N,
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

function getReport(tempo, repeticion, dateTime) {
    
  let aux = tempo;
  aux.sort(dynamicSort("ritmo"));
  let maxData = aux[aux.length-1].ritmo;
  let minData = aux[0].ritmo
  let sum = 0;
  for (let index = 0; index < tempo.length; index++) {
    sum += tempo[index].ritmo;
  }
  sum = sum/tempo.length;
  sum = sum.toFixed(2);
  let tiempo = end(dateTime);
  let result = {arrayRitmo: aux, avgRitmo: sum, maxRitmo: maxData, minRitmo: minData, repeticion: repeticion, tiempoEnMinutos: tiempo };
  
  return result;
}

function end(pasTime) {
  let endTime = new Date();
  let startTime = new Date(pasTime);
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds 
  var seconds = Math.round(timeDiff);
  let value = 60;
  seconds /= value;
  let horas = Math.round(seconds);
  return horas;
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
        temporal.push({ritmo: dataDistancia[index].ritmo});
        result.push(getReport(temporal, dataDistancia[index].repeticion, dataDistancia[index].dateTime));
        break;
      } else {
        if (
          dataDistancia[index - 1].repeticion ===
          dataDistancia[index].repeticion
        ) {
          temporal.push({ritmo: dataDistancia[index].ritmo});
          result.push(getReport(temporal, dataDistancia[index].repeticion, dataDistancia[index].dateTime));
          break;
        } else {
          temporal.push({ritmo: dataDistancia[index].ritmo});
          result.push(getReport(temporal, dataDistancia[index].repeticion, dataDistancia[index].dateTime));
          break;
        }
      }
    }
    if (
      dataDistancia[index].repeticion === dataDistancia[index + 1].repeticion
    ) {
      temporal.push({ritmo: dataDistancia[index].ritmo});
    } else if (
      dataDistancia[index].repeticion != dataDistancia[index + 1].repeticion
    ) {
      temporal.push({ritmo: dataDistancia[index].ritmo});
      result.push(getReport(temporal, dataDistancia[index].repeticion, dataDistancia[index].dateTime));
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
