import './App.css';
import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';




import { BarraNavegacion } from './componentes/BarraNavegacion';
import { Carrusel } from './componentes/Carrusel';




axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});

function App() {
  
  const [usuarioActivo,setUsuarioActivo] = useState();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  useEffect(()=> {
    client.get("/api/user").then(function(res){
      setUsuarioActivo(true);
    })
    .catch(function(error){
      setUsuarioActivo(false);
    });
  }, []);


  
  function submitLogin(e){
    e.preventDefault();
    client.post(
      "/api/login",
      {
        email:email,
        password:password
      }
    ).then(function(res){
      setUsuarioActivo(true);
    });
}

  function submitLogout(e){
    e.preventDefault();
    client.post(
      "/api/logout",
      {withCredentials:true}
    ).then(function(res){
      setUsuarioActivo(false);
    });
  }

  if(usuarioActivo){
    return (
      <div>
        <BarraNavegacion/>
        <br></br>
        <br></br>
        <br></br>
        <Container>
          <form onSubmit={e=> submitLogout(e)}>
            <Button type="submit" variant="secundary" > Logout </Button>    
          </form>
        </Container>
      </div>
    )
  } 

  
  return (
    <div>
     <BarraNavegacion/>
     <br></br>
     <br></br>
     <br></br>
     <Container>
        <Row>
          <Col>  
            <Carrusel/>
          </Col>
          <Col xs lg="3">
            <Form onSubmit={e => submitLogin(e)}>
              <Card className="text-center">
              <Card.Header>Inicio de sesion</Card.Header>
              <Card.Body>
                  <br></br>
                  <Card.Title>Ingrese sus credenciales</Card.Title>
                  <br></br>
                  <Form.Group as={Row} className="auto" controlId="formPlaintextEmail">
                      <Col>
                      <Form.Control size="lg"  placeholder="email@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
                      </Col>
                  </Form.Group> 
                  <br></br>
                  <Form.Group as={Row} className="auto" controlId="formPlaintextPassword">
                      <Col>
                      <Form.Control size="lg" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                      </Col>
                  </Form.Group>
                  <br></br>
                  <Button variant="primary" type='submit'>Iniciar sesion</Button>
              </Card.Body>
              <Card.Footer className="text-muted">xd</Card.Footer>
              </Card>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
