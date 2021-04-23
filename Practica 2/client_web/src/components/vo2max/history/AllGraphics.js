import React, {useState} from 'react';
import Exhaled from './Exhaled';
import Inhaled from './Inhaled';
import Vo2Max from './Vo2Max';
import TimeView from '../../nav-bar/TimeView';

const AllGraphics = () => {
  const [atleta, setAtleta] = useState(JSON.parse(localStorage.getItem('userInfo')).IdUser);
  return (
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <div className="row">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              <h1>Vo2Max</h1>
            </div>
            <TimeView />
          </div>
          <div className="row my-4">
            <div className="col">
              <Exhaled idUser={atleta.idUser} />
            </div>
          </div>
          <div className="row my-4">
            <div className="col">
              <Inhaled idUser={atleta.idUser} />
            </div>
          </div>
          <div className="row my-4">
            <div className="col">
              <Vo2Max idUser={atleta.idUser} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllGraphics;