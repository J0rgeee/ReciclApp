import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import { Image } from 'react-bootstrap';
import './styles.css';


export function Carrusel() {
  return (
    <div>
    <Carousel fade>

      <Carousel.Item>
        <div className='contenedor'>
          <Image src="/carrusel.png" fluid className='imagen'/>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className='contenedor'>
          <Image src="/carrusel2.jpg" fluid className='imagen'/>

        </div>

      </Carousel.Item>
    </Carousel>

    </div>
  )
}

