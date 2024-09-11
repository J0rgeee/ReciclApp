import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Carrusel } from './componentes/Carrusel';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:8000"
});

export function Home() {

    const [usuarioActivo, setUsuarioActivo] = useState();
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    useEffect(() => {
        client.get("/api/user").then(function (res) {
            setUsuarioActivo(true);
        })
            .catch(function (error) {
                setUsuarioActivo(false);
            });
    }, []);



    function submitLogin(e) {
        e.preventDefault();
        client.post(
            "/api/login",
            {
                email: email,
                password: password
            }
        ).then(function (res) {
            setUsuarioActivo(true);
        });
    }

    function submitLogout(e) {
        e.preventDefault();
        client.post(
            "/api/logout",
            { withCredentials: true }
        ).then(function (res) {
            setUsuarioActivo(false);
        });
    }
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    if (usuarioActivo) {
        return (
            <div>
                <h1>MENU USUARIO</h1>
                <form onSubmit={e => submitLogout(e)}>
                    <Button type="submit" variant="primary" > Logout </Button>
                </form>
            </div>
        )
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Carrusel />
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
                                            <Form.Control size="lg" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
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
                                <Card.Footer className="text-muted">
                                    <Button variant="primary" onClick={handleShow}> Crea tu cuenta aqui! </Button>
                                    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} >
                                        <Modal.Header closeButton>
                                            <Modal.Title>Registrarse</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            Formulario de registro 
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>
                                                Close
                                            </Button>
                                            <Button variant="primary">Crear cuenta</Button>
                                        </Modal.Footer>
                                    </Modal>
                                </Card.Footer>
                            </Card>
                        </Form>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}