import React from 'react';
import axios from 'axios';
import { Login } from './componentes/Login';
import { Footer } from '../componentes/Footer';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:8000"
});


export function Sesion() {
    
    return (
        <div className='sesion'>
            <div className='cont-sesion'>
                <Login/>
            </div>
        </div>
    )
}
