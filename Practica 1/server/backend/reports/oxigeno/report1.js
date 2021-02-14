const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

exports.handler = (event, context, callback) => {
  console.log("Welcome to report1 oxigeno!");
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
      let dataOxigeno = [];
      for (let index = 0; index < length; index++) {
        if (event.idUser === array[index].idUser.S) {
          dataOxigeno.push(+array[index].oxigeno.N);
        }
      }
      let items = null;
      if (dataOxigeno.length > 0) {
        items = dataOxigeno.map((dataField) => {
          return { oxigeno: dataField };
        });
      }

      callback(null, items);
    }
  });
};
