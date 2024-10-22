import React from 'react';
import axios from 'axios';
import { Login } from './componentes/Login';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { BarraNavegacion } from '../componentes/BarraNavegacion';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:8000"
});


export function Sesion() {
    
    return (
        <div className='sesion'>
            <div>
                <BarraNavegacion/>
            
                <div className='container'>
                    <Login/>
                </div>
            </div>
        </div>
    )
}
