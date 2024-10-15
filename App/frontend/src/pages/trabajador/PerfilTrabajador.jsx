import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';

const PerfilTrabajador = () => {
  return (  
    <Container>
        {/*Perfil*/}
        <h1>Perfil de trabajador</h1>
        <Row>
            <Col>
                <Card>
                    <Card.Title>Nombre</Card.Title>
                    <Card.Subtitle>Puesto de trabajo</Card.Subtitle>
                    <Card.Text>Informacion de contacto</Card.Text>
                </Card>
            </Col>

            {/*Opciones*/}
            <Col>
                <ListGroup>
                    <ListGroupItem>Ver clientes</ListGroupItem>
                    <ListGroupItem>Mensajes</ListGroupItem>
                    <ListGroupItem>Moderacion</ListGroupItem>
                </ListGroup>
            </Col>
        </Row>
    </Container>
  )
}

export default PerfilTrabajador