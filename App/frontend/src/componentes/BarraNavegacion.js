import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Outlet,Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const client = axios.create({
    baseURL: "http://localhost:8000"
  });


export function BarraNavegacion() {


  const [usuarioActivo,setUsuarioActivo] = useState();
  useEffect(()=> {
    client.get("/api/user").then(function(res){
      setUsuarioActivo(true);
    })
    .catch(function(error){
      setUsuarioActivo(false);
    });
  }, []);

 


  if(usuarioActivo){
    return (
      <div>
        <Navbar bg="dark" variant="dark">
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
    <Navbar bg="dark" variant="dark">
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
              <Link to='/'>       <Button >Inicio</Button>  </Link> 
              <Link to='/foro'>   <Button >Foro</Button>    </Link>
              <Link to='/tienda'> <Button >Tienda</Button>  </Link>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Outlet/>
    </div>
  )
}
