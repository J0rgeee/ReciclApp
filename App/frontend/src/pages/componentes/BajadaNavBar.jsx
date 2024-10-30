import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './styles.css';



const BajadaNavBar = () => {

    
  return (
    <div style={{ backgroundColor: "#41B59A"}}>
        <Container className='max'>
            <Card className="mb-3" style={{ backgroundColor: "#41B59A",border:"none"}}>
                
                    <Row >
                        <Col className='bajadanav' xs={12} md={6}>
                            <h1>UNETE, RECICLA y GANA</h1> 
                            <h3>Con Reciclapp encontraras una guia de como reciclar ademas de informacion de los puntos de reciclaje en tu ciudad</h3>
                            <h5>*Por ahora solo en Santiago</h5>
                        </Col>
                        <Col className='justify-content-end' xs={12} md={6}>
                            <img src="/home.png" className='img-fluid'/>
                        </Col>
                    </Row>
                
            </Card>
        </Container>
    </div>
  );
};

export default BajadaNavBar;