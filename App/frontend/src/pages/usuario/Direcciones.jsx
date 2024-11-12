import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spinner, Button, Modal, Form } from "react-bootstrap";
import Cookies from "js-cookie";
import AgregarDireccion from "./AgregarDireccion";

const csrftoken = Cookies.get("csrftoken");

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000",
});

function Direcciones({ email }) {
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comunas, setComunas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [direccionEdit, setDireccionEdit] = useState(null);

  useEffect(() => {
    client
      .get(`/api/direcciones/${email}/`)
      .then((response) => {
        setDirecciones(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("El usuario no tiene ninguna direccion registrada");
        setLoading(false);
      });

    client
      .get("/api/Comuna/comuna/")
      .then((response) => {
        setComunas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las comunas:", error);
      });
  }, [email]);

  // Función para manejar la apertura del modal de edición
  const handleEditClick = (direccion) => {
    setDireccionEdit(direccion);
    console.log(direccion);
    setShowModal(true);
  };

  // Función para manejar el cierre del modal
  const handleCloseModal = () => {
    setShowModal(false);
    setDireccionEdit(null);
  };

  // Función para manejar el cambio de datos en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nomComuna") {
      setDireccionEdit((prev) => ({
        ...prev,
        [name]: name === "nomComuna" ? value : value, // Almacenamos el objeto con el id de la comuna
      }));
    } else {
      setDireccionEdit((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Función para manejar el envío del formulario de edición
  const handleSubmit = (e) => {
    e.preventDefault();
    client
      .patch(
        `/api/direcciones/update/${direccionEdit.idDireccion}/`,
        direccionEdit,
        { headers: { "X-CSRFToken": csrftoken } }
      )
      .then((response) => {
        // Actualiza las direcciones después de la edición exitosa
        const updatedDirecciones = direcciones.map((d) =>
          d.idDireccion === direccionEdit.idDireccion ? response.data : d
        );
        setDirecciones(updatedDirecciones);
        handleCloseModal();
      })
      .catch((error) => {
        console.log(error);
        console.log(direccionEdit);
        setError("Error al editar la dirección");
      });
  };
  return (
    <>
    <div>
      <h3>Direcciones del Usuario</h3>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Calle</th>
              <th>Número</th>
              <th>Comuna</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {direcciones.length > 0 ? (
              direcciones.map((direccion) => (
                <tr key={direccion.idDireccion}>
                  <td>{direccion.idDireccion}</td>
                  <td>{direccion.calle}</td>
                  <td>{direccion.nro}</td>
                  <td>
                    {comunas.find(
                      (comuna) => comuna.idComuna === direccion.nomComuna
                    )?.nombre || "Comuna no encontrada"}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleEditClick(direccion)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay direcciones registradas.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal para editar la dirección */}
      {direccionEdit && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Dirección</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formCalle">
                <Form.Label>Calle</Form.Label>
                <Form.Control
                  type="text"
                  name="calle"
                  value={direccionEdit.calle || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formNumero">
                <Form.Label>Número</Form.Label>
                <Form.Control
                  type="number"
                  name="nro"
                  value={direccionEdit.nro || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formComuna">
                <Form.Label>Comuna</Form.Label>
                <Form.Control
                  as="select"
                  name="nomComuna"
                  value={
                    direccionEdit.nomComuna
                      ? direccionEdit.nomComuna.idComuna
                      : ""
                  }
                  onChange={handleChange}
                >
                  {comunas.map((comuna) => (
                    <option key={comuna.idComuna} value={comuna.idComuna}>
                      {comuna.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                Guardar cambios
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
    <AgregarDireccion emailUser={email}/>
    </>
  );
}

export default Direcciones;
