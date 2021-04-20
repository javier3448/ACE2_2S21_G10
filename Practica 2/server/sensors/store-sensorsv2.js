const AWS = require("aws-sdk");
const moment = require("moment-timezone");
const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

exports.handler = (event, context, callback) => {
  let date = new Date();
  let dateTime = moment(date.getTime()).tz("America/Guatemala").format("YYYY-MM-DD HH:mm:ss");
  const params = {
    Item: {
      idSensors: {
        S: context.awsRequestId,
      },
      exhalado: {
        N: event.exhalado,
      },
      inhalado: {
        N: event.inhalado,
      },
      vo2: {
        N: event.vo2,
      },
      prueba: {
        N: event.prueba
      },
      idUser: {
        S: event.idUser,
      },
      dateTime: {
        S: dateTime,
      },
    },
    TableName: "SensorsV2",
  };
  dynamodb.putItem(params, function (err, data) {
    if (err) {
      console.log(err);
      callback();
    } else {
      console.log("Se inserto la data");
      callback(null, "Se inserto la data");
    }
  });
};