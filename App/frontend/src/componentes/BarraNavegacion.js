import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Outlet, Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './barranav.style.css';
import { Image } from 'react-bootstrap';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});

export function BarraNavegacion() {
  const [usuarioActivo, setUsuarioActivo] = useState();
  const [usuario, setUsuario] = useState([]);

  const usuAct = async () => {
    try {
      const useract = await client.get('/api/user');
      setUsuario(useract.data.user);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      setUsuarioActivo(false);
    }
  }

  useEffect(() => {
    // Verificar el estado del usuario cuando el componente se monta
    const checkUserStatus = async () => {
      try {
        await client.get("/api/user");
        setUsuarioActivo(true);
        usuAct();
      } catch (error) {
        setUsuarioActivo(false);
      }
    };

    checkUserStatus();

    // Agregar un event listener para detectar cambios en la autenticación
    window.addEventListener('auth-change', checkUserStatus);

    // Cleanup
    return () => {
      window.removeEventListener('auth-change', checkUserStatus);
    };
  }, []);

  function submitLogout(e) {
    e.preventDefault();
    client.post("/api/logout", { withCredentials: true })
      .then(function (res) {
        setUsuarioActivo(false);
        setUsuario([]); // Limpiar el estado del usuario
        window.location.replace('/');
      });
  }

  if (usuario.tipoUser === 1) //admin
  {
    return (
      <div>
        <Navbar className='navbar-reci' expand="md">
          <Container className='p-2'>
            <Navbar.Brand><img src="/logo.png" className="logoreci" alt="logoReci" /></Navbar.Brand>
            <Navbar.Brand className='titulo'>RecyBear</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Link to='/AdminHome'><Image src='/botones/b1.png' className="m-2 imgbr" /></Link>
              <Link to='/foro'><Image src='/botones/b2.png' className="m-2 imgbr" /></Link>
              <Link to='/tienda'><Image src='/botones/b3.png' className="m-2 imgbr" /></Link>
              <Button variant="danger" onClick={submitLogout}>
                <img src='/botones/logout.svg' />
                Cerrar sesión
              </Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Outlet />
      </div>
    )
  }

  if (usuario.tipoUser === 2) { //usuario
    return (
      <div>
        <Navbar className='navbar-reci' expand="md">
          <Container className='p-2'>
            <Navbar.Brand>RecyBear</Navbar.Brand>
            <Navbar.Brand><img src="/Designer (3).png" className="logoreci" alt="logoReci" /></Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Link to='/'><Image src='/botones/b1.png' className="m-2 imgbr" /></Link>
              <Link to='/foro'><Image src='/botones/b2.png' className="m-2 imgbr" /></Link>
              <Link to='/tienda'><Image src='/botones/b3.png' className="m-2 imgbr" /></Link>
              <Link to='/pesa'><Image src='/botones/bpeso.png' width="80" className="m-2 imgbr" /></Link>
              <Button variant="danger" onClick={submitLogout}>
                <img src='/botones/logout.svg' />
                Cerrar sesión
              </Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Outlet />
      </div>
    )
  }

  if (usuario.tipoUser === 3) { // trabajador
    return (
      <div>
        <Navbar className='navbar-reci' expand="md">
          <Container className='p-2'>
            <Navbar.Brand>RecyBear</Navbar.Brand>
            <Navbar.Brand><img src="/logo.png" className="logoreci" alt="logoReci" /></Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Link to='/TrabHome'><Image src='/botones/b1.png' className="m-2 imgbr" /></Link>
              <Link to='/foro'><Image src='/botones/b2.png' className="m-2 imgbr" /></Link>
              <Link to='/tienda'><Image src='/botones/b3.png' className="m-2 imgbr" /></Link>
              <Button variant="danger" onClick={submitLogout}>
                <img src='/botones/logout.svg' />
                Cerrar sesión
              </Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Outlet />
      </div>
    )
  }

  return (
    <div>
      <Navbar className='navbar-reci justify-content-between' expand='md'>
        <Container className='p-2'>
        <Navbar.Brand className='titulo'>RecyBear</Navbar.Brand>
          <Navbar.Brand>
            <img src="/logo.png" className="logoreci" alt="logoReci" />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Link to='/'><Image src='/botones/b1.png' className="m-2 imgbr" /></Link>
            <Link to='/foro'><Image src='/botones/b2.png' className="m-2 imgbr" /></Link>
            <Link to='/tienda'><Image src='/botones/b3.png' className="m-2 imgbr" /></Link>
            <Link to='/sesion'><Image src='/botones/b4.png' className="m-2 imgbr" /></Link>
            <Link to='/reciclaje'><Image src='/botones/libro.png' className="m-2 imgbr" /></Link>
            <Link to='/mapa'><Image src='/botones/botonMapa.png' width="80" className="m-2 imgbr" /></Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  )
}
