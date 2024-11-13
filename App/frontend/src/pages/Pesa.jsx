import axios from 'axios';
import React, { useState,useEffect } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import PesaPlastico from './pesas/PesaPlastico';
import PesaPapel from './pesas/PesaPapel';
import PesaVidrio from './pesas/PesaVidrio';
import PesaCarton from './pesas/PesaCarton';
import PesaLata from './pesas/PesaLata';


export function Pesa() {
    const [selectedContainer, setSelectedContainer] = useState(null);

  const renderContainerContent = () => {
    switch (selectedContainer) {
      case 1:
        return <PesaPlastico/>;
      case 2:
        return <PesaPapel/>;
      case 3:
        return <PesaVidrio/>;
      case 4:
        return <PesaCarton/>;
      case 5:
        return <PesaLata/>;
      default:
        return <p>Selecciona un botón para ver su contenido.</p>;
    }
  };

  return (
    <Container>
      <Row className="mb-3 text-center">
        <h4>Selecciona una opción</h4>
      </Row>
      
      <Row className="mb-3">
        <Col><Button onClick={() => setSelectedContainer(1)}><img src='/Diccionario/plastico.jpg'/></Button></Col>
        <Col><Button onClick={() => setSelectedContainer(2)}><img src='/Diccionario/papel.jpg'/></Button></Col>
        <Col><Button onClick={() => setSelectedContainer(3)}><img src='/Diccionario/vidrio.jpg'/></Button></Col>
        <Col><Button onClick={() => setSelectedContainer(4)}><img src='/Diccionario/carton.jpg'/></Button></Col>
        <Col><Button onClick={() => setSelectedContainer(5)}><img src='/Diccionario/lata.jpg'/></Button></Col>
      </Row>
      
      <Container className="p-4 border">
        {renderContainerContent()}
      </Container>
    </Container>
  );
}