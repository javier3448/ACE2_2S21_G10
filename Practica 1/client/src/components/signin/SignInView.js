import React, { useState } from "react";
import { urlServer } from "../../config";
import PropTypes from 'prop-types'
import axios from 'axios';

async function signIn(credentials) {
    const res = await axios.get(urlServer + `login/${credentials.username}/${credentials.password}`);
    // const obj = eval("(" + JSON.stringify(res) + ")");
    // const parseado = JSON.stringify(obj);
    // const data = JSON.parse(parseado).data;
    const data = res.data;
    return data;
}

export default function SignIn(/*{setToken}*/) {
    const [username, setUser] = useState();
    const [password, setPass] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const infoUser = await signIn({
                username, password
            });            
            sessionStorage['infoUser'] = infoUser;
            this.props.history.push('coach');
        } catch (error) {
        }
    }

    return (
        <div className="container vh-100">
            <div className="row align-items-center h-100">
                <div className="col-1"></div>
                <form className="col-10 border border-info rounded" onSubmit={handleSubmit}>
                    <div className="row mt-4">
                        <span className="col-lg-2 col-xs-0 col-sm-0"></span>
                        <h3 className="col-lg-8 col-xs-12 col-sm-12 text-center">Iniciar sesión</h3>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username"></label>
                        <input onChange={e => setUser(e.target.value)} type="text" className="form-control" id="username" name="username" required placeholder="Usuario"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"></label>
                        <input onChange={e => setPass(e.target.value)} type="password" className="form-control" id="password" name="password" required placeholder="Contraseña"></input>
                    </div>
                    <div className="d-grid gap-2 my-4">
                        <button type="submit" className="btn btn-outline-primary">Iniciar sesión</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

//SingIn.propTypes = {
    //setToken: PropTypes.func.isRequired
//}