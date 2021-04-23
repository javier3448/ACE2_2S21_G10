import React from 'react';
import UserInfo from '../../nav-bar/UserInfoView';

const AllMeasure = () => {
  return(
    <div className="vh-100">
      <div className="h-100">
        <div role="main" className="container">
          <UserInfo />
          <hr />
        </div>
      </div>
    </div>
  );
}

export default AllMeasure;