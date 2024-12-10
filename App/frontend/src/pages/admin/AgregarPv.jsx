import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

function AgregarPv() {
  const [show, setShow] = useState(false);
  const [comunas, setComunas] = useState([]);
  const [formData, setFormData] = useState({
    "nombre": '',
    "direccion": '',
    "nro": '',
    "estado": false,
    "nomComuna": '',
    "lat": 0,
    "lng": 0
  });

  const resetForm = () => {
    setFormData({
        "nombre": '',
        "direccion": '',
        "nro": '',
        "estado": false,
        "nomComuna": ''
    });
};

useEffect(() => {
  // Obtener las comunas disponibles
  client.get('/api/Comuna/comuna/')
    .then(response => {
      setComunas(response.data);
    })
    .catch(error => {
      console.error("Error al obtener las comunas:", error);
    });
}, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(formData);
        await client.post(`/api/PtoVerde/crear/`,
            formData    
            ,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Punto Verde agregado con éxito!',
        });
        resetForm();
        handleClose();
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al crear el Punto Verde.',
        });
    }  
  };


  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Agregar Punto Verde
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Formulario Punto Verde</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDireccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formNro">
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="number"
                name="nro"
                value={formData.nro}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEstado">
              <Form.Check
                type="checkbox"
                label="Estado"
                name="estado"
                checked={formData.estado}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formComuna">
                <Form.Label>Comuna</Form.Label>
                <Form.Control
                  as="select"
                  name="nomComuna"
                  value={formData.nomComuna}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una comuna</option>
                  {comunas.map(comuna => (
                    <option key={comuna.idComuna} value={comuna.idComuna}>
                      {comuna.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AgregarPv;
