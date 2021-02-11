export default function SingIn() {
    return (
        <div class="container vh-100">
            <div class="row align-items-center h-100">
                <div class="col-1"></div>
                <form class="col-10 border border-info rounded">
                    <div class="row mt-4">
                        <span class="col-lg-2 col-xs-0 col-sm-0"></span>
                        <h3 class="col-lg-8 col-xs-12 col-sm-12 text-center">Iniciar sesión</h3>
                        <div class="col-lg-2 col-xs-12 col-sm-12" align="center">
                            <span class="text-right">16:52 hrs</span><br></br>
                            <span class="text-right">11/02/2021</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="username"></label>
                        <input type="text" class="form-control" id="username" name="username" placeholder="Usuario"></input>
                    </div>
                    <div class="form-group">
                        <label for="password"></label>
                        <input type="password" class="form-control" id="password" name="password" placeholder="Contraseña"></input>
                    </div>
                    <div class="d-grid gap-2 my-4">
                        <button type="submit" class="btn btn-outline-primary">Iniciar sesión</button>
                    </div>
                </form>
            </div>
        </div>
    );
}