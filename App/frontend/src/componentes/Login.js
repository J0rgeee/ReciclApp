import React from 'react'
import { useState} from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});

export function Login() {

  const [usuarioActivo,setUsuarioActivo] = useState();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  
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

  return (
    <div>
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
            
    </div>
  )
}


