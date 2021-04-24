const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});



exports.handler = (event, context, callback) => {
  console.log("Welcome to get all inhalado y exhalado!");
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
            volumen: +array[index].volumen.N,
            direccion: +array[index].direccion.N,
            tiempo: +array[index].tiempo.N,
            prueba: +array[index].prueba.N,
            dateTime: array[index].dateTime.S,
          });
        }
      }
      console.log(dataSensors);
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
  let temporal = [];
  let dataTempo = null;
 
  let result = [];
  while (true) {
     let inhalado = null;
     let exhalado = null;
    if (index > dataSensors.length - 1) {
      break;
    }
/******************************************************* ********************************************************************************/
    if (index + 1 > dataSensors.length - 1) {
      if (dataSensors.length === 1) {
        if(dataSensors[index].direccion === 0){
            exhalado = dataSensors[index].volumen;
          }else{
            inhalado = dataSensors[index].volumen;
          }
        dataTempo = {inhalado: inhalado,
                   exhalado: exhalado,
                   tiempo: dataSensors[index].tiempo,
                   volumen: dataSensors[index].volumen,
                   dateTime: dataSensors[index].dateTime};
        temporal.push(dataTempo);
        result.push({result: temporal, prueba: dataSensors[index].prueba});
        break;
      } else {
        if (dataSensors[index - 1].prueba === dataSensors[index].prueba) {
          if(dataSensors[index].direccion === 0){
            exhalado = dataSensors[index].volumen;
          }else{
            inhalado = dataSensors[index].volumen;
          }
          dataTempo = {inhalado: inhalado,
                   exhalado: exhalado,
                   tiempo: dataSensors[index].tiempo,
                   volumen: dataSensors[index].volumen,
                   dateTime: dataSensors[index].dateTime};
          temporal.push(dataTempo);
          result.push({result: temporal, prueba: dataSensors[index].prueba});
          break;
        } else {
          if(dataSensors[index].direccion === 0){
            exhalado = dataSensors[index].volumen;
          }else{
            inhalado = dataSensors[index].volumen;
          }
          dataTempo = {inhalado: inhalado,
                   exhalado: exhalado,
                   tiempo: dataSensors[index].tiempo,
                   volumen: dataSensors[index].volumen,
                   dateTime: dataSensors[index].dateTime};
          temporal.push(dataTempo);
          result.push({result: temporal, prueba: dataSensors[index].prueba});
          break;
        }
      }
    }
/******************************************************** ********************************************************************************/
    if (dataSensors[index].prueba === dataSensors[index + 1].prueba) {
      if(dataSensors[index].direccion === 0){
            exhalado = dataSensors[index].volumen;
      }else{
            inhalado = dataSensors[index].volumen;
      }
      dataTempo = {inhalado: inhalado,
                   exhalado: exhalado,
                   tiempo: dataSensors[index].tiempo,
                   volumen: dataSensors[index].volumen,
                   dateTime: dataSensors[index].dateTime};
      temporal.push(dataTempo);
    } else if (dataSensors[index].prueba != dataSensors[index + 1].prueba) {
          if(dataSensors[index].direccion === 0){
            exhalado = dataSensors[index].volumen;
          }else{
            inhalado = dataSensors[index].volumen;
          }
      dataTempo = {inhalado: inhalado,
                   exhalado: exhalado,
                   tiempo: dataSensors[index].tiempo,
                   volumen: dataSensors[index].volumen,
                   dateTime: dataSensors[index].dateTime};

      temporal.push(dataTempo);
      dataTempo = {result: temporal, prueba: dataSensors[index].prueba};
      result.push(dataTempo);
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
