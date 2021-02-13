import NavBar from "../nav-bar/NavBarView";
import AthleteCard from "./AthleteCardView";

export default function Coach() {
    return (
        <div className="vh-100">
            <div className="h-100">
                <div role="main" className="container">
                    <div className="row">
                        <div className="col">
                            <h1>Usuario</h1>
                            <h6>Tipo usuario</h6>
                        </div>
                        <div className="col" align="right">
                            <h4>16:52 hrs</h4>
                            <h5>11/02/2021</h5>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                        <AthleteCard></AthleteCard>
                        <AthleteCard></AthleteCard>
                        <AthleteCard></AthleteCard>
                        <AthleteCard></AthleteCard>
                    </div>
                </div>
            </div>
        </div >
    );
}