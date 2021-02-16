import TimeView from "../nav-bar/TimeView";

export default function Profile() {
    return (
        <div className="vh-100">
            <div className="h-100">
                <div role="main" className="container">
                    <div className="row">
                        <div className="col">
                            <h1>Usuario</h1>
                            <h6>Tipo usuario</h6>
                        </div>
                        <TimeView></TimeView>
                    </div>
                    <div className="card card-body">
                        <div className="row">
                            <div className="from-group col-md-6">
                                <label>Nombres</label>
                                <input className="form-control" readOnly value="" />
                            </div>
                            <div className="from-group col-md-6">
                                <label>Apellidos</label>
                                <input className="form-control" readOnly value="" />
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
                                <input className="form-control" readOnly value="" />
                            </div>
                            <div className="from-group col-md-6 col-xs-12">
                                <label>Estatura</label>
                                <input className="form-control" readOnly value="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}