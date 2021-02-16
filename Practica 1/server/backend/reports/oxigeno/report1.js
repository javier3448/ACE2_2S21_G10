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
          dataOxigeno.push({
            oxigeno: +array[index].oxigeno.N,
            dateTime: array[index].dateTime.S,
          });
        }
      }
      let items = null;
      dataOxigeno.sort(dynamicSort("dateTime"));
      if (dataOxigeno.length > 0) {
        items = dataOxigeno.map((dataField) => {
          return { oxigeno: dataField.oxigeno, dateTime: dataField.dateTime };
        });
      }

      callback(null, items);
    }
  });
};

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
