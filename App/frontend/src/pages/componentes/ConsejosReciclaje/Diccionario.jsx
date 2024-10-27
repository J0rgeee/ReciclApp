import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card,Button,Modal } from 'react-bootstrap';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});

const Diccionario = () => {
  const [items, setItems] = useState([]); // Estado para almacenar los datos de las cajitas
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  

  const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal
  const [activeItem, setActiveItem] = useState(null);

  const handleShowModal = (item) => {
    setActiveItem(item); // Guarda el item activo en el estado
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActiveItem(null); // Resetea el item activo cuando se cierra el modal
  };

  // Función para obtener los datos del backend
  const fetchItems = async () => {
    
    try {
      const response = await client.get('/api/TipoRec/tiporec/'); // URL de la API
      setItems(response.data); // Guarda los datos en el estado
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
    <Container className="my-5">
      <h2 className="text-center mb-4">Diccionario</h2>
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <Row>
          {items.map((item) => (
            <Col key={item.idTR} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100" >
                <Card.Body>
                  <Card.Title>{item.nombre}</Card.Title>
                  <Card.Text>
                    <img src={item.imagen}></img> <br />
                        <Button variant="primary" onClick={() => handleShowModal(item)}>
                        Ver Descripción
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        

        
      )}

    <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title >{activeItem?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Col>
                    <img src={activeItem?.imagen} alt="" />
                </Col>
                <Col>
                    {activeItem?.desc}
                </Col>
            </Row>
            <Row>
                ¿Como lo llevo? <br /> {activeItem?.comollevar}
            </Row>
            <Row>
                ¿Como lo reconozco? <br /> {activeItem?.reconocer}
            </Row>
            <Row>
                ¿Cuando no debo llevarlo? <br /> {activeItem?.nollevar}
            </Row>
           
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
    </Modal>
    </Container>
  );
};

export default Diccionario;