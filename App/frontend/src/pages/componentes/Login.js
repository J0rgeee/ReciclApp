import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import axios from 'axios';
import './styles.css';

import Form from 'react-bootstrap/Form';
import { Register } from './Register';
import { auth, googleProvider } from '../../componentes/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { FcGoogle } from "react-icons/fc";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:8000"
});

export function Login() {
    
    const [, setUsuarioActivo] = useState();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
            window.location.replace('/'); 
        });
    }

    
    const signInWithGoogle = async () => {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;

          const userData = {
            displayName: user.displayName,
            email: user.email,
          };
          
          setUsuarioActivo(true);
          window.location.replace('/');
        } catch (error) {
          console.error("Error signing in: ", error);
        }
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
                    <Stack gap={2} className="col-md-5 mx-auto">
                        <Button className='boton' type='submit' id='login'>Iniciar sesion</Button>
                        <Button variant='light' onClick={signInWithGoogle} className='FcGoogle'>Continuar con Google<FcGoogle /></Button>     
                                   
                        <Register/>
                    </Stack>
                </Form>
                    
            </Card>
        </div>
        
    )
}
