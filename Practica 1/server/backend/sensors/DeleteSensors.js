const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

exports.handler = (event, context, callback) => {
  const params = {
    Key: {
      idSensors: {
        S: event.idSensors,
      },
    },
    TableName: "Sensors",
  };
  dynamodb.deleteItem(params, function (err, data) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      console.log(data);
      callback(null, data);
    }
  });
};
