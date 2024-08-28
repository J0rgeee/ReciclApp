import React from 'react'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export function Login() {
  return (
    <div>
    <Form>
      



        <Card className="text-center">
        <Card.Header>Inicio de sesion</Card.Header>
        <Card.Body>
            <br></br>
            <Card.Title>Ingrese sus credenciales</Card.Title>
            <br></br>

            <Form.Group as={Row} className="auto" controlId="formPlaintextEmail">
                <Col>
                <Form.Control size="lg"  placeholder="email@example.com" />
                </Col>
            </Form.Group> 
            <br></br>
            <Form.Group as={Row} className="auto" controlId="formPlaintextPassword">
                <Col>
                <Form.Control size="lg" type="password" placeholder="Password" />
                </Col>
            </Form.Group>
            <br></br>
            
            <Button variant="primary">Iniciar sesion</Button>
        </Card.Body>
        <Card.Footer className="text-muted">xd</Card.Footer>
        </Card>
    </Form>
            
    </div>
  )
}


