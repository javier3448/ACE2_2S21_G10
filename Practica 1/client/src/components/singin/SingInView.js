export default function SingIn() {
    return (
        <div className="container vh-100">
            <div className="row align-items-center h-100">
                <div className="col-1"></div>
                <form className="col-10 border border-info rounded">
                    <div className="row mt-4">
                        <span className="col-lg-2 col-xs-0 col-sm-0"></span>
                        <h3 className="col-lg-8 col-xs-12 col-sm-12 text-center">Iniciar sesión</h3>
                        <div className="col-lg-2 col-xs-12 col-sm-12" align="center">
                            <span className="text-right">16:52 hrs</span><br></br>
                            <span className="text-right">11/02/2021</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="username"></label>
                        <input type="text" className="form-control" id="username" name="username" placeholder="Usuario"></input>
                    </div>
                    <div className="form-group">
                        <label for="password"></label>
                        <input type="password" className="form-control" id="password" name="password" placeholder="Contraseña"></input>
                    </div>
                    <div className="d-grid gap-2 my-4">
                        <button type="submit" className="btn btn-outline-primary">Iniciar sesión</button>
                    </div>
                </form>
            </div>
        </div>
    );
}