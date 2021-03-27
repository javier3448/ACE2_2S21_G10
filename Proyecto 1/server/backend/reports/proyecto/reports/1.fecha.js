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
      let dataFallos = [];
      for (let index = 0; index < length; index++) {
        if (event.idUser === array[index].idUser.S) {
          dataFallos.push({
            fallo: +array[index].falla.N,
            repeticion: +array[index].repeticion.N,
            dateTime: array[index].dateTime.S,
          });
        }
      }
      let items = null;
      dataFallos.sort(dynamicSort("dateTime"));
      let result = calculateData(dataFallos);
      //   console.log(result);

      callback(null, result);
    }
  });
};

function calculateData(dataFallos) {
  let index = 0;
  let countEntrenamientos = 0;
  let banderita = false;
  let entrenamiento = "entrenamiento ";
  let temporal = [];
  let result = [];
  while (true) {
    if (index > dataFallos.length - 1) {
      break;
    }

    /***************************************************************************************************************************/
    if (index + 1 > dataFallos.length - 1) {
      if (dataFallos[index].fallo === 0) {
        if (dataFallos[index].repeticion === 21) {
          entrenamiento = "entrenamiento " + countEntrenamientos;
          let dataResult = {
            fallos: "No",
            aprobo: "Si",
            repeticiones: dataFallos[index].repeticion,
            hora: dataFallos[index].dateTime,
            entrenamiento: entrenamiento,
          };
          temporal.push(dataFallos[index].repeticion);
          result.push(dataResult);
          break;
        } else {
          entrenamiento = "entrenamiento " + countEntrenamientos;
          let dataResult = {
            fallos: "No",
            aprobo: "No",
            repeticiones: dataFallos[index].repeticion,
            hora: dataFallos[index].dateTime,
            entrenamiento: entrenamiento,
          };
          temporal.push(dataFallos[index].repeticion);
          result.push(dataResult);
          break;
        }
      } else {
        entrenamiento = "entrenamiento " + countEntrenamientos;
        let dataResult = {
          fallos: "Si",
          aprobo: "No",
          repeticiones: dataFallos[index].repeticion,
          hora: dataFallos[index].dateTime,
          entrenamiento: entrenamiento,
        };
        temporal.push(dataFallos[index].repeticion);
        result.push(dataResult);
        break;
      }
    }
    /*********************************************************************************************************************************/
    if (
      dataFallos[index].repeticion === 1 &&
      dataFallos[index + 1].repeticion != 1
    ) {
      banderita = true;
      entrenamiento += countEntrenamientos;
    }
    if (banderita) {
      if (dataFallos[index].repeticion === dataFallos[index + 1].repeticion) {
      } else if (
        dataFallos[index].repeticion != dataFallos[index + 1].repeticion
      ) {
        if (dataFallos[index + 1].repeticion === 1) {
          if (dataFallos[index].fallo === 0) {
            if (dataFallos[index].repeticion === 21) {
              let dataResult = {
                fallos: "No",
                aprobo: "Si",
                repeticiones: dataFallos[index].repeticion,
                hora: dataFallos[index].dateTime,
                entrenamiento: entrenamiento,
              };
              temporal.push(dataFallos[index].repeticion);
              result.push(dataResult);
              banderita = false;
              entrenamiento = "entrenamiento ";
              countEntrenamientos += 1;
            } else {
              let dataResult = {
                fallos: "Si",
                aprobo: "No",
                repeticiones: dataFallos[index].repeticion,
                hora: dataFallos[index].dateTime,
                entrenamiento: entrenamiento,
              };
              temporal.push(dataFallos[index].repeticion);
              result.push(dataResult);
              banderita = false;
              entrenamiento = "entrenamiento ";
              countEntrenamientos += 1;
            }
          } else {
            let dataResult = {
              fallos: "Si",
              aprobo: "No",
              repeticiones: dataFallos[index].repeticion,
              hora: dataFallos[index].dateTime,
              entrenamiento: entrenamiento,
            };
            temporal.push(dataFallos[index].repeticion);
            result.push(dataResult);
            banderita = false;
            entrenamiento = "entrenamiento ";
            countEntrenamientos += 1;
          }
        }
      }
    }
    /******************************************************************************************************************************************************/
    index += 1;
  }
  /*********************************************************************************************************************************/
  let result2 = null;
  if (result.length === 0) {
    result.push({
      fallos: 0,
      repeticiones: 0,
      entrenamiento: "No hay entrenamientos",
    });
  } else {
    let max = Math.max.apply(Math, temporal);
    let min = Math.min.apply(Math, temporal);
    const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;
    let prom = average(temporal);
    result2 = { result: result, max: max, min: min, prom: prom };
    //   console.log(result2);
  }
  return result2;
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
