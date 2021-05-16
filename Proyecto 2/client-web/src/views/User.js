import InfoUser from 'components/info-user/InfoUser';
import NavBar from 'components/navbar/NavBar';
import React from 'react';

const User = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className="vh-100">
        <div className="h-100">
          <div role="main" className="container">
            <div className="d-flex justify-content-between align-items-center my-2">
              <h1>WristSmart</h1>
              <InfoUser />
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default User;