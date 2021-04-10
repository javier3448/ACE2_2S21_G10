import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { urlServer } from '../../../../config';
import LapHView from './LapHView';
export default function WeekHView(props) {
  const [data, setData] = useState();
  useEffect(async () => {
    axios.get(urlServer + `get-fechas-report/${props.idUser}`)
      .then((response) => {
        if(response.data) {
          setData(response.data.result);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }, [])

  return (
    <>
      <h4 className="text-center">04/04/2021 - 10/04/2021</h4>
      <div className="accordion accordion-flush" id="lapWeeks">
        {data ? (
          data.map((result, index) => 
          <LapHView key={"key__" + index} id={"__" + index} i={index} parent={"lapWeeks"}
            result={result}
          />)
        ) : (
          <div>Cargando</div>
        )}
      </div>
    </>
  )
}