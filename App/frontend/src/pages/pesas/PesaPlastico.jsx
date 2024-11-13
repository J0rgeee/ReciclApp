import React, { useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';

function PesaPlastico() {
  const [showPesa, setShowPesa] = useState(false);
  const [peso, setPeso] = useState(0);

  const togglePesaInterface = () => setShowPesa(!showPesa);
  
  const incrementarPeso = () => setPeso(peso + 1);
  const decrementarPeso = () => setPeso(peso - 1);

  return (
        <Container className="p-4 border">
            <p><h1>USTED VA A RECICLAR PLASTICO</h1></p>
          <h3>Peso Actual: {peso} Gramos</h3>
          <Row>
            <Col>
              <Button variant="success" onClick={incrementarPeso}>Incrementar</Button>
            </Col>
            <Col>
              <Button variant="danger" onClick={decrementarPeso}>Decrementar</Button>
            </Col>
          </Row>
        </Container>
  );
}

export default PesaPlastico;