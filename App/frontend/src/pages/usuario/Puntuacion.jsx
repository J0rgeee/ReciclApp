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
    pesos_por_tipo: {
      plastico: 0,
      papel: 0,
      vidrio: 0,
      carton: 0,
      latas: 0
    }
  });

  // Estado para los puntos
  const [puntos, setPuntos] = useState({
    puntosplas: 0,
    puntospapel: 0,
    putnosvidrio: 0,
    puntoscarton: 0,
    puntoslatas: 0,
    
  });
  const total = puntos.puntoscarton + puntos.puntoslatas + puntos.puntospapel + puntos.puntosplas + puntos.putnosvidrio;
  
  const [texto, setTexto] = useState("Revisa cuantos puntos tienes en cada categoria");

  // Función para cambiar el texto
  const cambiarTexto = (nuevoTexto) => {
    setTexto(nuevoTexto);
  };

  useEffect(() => {
    if (usuario?.email) {
      // Obtener datos de reciclaje
      client.get(`/api/transpeso/totalpesos/${usuario.email}/`)
        .then(response => {
          if (response.data && response.data.pesos_por_tipo) {
            setDatosReciclaje(response.data);
          }
        })
        .catch(error => console.error("Error al obtener datos de reciclaje:", error));

      // Obtener puntos
      client.get(`/api/puntos/${usuario.email}/`)
        .then(response => {
          if (response.data) {
            setPuntos(response.data);
            console.log(response.data)
          }
        })
        .catch(error => console.error("Error al obtener puntos:", error));
    }
  }, [usuario?.email]);

  const formatearPeso = (peso) => {
    return (peso || 0).toFixed(2);
  };

  return (
    <Container className="text-center mt-4">
      <Card className="text-center mb-4 card-menu-user">
        <Card.Img 
          variant="top" 
          src='Usuarios/perfilH.png'
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
              <h3>
                {formatearPeso(Object.values(datosReciclaje.pesos_por_tipo || {}).reduce((a, b) => a + b, 0))} kg
              </h3>
              <p>Total Reciclado</p>
            </div>
          </div>

          <div className="total-recycling">
            <FaRecycle className="total-icon" />
            <div>
              <h3>
                {total} EcoPuntos
              </h3>
              <p>Total Acumulado</p>
            </div>
          </div>

          {/* Desglose por tipo de material */}
          <div className="recycling-stats">
            <div className="recycling-item">
              <FaBox className="material-icon plastic" />
              <div>
                <h5>{formatearPeso(datosReciclaje.pesos_por_tipo?.plastico / 1000)} kg</h5>
                <small>Plástico</small>
              </div>
            </div>

            <div className="recycling-item">
              <FaBox className="material-icon cardboard" />
              <div>
                <h5>{formatearPeso(datosReciclaje.pesos_por_tipo?.carton)} kg</h5>
                <small>Cartón</small>
              </div>
            </div>

            <div className="recycling-item">
              <FaWineBottle className="material-icon glass" />
              <div>
                <h5>{formatearPeso(datosReciclaje.pesos_por_tipo?.vidrio)} kg</h5>
                <small>Vidrio</small>
              </div>
            </div>

            <div className="recycling-item">
              <FaNewspaper className="material-icon paper" />
              <div>
                <h5>{formatearPeso(datosReciclaje.pesos_por_tipo?.papel)} kg</h5>
                <small>Papel</small>
              </div>
            </div>

            <div className="recycling-item">
              <FaTrashAlt className="material-icon cans" />
              <div>
                <h5>{formatearPeso(datosReciclaje.pesos_por_tipo?.latas)} kg</h5>
                <small>Latas</small>
              </div>
            </div>
          </div>
        </Card.Body>
        <div className="recycling-stats">
            <div className="recycling-item">
              <FaBox className="material-icon plastic" />
              <div>
                <h5>{puntos.puntosplas || 0} puntos</h5>
                <small>Plástico</small>
              </div>
            </div>

            <div className="recycling-item">
              <FaBox className="material-icon cardboard" />
              <div>
                <h5>{puntos.puntospapel || 0} puntos</h5>
                <small>Cartón</small>
              </div>
            </div>

            <div className="recycling-item">
              <FaWineBottle className="material-icon glass" />
              <div>
                <h5>{puntos.putnosvidrio || 0} puntos</h5>
                <small>Vidrio</small>
              </div>
            </div>

            <div className="recycling-item">
              <FaNewspaper className="material-icon paper" />
              <div>
                <h5>{puntos.puntoscarton || 0} puntos</h5>
                <small>Papel</small>
              </div>
            </div>

            <div className="recycling-item">
              <FaTrashAlt className="material-icon cans" />
              <div>
                <h5>{puntos.puntoslatas || 0} puntos</h5>
                <small>Latas</small>
              </div>
            </div>
          </div>
      </Card>

      {/* Sección de puntos 
      <Row>
        <Col>
          <h3>{texto}</h3>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Button variant="primary" onClick={() => cambiarTexto(`Usted tiene: ${puntos.puntosplas || 0} PUNTOS en plasticos`)}>
            <img src='/Diccionario/plastico.jpg' alt="Plástico" />
          </Button>
        </Col>
        <Col>
          <Button variant="secondary" onClick={() => cambiarTexto(`Usted tiene: ${puntos.puntospapel || 0} PUNTOS en papel`)}>
            <img src='/Diccionario/papel.jpg' alt="Papel" />
          </Button>
        </Col>
        <Col>
          <Button variant="success" onClick={() => cambiarTexto(`Usted tiene: ${puntos.putnosvidrio || 0} PUNTOS en vidrio`)}>
            <img src='/Diccionario/vidrio.jpg' alt="Vidrio" />
          </Button>
        </Col>
        <Col>
          <Button variant="warning" onClick={() => cambiarTexto(`Usted tiene: ${puntos.puntoscarton || 0} PUNTOS en carton`)}>
            <img src='/Diccionario/carton.jpg' alt="Cartón" />
          </Button>
        </Col>
        <Col>
          <Button variant="danger" onClick={() => cambiarTexto(`Usted tiene: ${puntos.puntoslatas || 0} PUNTOS en latas`)}>
            <img src='/Diccionario/lata.jpg' alt="Latas" />
          </Button>
        </Col>
      </Row>
      */}
    </Container>
  );
};

export default Puntuacion;