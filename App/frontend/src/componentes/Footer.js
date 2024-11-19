import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#f8f9fa', padding: '20px 0' }}>
      <Container>
        <Row>
          <Col md={4}>
            <h5>Acerca de Nosotros</h5>
            <p>Información sobre la empresa o el proyecto.</p>
          </Col>
          <Col md={4}>
            <h5>Enlaces Útiles</h5>
            <ul className="list-unstyled">
              <li><a href="/servicios">Servicios</a></li>
              <li><a href="/contacto">Contacto</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contáctanos</h5>
            <p>Email: recibear@gmail.com</p>
            <p>Teléfono: +569 2345 7890</p>
          </Col>
        </Row>
        <Row className="text-center mt-3">
          <Col>
            <p>&copy; {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>                 
    </footer>
  );
};
