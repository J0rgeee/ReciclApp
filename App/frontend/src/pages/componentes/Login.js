import React from 'react'
import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

import Form from 'react-bootstrap/Form';

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
            window.location.reload(); 
        });
    }

    return (
        <div>
            <Form onSubmit={e => submitLogin(e)}>
                <Form.Group as={Row} className="auto" controlId="formPlaintextEmail">
                        <Form.Control size="lg" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <br></br>
                <Form.Group as={Row} className="auto" controlId="formPlaintextPassword">
                    <Form.Control size="lg" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <br></br>
                <Button variant="primary" type='submit' id='login'>Iniciar sesion</Button>
            </Form>
        </div>
    )
}
