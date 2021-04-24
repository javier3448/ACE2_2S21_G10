import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { urlServer } from '../../../config';
import { useInterval } from '../../../services/interval';
import TimeView from '../../nav-bar/TimeView';
import UserInfo from '../../nav-bar/UserInfoView';
import ItemList from './ItemList';
import Vo2History from './Vo2History';

const AllMeasure = () => {
  const params = useParams();
  const [tests, setTests] = useState([]);
  const [showTest, setShowTest] = useState(-1);

  useEffect(() => {
    axios.get(urlServer + `sensorsv2/${params.id}`)
      .then((response) => {
        if (response.data.length) {
          // Recupera la información
          const dataSet = response.data;
          dataSet.reverse();
          setTests(dataSet.map(value => { return { prueba: value.prueba, date: new Date(value.result[0].dateTime) } }));
        } else {
          alert('sin datos');
        }
      })
      .catch(() => alert('no se pudo recuperar la información'));
  }, []);

  const WhichTest = () => {
    if (showTest > 0) {
      return <Vo2History noTest={showTest} />
    } else if (showTest === 0) {
      return <div>Recarge la página.</div>
    } else {
      return <div>Recarge la página.</div>
    } 
  }

  return (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <div className="row">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              <h1>Vo2Max - Pruebas</h1>
            </div>
            <TimeView />
            <hr />
          </div>
          <div className="row">
            <div className="col-lg-3 col-sm-12 col-xs-12">
              <div className="list-group border border-dark">
                <div className="list-group-item bg-dark text-light">
                  <div className="row">
                    <div className="col-3 text-begin">Prueba</div>
                    <div className="col-9 text-end">Marca de tiempo</div>
                  </div>
                </div>
                <ItemList
                  key={'_##-1' + Math.random() * 999}
                  onPruebaChange={setShowTest}
                  prueba={-1}
                  date={new Date()} />
                {tests.length ?
                  (tests.map((prueba) =>
                    <ItemList
                      key={'_##' + prueba + Math.random() * 999}
                      onPruebaChange={setShowTest}
                      prueba={prueba.prueba}
                      date={prueba.date} />
                  )) : ("")}
              </div>
            </div>
            <div className="col-lg-9 col-sm-12 col-xs-12">
              <WhichTest />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllMeasure;