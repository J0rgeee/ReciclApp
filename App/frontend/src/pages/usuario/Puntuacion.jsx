import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { FaRecycle, FaWineBottle, FaBox, FaNewspaper, FaTrashAlt } from 'react-icons/fa';

import Cookies from 'js-cookie';
const csrftoken = Cookies.get('csrftoken');

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});

const Puntuacion = ({ usuario }) => {
  // Estado para almacenar los datos de reciclaje
  const [datosReciclaje, setDatosReciclaje] = useState({
    total_reciclado: 0,
    plastico: 0,
    papel: 0,
    vidrio: 0,
    carton: 0,
    latas: 0
  });

  // Estado para los puntos (si necesitas mantener esta funcionalidad)
  const [puntos, setPuntos] = useState({
    puntosplas: 0,
    puntospapel: 0,
    putnosvidrio: 0,
    puntoscarton: 0,
    puntoslatas: 0
  });

  const [texto, setTexto] = useState("Revisa cuantos puntos tienes en cada categoria");

  useEffect(() => {
    if (usuario?.email) {
      // Obtener datos de reciclaje
      client.get(`/api/totalpesos/${usuario.email}/`)
        .then(response => {
          setDatosReciclaje(response.data);
        })
        .catch(error => console.error("Error al obtener datos de reciclaje:", error));

      // Si necesitas obtener los puntos de otra API
      // client.get(`/api/puntos/${usuario.email}/`)
      //   .then(response => setPuntos(response.data))
      //   .catch(error => console.error("Error al obtener puntos:", error));
    }
  }, [usuario?.email]);

  const cambiarTexto = (nuevoTexto) => {
    setTexto(nuevoTexto);
  };

  return (
    <Container className="text-center mt-4">
      <Card className="text-center mb-4 card-menu-user">
        <Card.Img 
          variant="top" 
          src={usuario.foto} 
          style={{ 
            borderRadius: '50%', 
            width: '100px', 
            height: '100px', 
            margin: '20px auto' 
          }} 
        />
        <Card.Body>
          <Card.Title>{usuario.username}</Card.Title>

          {/* Total general de reciclaje */}
          <div className="total-recycling">
            <FaRecycle className="total-icon" />
            <div>
              <h3>{datosReciclaje.total_reciclado.toFixed(2)} kg</h3>
              <p>Total Reciclado</p>
            </div>
          </div>

          {/* Desglose por tipo de material */}
          <div className="recycling-stats">
            <div className="recycling-item">
              <FaBox className="material-icon plastic" />
              <div>
                <h5>{datosReciclaje.plastico.toFixed(2)} kg</h5>
                <small>Plástico</small>
              </div>
            </div>

            <div className="recycling-item">
              <FaBox className="material-icon cardboard" />
              <div>
                <h5>{datosReciclaje.carton.toFixed(2)} kg</h5>
                <small>Cartón</small>
              </div>
            </div>

            <div className="recycling-item">
              <FaWineBottle className="material-icon glass" />
              <div>
                <h5>{datosReciclaje.vidrio.toFixed(2)} kg</h5>
                <small>Vidrio</small>
              </div>
            </div>

            <div className="recycling-item">
              <FaNewspaper className="material-icon paper" />
              <div>
                <h5>{datosReciclaje.papel.toFixed(2)} kg</h5>
                <small>Papel</small>
              </div>
            </div>

            <div className="recycling-item">
              <FaTrashAlt className="material-icon cans" />
              <div>
                <h5>{datosReciclaje.latas.toFixed(2)} kg</h5>
                <small>Latas</small>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Sección de puntos */}
      <Row>
        <Col>
          <h3>{texto}</h3>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Button variant="primary" onClick={() => cambiarTexto(`Usted tiene: ${puntos.puntosplas} PUNTOS en plasticos`)}>
            <img src='/Diccionario/plastico.jpg' alt="Plástico" />
          </Button>
        </Col>
        <Col>
          <Button variant="secondary" onClick={() => cambiarTexto(`Usted tiene: ${puntos.puntospapel} PUNTOS en papel`)}>
            <img src='/Diccionario/papel.jpg' alt="Papel" />
          </Button>
        </Col>
        <Col>
          <Button variant="success" onClick={() => cambiarTexto(`Usted tiene: ${puntos.putnosvidrio} PUNTOS en vidrio`)}>
            <img src='/Diccionario/vidrio.jpg' alt="Vidrio" />
          </Button>
        </Col>
        <Col>
          <Button variant="warning" onClick={() => cambiarTexto(`Usted tiene: ${puntos.puntoscarton} PUNTOS en carton`)}>
            <img src='/Diccionario/carton.jpg' alt="Cartón" />
          </Button>
        </Col>
        <Col>
          <Button variant="danger" onClick={() => cambiarTexto(`Usted tiene: ${puntos.puntoslatas} PUNTOS en latas`)}>
            <img src='/Diccionario/lata.jpg' alt="Latas" />
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Puntuacion;