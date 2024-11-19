import React,{ useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'


const Demo = () => {

    const [textoDemo, setTextoDemo] = useState('Paso 1');
    const [imagen,setImagen] = useState('/demo.jpg');
  
    const handleButtonClick = (textoDemo,imagen) => {
      setTextoDemo(textoDemo);
      setImagen(imagen);
    };


  return (
    <div  style={{ backgroundColor: "#41B59A"}}>
        <Container className="d-flex flex-column justify-content-center align-items-center">
            <h1>La nueva forma de Recicalar esta aca, diviertete y recicla con RecyBear</h1>
            <h5>Descargala ya, empieza a ganar tus puntos para canjearlos por premios exclusivos</h5>
      <Row className="mt-4">
        <Col >
          <img src={imagen} fluid />
        </Col>
        <Col className="d-flex align-items-center">
          <p>{textoDemo}</p>
        </Col>
      </Row>
      <div className="mt-4">
        <Button variant="success" onClick={() => handleButtonClick('Demo 1','/demo.jpg')}>Demo 1</Button>
        <Button variant="success" onClick={() => handleButtonClick('Demo 2','/demo2.jpg')}>Demo 2</Button>
        <Button variant="success" onClick={() => handleButtonClick('Demo 3','/demo3.jpg')}>Demo 3</Button>
        <Button variant="success" onClick={() => handleButtonClick('Demo 4','/demo4.jpg')}>Demo 4</Button>
      </div>
    </Container>
    <br />
    </div>
  );
};

export default Demo;