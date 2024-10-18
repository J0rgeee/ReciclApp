import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Card from 'react-bootstrap/Card';
import { Carrusel } from './componentes/Carrusel';
import { Register } from './componentes/Register';
import { Login } from './componentes/Login';
import { MenuUsuario } from './componentes/MenuUsuario';
import {PuntosVerdesW} from './trabajador/PuntosVerdesW';
import { Navigate } from 'react-router-dom';



axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:8000"
});

export function Home() {

    const [usuarioActivo, setUsuarioActivo] = useState();

    useEffect(() => {
        client.get("/api/user").then(function (res) {
            setUsuarioActivo(true);
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
        });
    }

    if (usuarioActivo) {
        return (
            <div>
                {/* <MenuUsuario/> */}
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
                            <Card className="text-center">
                                <Card.Header>Inicio de sesion</Card.Header>
                                <Card.Body>
                                    <br></br>
                                    <Card.Title>Ingrese sus credenciales</Card.Title>
                                    <Login/>
                                    <br></br>
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    <Register/>
                                </Card.Footer>
                            </Card>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}