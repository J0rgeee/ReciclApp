import React,{ useState,useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import {Col,Row,Form,Button} from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:8000"
});



const Contacto = () => {

    const [formulario,setFormulario] = useState({
        id: '',
        asunto: '',
        mensaje: '',
        email: ''
    });

    const resetForm = () => {
        setFormulario({
            email: '',
            asunto: '',
            mensaje: ''
        });
    };

    useEffect(() => { 
        const obtenerUltimoId = async () => { //ultimo id
            try {
                const response = await client.get('/api/Contacto/contacto/');
                const ultimoContacto = response.data.slice(-1)[0];  // Obtiene el último elemento
                setFormulario(prevState => ({ ...prevState, id: ultimoContacto ? ultimoContacto.id : 1 }));
            } catch (error) {
                console.error('Error al obtener el último ID:', error);
            }
        };
        obtenerUltimoId();
    }, []);

    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await client.post(`/api/Contacto/contacto/`, {
                emailUsuario: formulario.email,
                asunto: formulario.asunto,
                desc: formulario.mensaje
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Mensaje enviado con éxito!',
            });
            resetForm();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al crear el contacto.',
            });
        }  
    };

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
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" placeholder="Ingresa tu nombre"/>
                </Form.Group>

                <Form.Group controlId="formSubject">
                    <Form.Label>Asunto</Form.Label>
                    <Form.Control type="text" placeholder="Ingresa el asunto" name='asunto' value={formulario.asunto} onChange={handleChange} required/>
                </Form.Group>

                <Form.Group controlId="formMessage">
                    <Form.Label>Mensaje</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Escribe tu mensaje" name='mensaje' value={formulario.mensaje} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="formEmail">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control type="email" placeholder="Ingresa tu correo" name="email" value={formulario.email} onChange={handleChange} required />
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