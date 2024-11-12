import React from 'react';
import axios from 'axios';
import  { useState,useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';

import Cookies from 'js-cookie';
const csrftoken = Cookies.get('csrftoken');


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});



const Puntuacion = ({usuario}) => {

  const [formulario,setFormulario] = useState({
    email: '',
    puntosplas: '',
    puntospapel: '',
    putnosvidrio: '',
    puntoscarton: '',
    puntoslatas:''
});

const [texto, setTexto] = useState("Revisa cuantos puntos tienes en cada categoria");

const cambiarTexto = (nuevoTexto) => {
  setTexto(nuevoTexto);
};

  const [puntuacion, setPuntuacion] = useState([]);

  useEffect(() => {
    client.get(`/api/puntuacion/${usuario.email}/`)
      .then(response => setPuntuacion(response.data))
      .catch(error => console.error("Error al traer los datos:", error));
  }, [usuario.email]);



  return (
    <Container className="text-center mt-4">
    <Row>
      <Col>
        <h3>{texto}</h3>
      </Col>
    </Row>
    <Row className="mt-3">
      <Col>
        <Button variant="primary" onClick={() => cambiarTexto(`Usted tiene: ${puntuacion.puntosplas} PUNTOS en plasticos`)}>
          <img src='/Diccionario/plastico.jpg'/>
        </Button>
      </Col>
      <Col>
        <Button variant="secondary" onClick={() => cambiarTexto(`Usted tiene: ${puntuacion.puntospapel} PUNTOS en papel`)}>
        <img src='/Diccionario/papel.jpg'/>

        </Button>
      </Col>
      <Col>
        <Button variant="success" onClick={() => cambiarTexto(`Usted tiene: ${puntuacion.putnosvidrio} PUNTOS en vidrio`)}>
        <img src='/Diccionario/vidrio.jpg'/>
        </Button>
      </Col>
      <Col>
        <Button variant="warning" onClick={() => cambiarTexto(`Usted tiene: ${puntuacion.puntoscarton} PUNTOS en carton`)}>
        <img src='/Diccionario/carton.jpg'/>
        </Button>
      </Col>
      <Col>
        <Button variant="danger" onClick={() => cambiarTexto(`Usted tiene: ${puntuacion.puntoslatas} PUNTOS en latas`)}>
        <img src='/Diccionario/lata.jpg'/>
        </Button>
      </Col>
    </Row>
  </Container>
  );
};

export default Puntuacion;