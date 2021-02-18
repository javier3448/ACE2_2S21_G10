import React, { useState, useEffect } from "react";
import AthleteCard from "./AthleteCardView";
import { useParams } from "react-router-dom";
import UserInfo from "../nav-bar/UserInfoView";
import axios from "axios";
import { urlServer } from "../../config";

export default function Coach() {
  //let { id } = useParams();
  //console.log(id);
  const [data, setData] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  // Carga los atletas que están a cargo del coach
  useEffect(() => {
    axios.get(urlServer + `users/show/${userInfo.username}`)
      .then((response) => setData(response.data))
  }, []);
  //
  return (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <UserInfo />
          <hr></hr>
          <div className="row">
            {data.length > 0 ? (
              data.map((athlete) => <AthleteCard key={athlete.IdUser.substring(0,4)} data={athlete} />)
            ) : (
              <div>Cargando</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
