import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';

const Articulos = () => {

  const [show, setShow] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const items = [
    { id: 1, title: 'Artículo 1', image: 'link_a_la_imagen_1', description: 'Descripción del artículo 1' },
    { id: 2, title: 'Artículo 2', image: 'link_a_la_imagen_2', description: 'Descripción del artículo 2' },
    { id: 3, title: 'Artículo 3', image: 'link_a_la_imagen_3', description: 'Descripción del artículo 3' },
    { id: 4, title: 'Artículo 4', image: 'link_a_la_imagen_4', description: 'Descripción del artículo 4' },
    { id: 5, title: 'Artículo 4', image: 'link_a_la_imagen_4', description: 'Descripción del artículo 4' },
    // Agrega más artículos aquí
  ];

  // Funciones para mostrar y cerrar el modal
  const handleShow = (item) => {
    setActiveItem(item);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  return (
    <Container>
      <Row className="my-4">
        {items.map((item) => (
          <Col key={item.id} xs={12} md={3} className="mb-4">
            <Card>
              <Card.Img variant="top" src={item.image} alt={item.title} />
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Button variant="primary" onClick={() => handleShow(item)}>
                  Ver descripción
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal para la descripción */}
      {activeItem && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{activeItem.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{activeItem.description}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Articulos;