import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const Empresas = () => {
  return (
    <div  >
      <Container fluid className="text-center bg-light py-5">
        <h2 className="mb-5">Empresas que colaboran con RecyBear</h2>

        <Row className="justify-content-center">
          {[...Array(2)].map((_, rowIndex) => (
            <Row key={rowIndex} className="mb-4">
              {[...Array(4)].map((_, colIndex) => (
                <Col key={colIndex} md={3}>
                  <Card className="h-100">
                    <Card.Img variant="top" src="/empresa.jpg" />
                    <Card.Body>
                      <Card.Title>Empresa {colIndex + 1 + rowIndex * 4}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Empresas;