import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import Carousel from 'react-bootstrap/Carousel';
import { Image } from 'react-bootstrap';


const Demo = () => {

  const [textoDemo, setTextoDemo] = useState('Paso 1');
  const [imagen, setImagen] = useState('/demo.jpg');
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handleButtonClick = (textoDemo, imagen) => {
    setTextoDemo(textoDemo);
    setImagen(imagen);
  };


  return (
    <div className='p-5' style={{ backgroundColor: "#41B59A" }}>
      <Container className="d-flex flex-column justify-content-center align-items-center">
        <h1 className='text-center'>La nueva forma de Recicalar esta aca, diviertete y recicla con RecyBear</h1>
        <h5>Descargala ya, empieza a ganar tus puntos para canjearlos por premios exclusivos</h5>
        <div className="mt-4">
          <Carousel activeIndex={index} onSelect={handleSelect}>
            <Carousel.Item>
              <Image src="/demo.jpg"></Image>
              <Carousel.Caption>
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
            <Image src="/demo2.jpg"></Image>
              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
            <Image src="/demo3.jpg"></Image>
              <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>
                  Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
            <Image src="/demo4.jpg"></Image>
              <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>
                  Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
      </Container>
      <br />
    </div>
  );
};

export default Demo;