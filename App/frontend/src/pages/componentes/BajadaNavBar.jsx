import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';




const BajadaNavBar = () => {

    
  return (
    <div style={{ backgroundColor: "#41B59A"}} >
        <Container fluid >
            <Card className="mb-3" style={{ backgroundColor: "#41B59A",border:"none"}}>
                <Card.Body>
                    <Row>
                        <Col>
                            <h1>UNETE, RECICLA y GANA</h1> 
                            <h3>Con Reciclapp encontraras una guia de como reciclar ademas de informacion de los puntos de reciclaje en tu ciudad</h3>
                            <h5>*Por ahora solo en Santiago</h5>
                        </Col>
                        <Col className='justify-content-end'>
                            <img src="/home.png" fluid />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    </div>
  );
};

export default BajadaNavBar;