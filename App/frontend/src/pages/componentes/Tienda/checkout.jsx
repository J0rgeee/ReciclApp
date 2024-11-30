import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import './checkout.css';

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000",
});

const CheckoutTienda = ({ carrito }) => {
  const [direcciones, setDirecciones] = useState([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [puntosUsuario, setPuntosUsuario] = useState(null);
  const [loadingDirecciones, setLoadingDirecciones] = useState(true);
  const [loadingPuntos, setLoadingPuntos] = useState(true);
  const [tipoPuntos, setTipoPuntos] = useState("plas");
  const location = useLocation();
  const carrito = location.state ? location.state.carrito : [];

  const fetchDirecciones = async () => {
    try {
      const response = await client.get("/api/Direcciones/");
      setDirecciones(response.data);
      setLoadingDirecciones(false);
    } catch (error) {
      console.error("Error al obtener las direcciones:", error);
    }
  };

  const fetchPuntosUsuario = async () => {
    try {
      const response = await client.get("/api/PuntuacioUsuario/");
      setPuntosUsuario(response.data);
      setLoadingPuntos(false);
    } catch (error) {
      console.error("Error al obtener los puntos del usuario:", error);
    }
  };

  const handleDireccionChange = (e) => {
    setDireccionSeleccionada(e.target.value);
  };

  const calcularCostoTotal = () => {
    return carrito.reduce((total, producto) => total + producto.precio, 0);
  };

  const handleConfirmarCompra = async () => {
    const costoTotal = calcularCostoTotal();

    if (!direccionSeleccionada) {
      alert("Por favor, selecciona una dirección.");
      return;
    }

    if (!puntosUsuario) {
      alert("No se han cargado los puntos del usuario.");
      return;
    }

    let puntosDisponibles = 0;
    switch (tipoPuntos) {
      case "plas":
        puntosDisponibles = puntosUsuario.puntosplas;
        break;
      case "papel":
        puntosDisponibles = puntosUsuario.puntospapel;
        break;
      case "vidrio":
        puntosDisponibles = puntosUsuario.putnosvidrio;
        break;
      case "carton":
        puntosDisponibles = puntosUsuario.puntoscarton;
        break;
      case "latas":
        puntosDisponibles = puntosUsuario.puntoslatas;
        break;
      default:
        puntosDisponibles = 0;
    }

    if (puntosDisponibles < costoTotal) {
      alert(`No tienes suficientes puntos de tipo ${tipoPuntos} para realizar esta compra.`);
      return;
    }

    const nuevoPedido = {
      direccion_id: direccionSeleccionada,
      productos_ids: carrito.map((producto) => producto.id),
      puntos_utilizados: costoTotal,
    };

    try {
      const response = await axios.post("/api/pedidos/", nuevoPedido);
      if (response.status === 201) {
        // Descontar los puntos del usuario según el tipo de puntos
        const puntosRestantes = puntosDisponibles - costoTotal;
        setPuntosUsuario({
          ...puntosUsuario,
          [tipoPuntos]: puntosRestantes, // Actualizar solo la categoría de puntos utilizada
        });
        alert("Compra realizada con éxito");
        history.push("/tienda");
      }
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      alert("Ocurrió un error al realizar la compra.");
    }
  };

  useEffect(() => {
    fetchDirecciones();
    fetchPuntosUsuario();
  }, []);

  return (
    <Container>
      <h2 className="text-center mb-4">Checkout</h2>
      <Row className="mb-4">
        <Col>
          <h4>Productos en el carrito</h4>
          {carrito.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            <ul>
              {carrito.map((producto) => (
                <li key={producto.id}>
                  {producto.nombre} - ${producto.precio}
                </li>
              ))}
            </ul>
          )}
          <h5 className="mt-3">Costo total: {calcularCostoTotal()} puntos</h5>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <h4>Seleccionar Dirección</h4>
          {loadingDirecciones ? (
            <p>Cargando direcciones...</p>
          ) : (
            <Form>
              {direcciones.length === 0 ? (
                <Alert variant="warning">
                  Sin direccion, favor de crear una direccion.
                </Alert>
              ) : (
                direcciones.map((direccion) => (
                  <Form.Check
                    key={direccion.idDireccion}
                    type="radio"
                    name="direccion"
                    label={`${direccion.calle} ${direccion.nro}, ${direccion.nomComuna.nombre}`}
                    value={direccion.idDireccion}
                    onChange={handleDireccionChange}
                  />
                ))
              )}
            </Form>
          )}
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <h4>Pago con puntos</h4>
          {loadingPuntos ? (
            <p>Cargando puntos...</p>
          ) : (
            <Form.Group>
              <Form.Label>Selecciona el tipo de puntos</Form.Label>
              <Form.Control
                as="select"
                value={tipoPuntos}
                onChange={(e) => setTipoPuntos(e.target.value)}
              >
                <option value="plas">Puntos generales</option>
                <option value="papel">Puntos de papel</option>
                <option value="vidrio">Puntos de vidrio</option>
                <option value="carton">Puntos de cartón</option>
                <option value="latas">Puntos de latas</option>
              </Form.Control>
            </Form.Group>
          )}
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Button
            variant="primary"
            onClick={handleConfirmarCompra}
            disabled={
              !direccionSeleccionada ||
              loadingDirecciones ||
              loadingPuntos ||
              carrito.length === 0
            }
          >
            Confirmar Compra
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutTienda;
