import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './styles.css';



const BajadaNavBar = () => {

    
  return (
    <div className='bn1'>
        <Container className='max'>
            <Card className="mb-3 bn2">
                    <Row className='justify-content-end'>
                        <Col className='bajadanav' xs={12} md={6}>
                            <h1>UNETE, RECICLA y GANA</h1> 
                            <h3>Con RecyBear encontrarás una guía de como reciclar además de información de los puntos de reciclaje en tu ciudad</h3>
                            <h5>*Por ahora solo en Santiago</h5>
                        </Col>
                        <Col className='justify-content-end' xs={12} md={4}>
                            <img src="/inicioRecybear.jpg" className='img-fluid imagen-baja-nav'/>
                        </Col>
                    </Row>
            </Card>
        </Container>
    </div>
  );
};

export default BajadaNavBar;