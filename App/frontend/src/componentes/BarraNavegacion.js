import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Outlet, Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './barranav.style.css';
import { Image  } from 'react-bootstrap';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});


export function BarraNavegacion() {


  const [usuarioActivo, setUsuarioActivo] = useState();
  const [usuario, setUsuario] = useState([]);



  useEffect(() => {

     const usuAct = async() =>{
      const useract = await axios.get('http://localhost:8000/api/user');
      //  console.log(useract);
      setUsuario(useract.data.user);
      console.log(usuario);

    }
    
    client.get("/api/user").then(function (res) {
      setUsuarioActivo(true);
      usuAct();
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
        window.location.replace('/'); 

    });

    
}
  if(usuario.tipoUser===1) //admin
    {
      return (
        <div>
          <Navbar className='navbar-reci' expand="lg">
            <Container>
              <Navbar.Brand><img src="/logo.png" width="80" height="80" className="d-inline-block align-top logoreci" alt="logoReci" /></Navbar.Brand>
              <Navbar.Brand className='titulo'>ReciclApp</Navbar.Brand>
              <Navbar.Brand>Bienvenido: {usuario.username} </Navbar.Brand>

              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
              <Link to='/'>   <Image src='/botones/b1.png'  width="80" className="d-inline-block align-top p-2 imgbr"/>    </Link>
                
                <Link to='/foro'>  <Image src='/botones/b2.png'  width="80" className="d-inline-block align-top p-2 imgbr"/>    </Link>
                <Link to='/tienda'> <Image src='/botones/b3.png'  width="80" className="d-inline-block align-top p-2 imgbr"/>  </Link>
                
              </Navbar.Collapse>
              <Navbar.Brand>
                <form onSubmit={e => submitLogout(e)}>
                    <Button type="submit" variant="danger"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-right" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5"/>
                      </svg> Logout 
                    </Button>
                </form></Navbar.Brand>

            </Container>
          </Navbar>
        <Outlet />
        </div>
      )
    }
  
  if (usuario.tipoUser===2) { //usuario
    return (
      <div>
        <Navbar className='navbar-reci' expand="lg">
          <Container>
    
            <Navbar.Brand>ReciclApp</Navbar.Brand>
            <Navbar.Brand><img src="/logo.png" width="80" height="80" className="d-inline-block align-top logoreci" alt="logoReci" /></Navbar.Brand>
            <Navbar.Brand>Bienvenido señor: {usuario.username}</Navbar.Brand>

            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Link to='/'>   <Image src='/botones/b1.png'  width="80" className="d-inline-block align-top p-2 imgbr"/>    </Link>
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
        <Outlet />
      </div>
    )
  }

  if (usuario.tipoUser===3) { // trabajador
    return (
      <div>
        <Navbar className='navbar-reci' expand="lg">
          <Container>
           
            <Navbar.Brand>ReciclApp</Navbar.Brand>
            <Navbar.Brand>Bienvenido señor trabajador: {usuario.username}</Navbar.Brand>
       
            <Navbar.Brand><img src="/logo.png" width="100" height="100" className="d-inline-block align-top logoreci" alt="logoReci" /></Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Button><Link to='/'>   <Image src='/botones/b1.png'  width="80" className="d-inline-block align-top p-2 imgbr"/>    </Link></Button>
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
        <Outlet />
      </div>
    )
  }


  return (
    <div>
      <Navbar className='navbar-reci justify-content-between' expand='md'>
        <Container fluid>
          <Navbar.Brand className=''>
            <img src="/logo.png" width="80" height="80" className="d-inline-block align-top logoreci" alt="logoReci" />
          </Navbar.Brand>
          <Navbar.Brand>ReciclApp</Navbar.Brand>
  
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Link to='/'> <Image src='/botones/b1.png'  width="70" className="d-inline-block align-top p-2 imgbr"/> </Link>
            <Link to='/foro'> <Image src='/botones/b2.png'  width="70" className="d-inline-block align-top p-2 imgbr"/> </Link>
            <Link to='/tienda'> <Image src='/botones/b3.png'  width="70" className="d-inline-block align-top p-2 imgbr"/> </Link>
            <Link to='/sesion'> <Image src='/botones/b4.png'  width="70" className="d-inline-block align-top p-2 imgbr"/> </Link>
            <Link to='/reciclaje'> <Image src='/botones/libro.png'  width="70" className="d-inline-block align-top p-2 imgbr"/> </Link>
            <Link to='/mapa'> <Image src='/botones/botonMapa.png'  width="80" className="d-inline-block align-top p-2 imgbr"/> </Link>
          </Navbar.Collapse>
          </Container>
      </Navbar>

      

      <Outlet />
    </div>
  )
}
