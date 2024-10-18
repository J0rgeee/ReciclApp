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

  function submitLogout(e) {
    e.preventDefault();
    client.post(
        "/api/logout",
        { withCredentials: true }
    ).then(function (res) {
        setUsuarioActivo(false);
    });
}


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
              
              <Link to='/foro'>   <Image src='/botones/b2.png'  width="80" className="d-inline-block align-top p-2 imgbr"/>    </Link>
              <Link to='/tienda'> <Image src='/botones/b3.png'  width="80" className="d-inline-block align-top p-2 imgbr"/>  </Link>
              
            </Navbar.Collapse>
            <Navbar.Brand>
              <form onSubmit={e => submitLogout(e)}>
                  <Button type="submit" variant="danger"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5"/>
                  </svg> Logout </Button>
              </form></Navbar.Brand>
          </Container>
        </Navbar>
        <div>
                {/* <MenuUsuario/> */}
                
            </div>

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
            <Link to='/mapa'>  mapa</Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </div>
  )
}
