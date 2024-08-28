import React from 'react';
import Form from 'react-bootstrap/Form';

export function FormularioEditar() {
  return (
    <div>
        <Form>
            <Form.Label htmlFor="inputPassword5">Password</Form.Label>
            <Form.Control
                type="text"
                id="inputUserName"
                aria-describedby="textHelpBlock"
            />
            <Form.Text id="textHelpBlock" muted>
                Nombre de usuario entre 6 - 15 caracteres
            </Form.Text>
        </Form>
    </div>
  )
}




