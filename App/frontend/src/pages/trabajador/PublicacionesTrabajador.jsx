import React from 'react'
import { Container, Row, Col, Card, Dropdown, DropdownButton, DropdownItem } from 'react-bootstrap';

const PublicacionesTrabajador = () => {
  return (
    <Container>
        <h1>Publicaciones</h1>
        <br></br>
        <Row>
            <button>Nueva publicacion</button>
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>Usuario 1</Card.Title>
                        <Card.Text>Publicacion xxxxxxx</Card.Text>
                        <Card.Subtitle>Ubicacion: XXXXXX</Card.Subtitle>

                        <DropdownButton>
                            <DropdownItem>Revisar</DropdownItem>
                            <DropdownButton>Eliminar</DropdownButton>
                        </DropdownButton>
                    </Card.Body>
                </Card>
            </Col>
            <br></br>
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>Usuario 2</Card.Title>
                        <Card.Text>Publicacion xxxxxxx</Card.Text>
                        <Card.Subtitle>Ubicacion: XXXXXX</Card.Subtitle>

                        <DropdownButton>
                            <DropdownItem>Revisar</DropdownItem>
                            <DropdownButton>Eliminar</DropdownButton>
                        </DropdownButton>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
  )
}

export default PublicacionesTrabajador