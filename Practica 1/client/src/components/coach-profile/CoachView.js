import React, { useState, useEffect } from "react";
import AthleteCard from "./AthleteCardView";
import { useParams } from "react-router-dom";
import UserInfo from "../nav-bar/UserInfoView";

export default function Coach(props) {
  let { id } = useParams();
  console.log(id);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <UserInfo />
          <hr></hr>
          <div className="row">
            {data.results ? (
              data.results.map((pokemon) => <AthleteCard data={pokemon} />)
            ) : (
              <div>Cargando</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
