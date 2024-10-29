import React,{ useState } from 'react';
import Container from 'react-bootstrap/Container';
import {Col,Row,Form,Button} from 'react-bootstrap';


const Contacto = () => {
    return(
    <div > 
        <Container className="d-flex flex-column justify-content-center align-items-center" >
            <h1>Contactanos</h1>
            <h5>Rellena el formulario y te escribiremos en breve </h5>
                
            
        <Row className="w-100">
            <Col xs={12} md={6} className='justify-content-start'>
                <img  src='/basura.jpg' className='img-fluid' ></img>
            </Col>
            <Col xs={12} md={6}>
            <Form>
                <Form.Group controlId="formName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" placeholder="Ingresa tu nombre" />
                </Form.Group>

                <Form.Group controlId="formSubject">
                    <Form.Label>Asunto</Form.Label>
                    <Form.Control type="text" placeholder="Ingresa el asunto" />
                </Form.Group>

                <Form.Group controlId="formMessage">
                    <Form.Label>Mensaje</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Escribe tu mensaje" />
                </Form.Group>

                <Form.Group controlId="formEmail">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control type="email" placeholder="Ingresa tu correo" />
                </Form.Group>
                <br />
                <Button variant="primary" type="submit">Enviar</Button>
            </Form>
            </Col>
        </Row>



    </Container>
    </div>
    )
    
};

export default Contacto;