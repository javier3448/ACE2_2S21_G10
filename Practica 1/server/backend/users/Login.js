const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

exports.handler = (event, context, callback) => {
  console.log("Welcome to login!");
  let username = event.username;
  let password = event.password;
  const params = {
    Key: {
      username: {
        S: username,
      },
      password: {
        S: password,
      },
    },
    TableName: "Users",
  };

  dynamodb.getItem(params, function (err, data) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      console.log(data);

      const items = [
        {
          IdUser: data.Item.IdUser.S,
          nombre: data.Item.nombre.S,
          apellidos: data.Item.apellidos.S,
          altura: +data.Item.altura.N,
          peso: +data.Item.peso.N,
          carnet: +data.Item.carnet.N,
          username: data.Item.username.S,
          password: data.Item.password.S,
          tipo: data.Item.tipo.S,
          asignacion: data.Item.asignacion.S,
          sexo: data.Item.sexo.S,
          edad: data.Item.edad.N
        },
      ];

      callback(null, items);
    }
  });
};
