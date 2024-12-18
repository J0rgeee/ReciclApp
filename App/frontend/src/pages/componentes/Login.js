import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import axios from 'axios';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Register } from './Register';
import { auth, googleProvider } from '../../componentes/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import Modal from 'react-bootstrap/Modal';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:8000"
});

export function Login() {
    const navigate = useNavigate();
    const [, setUsuarioActivo] = useState();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function submitLogin(e) {
        e.preventDefault();
        setErrorMessage('');  // Reseteamos cualquier mensaje de error previo
        try {
            await axios.post("http://localhost:8000/api/login", {
                email: email,
                password: password
            });

            // Si la respuesta es exitosa, verificamos el tipo de usuario
            setUsuarioActivo(true);

            // Obtener información del usuario
            const userResponse = await axios.get("http://localhost:8000/api/user");
            const userType = userResponse.data.user.tipoUser;

            // Disparar evento de cambio de autenticación
            window.dispatchEvent(new Event('auth-change'));

            // Redirigir según el tipo de usuario
            if (userType === 1) {
                navigate('/AdminHome');
            } else if (userType === 2) {
                navigate('/MenuUsuario');
            } else if (userType === 3) {
                navigate('/TrabHome');
            } else {
                navigate('/');
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    setErrorMessage('Tu cuenta está desactivada. Por favor, contacta al administrador.');
                } else if (error.response.status === 404) {
                    setErrorMessage('El correo o la contraseña son incorrectos.');
                } else {
                    setErrorMessage('Hubo un problema al iniciar sesión. Inténtalo nuevamente.');
                }
            } else {
                setErrorMessage('Error al conectar con el servidor. Inténtalo nuevamente.');
            }
        }
    }

    function generateRandomPassword(length) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userData = {
                displayName: user.displayName,
                email: user.email,
                password: generateRandomPassword(12)
            };

            // Verificar si el usuario ya está registrado
            const response = await client.post("/api/check-user", { email: user.email });

            if (response.data.exists) {
                // Si el usuario ya está registrado, obtener su tipo y redirigir
                const userResponse = await client.get("/api/user");
                const userType = userResponse.data.user.tipoUser;
                
                if (userType === 1) {
                    navigate('/AdminHome');
                } else if (userType === 2) {
                    navigate('/MenuUsuario');
                } else if (userType === 3) {
                    navigate('/TrabHome');
                } else {
                    navigate('/');
                }
            } else {
                // Si el usuario no está registrado, regístralo
                await client.post("/api/register", userData);
                window.dispatchEvent(new Event('auth-change'));
                navigate('/');
            }
        } catch (error) {
            console.error("Error signing in: ", error);
        }
    };

    const EnviarNotificacion = () => {
        const [email, setEmail] = useState('');
        const [mensaje, setMensaje] = useState('');

        const enviarNotificacion = async () => {
            try {
                await axios.post('http://localhost:8000/api/noti/notificaciones/', {
                    email,
                    mensaje,
                });
                Swal.fire('Éxito', 'Notificación enviada al administrador.', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo enviar la notificación.', 'error');
            }
        };

        return (
            <div>
                <a onClick={handleShow} className='m-2'>Reactivar cuenta</a>
                <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} >
                    <Form onSubmit={e => enviarNotificacion(e)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Solicitud de activacion de cuenta</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="email" >
                                <Form.Label>Ingrese su email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="name@ejemplo.com"
                                    value={email} onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="mensaje">
                                <Form.Label>Mensaje</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Mensaje"
                                    value={mensaje} onChange={e => setMensaje(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" id='register'>Enviar</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
        );
    };

    return (

        <div className='container centrar'>
            <Card className='cont-login text-center'>
                <Card.Title className='card-title'>Inicia sesión con tu cuenta</Card.Title>

                <Form onSubmit={e => submitLogin(e)}>
                    <Form.Group controlId="formPlaintextEmail" className='mb-3'>
                        <FloatingLabel
                            controlId="userinput"
                            label="Usuario"
                            className='mb-3'
                        >
                            <Form.Control className='control' placeholder="" value={email} onChange={e => setEmail(e.target.value)} />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group controlId="formPlaintextPassword" className="mb-3">
                        <FloatingLabel
                            controlId="passinput"
                            label="Contraseña"
                            className='mb-3'
                        >
                            <Form.Control className='control' type="password" placeholder="" value={password} onChange={e => setPassword(e.target.value)} />
                        </FloatingLabel>
                    </Form.Group>

                    <Button className='boton mb-2' type='submit' id='login'>Iniciar sesion</Button>
                </Form>

                <Button variant='light' onClick={signInWithGoogle} className='FcGoogle mb-2'>Continuar con Google<FcGoogle /></Button>
                <Register />
                {errorMessage && (
                    <div className="error-message" style={{ color: 'red', marginTop: '20px' }}>
                        {errorMessage}
                    </div>
                )}
                <EnviarNotificacion />
            </Card>
        </div>

    )
}
