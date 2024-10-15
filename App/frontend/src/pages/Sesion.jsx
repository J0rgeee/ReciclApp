import React from 'react';
import { Login } from './componentes/Login';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


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
