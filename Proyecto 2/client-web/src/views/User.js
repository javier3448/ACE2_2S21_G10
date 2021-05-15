import NavBar from 'components/navbar/NavBar';
import React from 'react';

const User = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className="vh-100">
        <div className="h-100">
          <div role="main" className="container">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default User;