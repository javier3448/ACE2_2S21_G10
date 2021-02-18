import React from 'react';

export default function UserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return (
        <div className="row">
            <div className="col">
                <h1>{userInfo.nombre + " " + userInfo.apellidos}</h1>
                <h6>{userInfo.tipo.toUpperCase()}</h6>
            </div>
        </div>
    );
}