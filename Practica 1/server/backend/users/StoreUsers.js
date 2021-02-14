const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

exports.handler = (event, context, callback) => {
  const params = {
    Item: {
      IdUser: {
        S: context.awsRequestId,
      },
      nombre: {
        S: event.nombre,
      },
      apellidos: {
        S: event.apellidos,
      },
      altura: {
        N: event.altura,
      },
      peso: {
        N: event.peso,
      },
      carnet: {
        N: event.carnet,
      },
      username: {
        S: event.username,
      },
      password: {
        S: event.password,
      },
      tipo: {
        S: event.tipo,
      },
    },
    TableName: "Users",
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
