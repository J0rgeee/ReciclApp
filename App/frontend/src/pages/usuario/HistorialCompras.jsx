import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Table, Button, Spinner } from "react-bootstrap";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000",
});

const HistorialCompras = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistorialCompras = async () => {
    try {
      const response = await client.get("/api/pedidos/");
      setPedidos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener el historial de compras:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorialCompras();
  }, []);

  return (
    <Container>
      <h2 className="text-center mb-4">Historial de Compras</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Row>
          <Col>
            {pedidos.length === 0 ? (
              <p>No tienes compras realizadas aún.</p>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID Pedido</th>
                    <th>Fecha</th>
                    <th>Total en Puntos</th>
                    <th>Dirección</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>{pedido.id}</td>
                      <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                      <td>{pedido.puntos_utilizados}</td>
                      <td>{pedido.direccion.calle}</td>
                      <td>{pedido.estado ? "Completado" : "Pendiente"}</td>
                      <td>
                        <Button variant="info" onClick={() => alert(`Detalles del pedido ${pedido.id}`)}>
                          Ver detalles
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default HistorialCompras;
