import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './articulos.css';
 

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000",
});

const Articulos = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const navigate = useNavigate();

  const handleShow = (item) => {
    setActiveItem(item);
    setShow(true);
  };

  const handleClose = () => setShow(false);
  const handleCloseCart = () => setShowCart(false);
  const handleShowCart = () => setShowCart(true);

  const fetchItems = async () => {
    try {
      const response = await client.get("/api/Producto/producto/");
      setProductos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setLoading(false);
    }
  };

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => [...prevCarrito, producto]);
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter((item) => item.id !== productoId));
  };

  const handleCompra = () => {
    if (carrito.length > 0) {
      navigate("/checkout", { state: { carrito } });
    } else {
      alert("El carrito está vacío.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <Container className="container-tienda">
      <h2 className="text-center mb-4">Tienda Puntos Recybear</h2>
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <Row className="my-4">
          {productos.map((item) => (
            <Col key={item.id} xs={12} md={3} className="mb-4">
              <Card className="card-art">
                <Card.Img variant="top" className="card-art-img" src={item.imagen} alt={item.nombre} />
                <Card.Body>
                  <Card.Title className="card-art-title">{item.nombre}</Card.Title>
                  <Button variant="primary" onClick={() => handleShow(item)}>
                    Ver descripción
                  </Button>
                  <Button variant="success" onClick={() => agregarAlCarrito(item)} className="mt-2">
                    Agregar al carrito
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

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

      <Modal show={showCart} onHide={handleCloseCart}>
        <Modal.Header closeButton>
          <Modal.Title>Carrito de compras</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {carrito.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            <ul>
              {carrito.map((producto) => (
                <li key={producto.id}>
                  {producto.nombre} - ${producto.precio}
                  <Button variant="danger" onClick={() => eliminarDelCarrito(producto.id)} className="ml-2">
                    Eliminar
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCart}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleCompra}>
            Comprar
          </Button>
        </Modal.Footer>
      </Modal>

      <Button variant="info" onClick={handleShowCart} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        Ver carrito ({carrito.length})
      </Button>
    </Container>
  );
};

export default Articulos;
