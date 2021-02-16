const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

exports.handler = (event, context, callback) => {
  const params = {
    TableName: "Users",
  };

  dynamodb.scan(params, function (err, data) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      let array = data.Items;
      let length = array.length;
      let dataUsers = [];

      for (let index = 0; index < length; index++) {
        if (event.asignacion === array[index].asignacion.S) {
          dataUsers.push(array[index]);
        }
      }

      let items = null;
      if (dataUsers.length > 0) {
        items = dataUsers.map((dataField) => {
          return {
            IdUser: dataField.IdUser.S,
            nombre: dataField.nombre.S,
            apellidos: dataField.apellidos.S,
            altura: +dataField.altura.N,
            peso: +dataField.peso.N,
            carnet: +dataField.carnet.N,
            username: dataField.username.S,
            password: dataField.password.S,
            tipo: dataField.tipo.S,
            asignacion: dataField.asignacion.S,
          };
        });
      }

      callback(null, items);
    }
  });
};
