const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

exports.handler = (event, context, callback) => {
  console.log("Welcome to report3 ritmo cardiaco!");
  const params = {
    TableName: "Sensors",
  };

  dynamodb.scan(params, function (err, data) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      
      console.log(data);
      let count = 0; 
      let array = data.Items;
      let element = 0
      for (let index = 0; index < array.length; index++) {
        if (event.idUser === array[index].idUser.S){
          element += +array[index].ritmo.N;
        }
      }
      element = element/array.length;
      callback(null, {promedioRitmo: element});
    }
  });
};