import React, { useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';

function PesaLata() {
  const [showPesa, setShowPesa] = useState(false);
  const [peso, setPeso] = useState(0);



  return (
        <Container className="p-4 border">
            <p><h1>USTED VA A RECICLAR LATA</h1></p>
          <h3>Peso Actual: {peso} Gramos</h3>
          <Row>
            <Col>
              <Button variant="success" >Registrar reciclaje</Button>
            </Col>
          </Row>
        </Container>
  );
}

export default PesaLata;