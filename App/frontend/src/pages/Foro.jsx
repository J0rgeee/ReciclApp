import React from 'react'
import './foro.styles.css';

import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { FcLike } from "react-icons/fc";
import { FaComment } from "react-icons/fa";

export function Foro() {
  return (
    <div className='container'>
      <Card>
      <Card.Header><Image src="holder.js/171x180" rounded /> Usuario <span className="span">/ hace 5 min</span></Card.Header>
        <Card.Body>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
        </Card.Body>
        <Card.Img variant="bottom" src="back.jpeg" className='img-foro'/>
        <Nav>
          <Nav.Item className='btn-foro'>
            <FcLike className='button'/>
          </Nav.Item>
          <Nav.Item className='btn-foro'>
            <Button><FaComment /></Button>
          </Nav.Item>
          <Nav.Item className='btn-foro'>
            <Button >
              Disabled
            </Button>
          </Nav.Item>
        </Nav>
      </Card>
    </div>
  )
}
