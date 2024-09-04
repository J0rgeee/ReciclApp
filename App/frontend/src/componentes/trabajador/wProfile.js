import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, ListGroupItem, CardBody } from 'react-bootstrap';
import './wProfile.css';

const WProfile = () => {
    const [selectedSection, setSelectedSection] = useState('perfil');
    return (
        <Container>
            <Row>
                <Col>
                    <ListGroup>
                        <ListGroupItem
                            action active={selectedSection === 'perfil'} onClick={() => setSelectedSection('perfil')}
                        >Perfil</ListGroupItem>
                        <ListGroupItem
                            action active={selectedSection === 'clientes'} onClick={() => setSelectedSection('clientes')}
                        >Lista de Clientes</ListGroupItem>
                        <ListGroupItem
                            action active={selectedSection === 'mensajeria'} onClick={() => setSelectedSection('mensajeria')}
                        >Mensajes</ListGroupItem>
                        <ListGroupItem
                            action active={selectedSection === 'moderacion'} onClick={() => setSelectedSection('moderacion')}
                        >Foro</ListGroupItem>
                    </ListGroup>
                </Col>

                <Col>
                    {selectedSection === 'perfil' && (
                        <Card>
                            <CardBody>
                                <h4>Trabajador 1</h4>
                                <br></br>
                                <Button variant='primary' onClick={() => setSelectedSection('clientes')}
                                >Ver Clientes</Button>
                            </CardBody>
                        </Card>
                    )}

                    {selectedSection === 'clientes' && (
                        <Card>
                            <CardBody>
                                <h4>Listado de clientes</h4>
                                <br></br>
                                <ul>
                                    <li>Cliente 1</li>
                                    <li>Cliente 2</li>
                                </ul>
                                <Button variant='secondary'>Detalles de cliente</Button>
                            </CardBody>
                        </Card>
                    )}

                    {selectedSection === 'mensajeria' && (
                        <Card>
                            <CardBody>
                                <h4>Mensajeria</h4>
                                <br></br>
                                <p>Mensajes Recientes</p>
                            </CardBody>
                        </Card>
                    )}

                    {selectedSection === 'moderacion' && (
                        <Card>
                            <CardBody>
                                <h4>Moderar foro</h4>
                                <br></br>
                                <p>Posts recientes</p>
                            </CardBody>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default WProfile;