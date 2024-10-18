import React from 'react';
import axios from 'axios';
import { Login } from './componentes/Login';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

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
                <Navbar expand="sm" className="navsesion">
                    <Container className='ajuste'>
                        <Navbar.Brand href='/'><img src="/logo.png" width="50" height="50" className="d-inline-block align-top" alt="logoReci"/></Navbar.Brand>
                        <Navbar.Brand>ReciclApp</Navbar.Brand>
                    </Container>
                </Navbar>
            
                <div className='container'>
                    <Login/>
                </div>
            </div>
        </div>
    )
}
