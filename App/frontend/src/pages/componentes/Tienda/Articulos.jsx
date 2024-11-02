import React, { useState,useEffect } from 'react';
import axios from 'axios'
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});

const Articulos = () => {

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);

  const [productos, setProductos] = useState([]);

  // Funciones para mostrar y cerrar el modal
  const handleShow = (item) => {
    setActiveItem(item);
    setShow(true);
  };

  const handleClose = () => setShow(false);


  const fetchItems = async () => {
    
    try {
      const response = await client.get('/api/Producto/producto/'); // URL de la API
      setProductos(response.data); // Guarda los datos en el estado
      setLoading(false); // Cambia el estado de carga
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setLoading(false);
    }
  };

  // Llama a la función fetchItems cuando el componente se monta
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <Container>
      <h2 className="text-center mb-4">Tienda ReciclApp</h2>
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : (
      <Row className="my-4">
        {productos.map((item) => (
          <Col key={item.id} xs={12} md={3} className="mb-4">
            <Card>
              <Card.Img variant="top" src={item.imagen} alt={item.nombre} />
              <Card.Body>
                <Card.Title>{item.nombre}</Card.Title>
                <Button variant="primary" onClick={() => handleShow(item)}>
                  Ver descripción
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      )}

      {/* Modal para la descripción */}
      {activeItem && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{activeItem.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{activeItem.desc}</Modal.Body>
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