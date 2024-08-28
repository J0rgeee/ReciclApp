import './App.css';
import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { BarraNavegacion } from './componentes/BarraNavegacion';
import { Carrusel } from './componentes/Carrusel';
import { Login } from './componentes/Login';



axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:5173"
});


function App() {
  return (
    <div>
     <BarraNavegacion/>
     <br></br>
     <br></br>
     <br></br>
     <Container>
        <Row>
          <Col>  
            <Carrusel/>
          </Col>
          <Col xs lg="3"><Login/></Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
