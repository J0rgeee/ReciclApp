import React from 'react';
import axios from 'axios';
import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Card } from 'react-bootstrap';


export function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    axios.defaults.withCredentials = true;

    const client = axios.create({
        baseURL: "http://localhost:8000"
    });


    function submitRegister(e) {
        e.preventDefault();
        client.post(
            "/api/register",
            {
                email: email,
                username: username,
                password: password,
                tipoUser: '2',
            }
        ).then(function (res){
            window.location.reload();
        })
    }
    return (
        <div className='reg'>
            <Button onClick={handleShow} className='pd-2 boton'> Crear cuenta </Button>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} >
                <Form onSubmit={e => submitRegister(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Registrarse</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Label >Formulario de Registro</Form.Label>
                        <Form.Group className="mb-3" controlId="email" >
                            <Form.Label>Ingrese su email</Form.Label>
                            <Form.Control type="email" placeholder="name@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="usuario">
                            <Form.Label>Nombre de usuario</Form.Label>
                            <Form.Control type="text" placeholder="Nombre de usuario" value={username} onChange={e => setUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>
                                Contraseña
                            </Form.Label>
                            <Form.Control type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit" id='register'>Crear cuenta</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}

