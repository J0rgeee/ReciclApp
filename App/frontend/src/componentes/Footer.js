import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#f8f9fa', padding: '20px 0' }}>
      <Container>
        <Row>
          <Col md={4}>
            <h5>Acerca de Nosotros</h5>
            <p>Desarrollamos Recybear por que creemos que el futuro de nuestro planta es importante y con Recybear podremos ayudar a que los jovenes de temprana edad se motiven a reciclar</p>
          </Col>
          <Col md={4}>
            <h5>Enlaces Útiles</h5>
            <ul className="list-unstyled">
              <li><a href="/reciclaje">Que puedo Reciclar?</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contáctanos</h5>
<<<<<<< Updated upstream
            <p>Email: recibear@gmail.com</p>
            <p>Teléfono: +569 2345 7890</p>
=======
            <p>Email: recybear@gmail.com</p>
            <p>Teléfono: +56955554422</p>
>>>>>>> Stashed changes
          </Col>
        </Row>
        <Row className="text-center mt-3">
          <Col>
            <p>&copy; {new Date().getFullYear()} RecyBear. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>                 
    </footer>
  );
};
