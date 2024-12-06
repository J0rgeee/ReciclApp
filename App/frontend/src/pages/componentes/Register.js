import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Card } from 'react-bootstrap';
import Swal from "sweetalert2";

export function Register() {
    const navigate = useNavigate();
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


    async function submitRegister(e) {
        e.preventDefault();
        try {
            // Validaciones básicas
            if (!email || !username || !password) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Todos los campos son obligatorios',
                });
                return;
            }

            // Log de los datos que se envían
            console.log('Datos a enviar:', {
                email,
                username,
                password
            });

            const response = await client.post("/api/register", {
                email: email,
                username: username,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Respuesta del servidor:', response);

            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Usuario registrado con éxito',
                });
                handleClose();
                navigate('/sesion');
            }
        } catch (error) {
            console.log('Error completo:', error);
            console.log('Respuesta del error:', error.response);
            
            let errorMessage = 'Error al realizar el registro. Por favor, intente nuevamente.';
            
            if (error.response) {
                if (error.response.data) {
                    console.log('Datos del error:', error.response.data);
                    if (typeof error.response.data === 'string') {
                        errorMessage = error.response.data;
                    } else if (error.response.data.mensaje) {
                        errorMessage = error.response.data.mensaje;
                    } else if (error.response.data.detail) {
                        errorMessage = error.response.data.detail;
                    }
                }
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
        }
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

