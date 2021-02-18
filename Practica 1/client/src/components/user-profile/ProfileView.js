import UserInfo from "../nav-bar/UserInfoView";

export default function Profile() {
  // Recupera la variabla de sesión que contiene
  // la información del usuario
  const infoUser = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <UserInfo />
          <div className="card card-body">
            <div className="row">
              <div className="from-group col-md-6">
                <label>Nombres</label>
                <input
                  className="form-control"
                  readOnly
                  value={infoUser.nombre}
                />
              </div>
              <div className="from-group col-md-6">
                <label>Apellidos</label>
                <input
                  className="form-control"
                  readOnly
                  value={infoUser.apellidos}
                />
              </div>
            </div>
            <div className="row">
              <div className="from-group col-md-6 col-xs-12">
                <label>Edad</label>
                <input className="form-control" readOnly value="" />
              </div>
              <div className="from-group col-md-6 col-xs-12">
                <label>Sexo</label>
                <input className="form-control" readOnly value="" />
              </div>
            </div>
            <div className="row">
              <div className="from-group col-md-6 col-xs-12">
                <label>Peso</label>
                <input
                  className="form-control"
                  readOnly
                  value={infoUser.peso + " lbs."}
                />
              </div>
              <div className="from-group col-md-6 col-xs-12">
                <label>Estatura</label>
                <input
                  className="form-control"
                  readOnly
                  value={infoUser.altura + " m."}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
