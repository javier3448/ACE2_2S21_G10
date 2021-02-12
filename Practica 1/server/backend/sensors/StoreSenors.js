const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

exports.handler = (event, context, callback) => {
  const params = {
    Item: {
      idSensors: {
        S: context.awsRequestId,
      },
      temperatura: {
        N: event.temperatura,
      },
      ritmo: {
        N: event.ritmo,
      },
      oxigeno: {
        N: event.oxigeno,
      },
      idUser: {
        S: event.idUser,
      },
    },
    TableName: "Sensors",
  };
  dynamodb.putItem(params, function (err, data) {
    if (err) {
      console.log(err);
      callback();
    } else {
      console.log(data);
      callback(null, data);
    }
  });
};
