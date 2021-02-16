export default function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3">
            <div className="container gap-1 p-2">
                <a href='/dashboard' className="btn btn-outline-light col-lg-3 col-sm-5">
                    <i className="fa fa-heartbeat"></i>
                    <span> Dashboard</span>
                </a>
                <a href='/info-user' className=" btn btn-outline-light col-lg-3 col-sm-5">
                    <i className="fa fa-user"></i>
                    <span> Perfil</span>
                </a>
                <a href='/coach' className=" btn btn-outline-light col-lg-3 col-sm-5">
                    <i className="fa fa-users"></i>
                    <span> Atletas</span>
                </a>
                <a className=" btn btn-outline-light col-lg-3 col-sm-5">
                    <i className="fa fa-sign-out-alt"></i>
                    <span> Salir</span>
                </a>
            </div>
        </nav>
    );
}