const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

exports.handler = (event, context, callback) => {
  console.log("Welcome to report4 temperatura!");
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
     
      // Ordena los elementos 
      for (let i = 0; i < length; i++) {
        for (let j = 0; j < length - i - 1; j++) {
          if (+array[j].temperatura.N > +array[j + 1].temperatura.N) {
            let temp = array[j];
            array[j] = array[j + 1];
            array[j + 1] = temp;
          }
        }
      }
      let temperaturaUserById = [];
      for (let index = 0; index < length; index++) {
          if (event.idUser === array[index].idUser.S){
              temperaturaUserById.push(+array[index].temperatura.N);
          }
          
      }
      length = temperaturaUserById.length;
      callback(null, { tempMaxima: temperaturaUserById[length-1]});
    }
  });
};
