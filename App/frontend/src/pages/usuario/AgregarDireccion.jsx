import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form ,Modal} from 'react-bootstrap';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import withReactContent from 'sweetalert2-react-content';


const MySwal = withReactContent(Swal);
// Obtén el token CSRF
const csrftoken = Cookies.get('csrftoken');

const client = axios.create({
  baseURL: "http://localhost:8000",
  headers: { 'X-CSRFToken': csrftoken }, // Incluir CSRF token en los headers
});

function AgregarDireccion({emailUser}) {
    const [comunas, setComunas] = useState([]);
    const [formData, setFormData] = useState({
      calle: '',
      nro: '',
      nomComuna: '', // Almacenaremos el id de la comuna seleccionada
      emailUser: emailUser, // Este valor lo debes establecer en el frontend
    });
  
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  
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
  
    // Función para manejar cambios en los campos del formulario
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    // Función para enviar el formulario y crear la dirección
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formData);
    
      client.post('/api/Dire/direcciones/', formData)
        .then(response => {
          MySwal.fire({
            title: 'Dirección creada exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
          setFormData({
            calle: '',
            nro: '',
            nomComuna: '',
            emailUser: '',
          });
          setShowModal(false); // Cerrar el modal después de enviar los datos
          setTimeout(() => {
            window.location.reload(); // Refrescar la pestaña después de 5 segundos
          }, 3500);
        })
        .catch(error => {
          MySwal.fire({
            title: 'Error',
            text: 'Hubo un error al crear la dirección',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
          console.error("Error al crear la dirección:", error);
        });
    };
    return (
      <div className="text-center">
        {/* Botón para abrir el modal */}
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Agregar Dirección
        </Button>
  
        {/* Modal para crear una nueva dirección */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Dirección</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formCalle">
                <Form.Label>Calle</Form.Label>
                <Form.Control
                  type="text"
                  name="calle"
                  value={formData.calle}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
  
              <Form.Group controlId="formNumero">
                <Form.Label>Número</Form.Label>
                <Form.Control
                  type="number"
                  name="nro"
                  value={formData.nro}
                  onChange={handleChange}
                  required
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
  
              <Button variant="success" type="submit">
                Crear Dirección
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
  

export default AgregarDireccion;