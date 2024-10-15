import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Outlet, Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './barranav.style.css';
import { Image } from 'react-bootstrap';

const client = axios.create({
  baseURL: "http://localhost:8000"
});


export function BarraNavegacion() {


  const [usuarioActivo, setUsuarioActivo] = useState();
  useEffect(() => {
    client.get("/api/user").then(function (res) {
      setUsuarioActivo(true);
    })
      .catch(function (error) {
        setUsuarioActivo(false);
      });
  }, []);




  if (usuarioActivo) {
    return (
      <div>
        <Navbar className='navbar-reci' expand="lg">
          <Container>
            <Navbar.Brand>ReciclApp</Navbar.Brand>
            <Navbar.Brand><img
              src=""
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="logoReci"
            /></Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Button >Inicio</Button>
              <Button >Foro</Button>

            </Navbar.Collapse>
          </Container>
        </Navbar>


        <br></br>
        <br></br>
        <br></br>
        <Container>

        </Container>
      </div>
    )
  }


  return (
    <div>
      <Navbar className='navbar-reci'>
        <Container className='container-fluid'>
          <Navbar.Brand>
            <img src="/logo.png" width="100" height="100" className="d-inline-block align-top logoreci" alt="logoReci" />
          </Navbar.Brand>
          <Navbar.Brand>ReciclApp</Navbar.Brand>

          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Link to='/'> <Button variant='none'><Image src='/botones/b1.png'  width="80" className="d-inline-block align-top p-2 imgbr"/> </Button> </Link>
            <Link to='/foro'>   <Image src='/botones/b2.png'  width="80" className="d-inline-block align-top p-2 imgbr"/>    </Link>
            <Link to='/tienda'> <Image src='/botones/b3.png'  width="80" className="d-inline-block align-top p-2 imgbr"/>  </Link>
            <Link to='/sesion'> <Image src='/botones/b4.png'  width="80" className="d-inline-block align-top p-2 imgbr"/>  </Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </div>
  )
}
