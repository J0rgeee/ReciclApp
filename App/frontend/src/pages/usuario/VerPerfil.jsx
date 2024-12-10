import React from 'react';
import axios from 'axios';
import  { useState,useEffect } from 'react';
import { Button,Form,Modal,Row,Stack,Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import './sidebar.style.css';
import { useNavigate } from 'react-router-dom';
const csrftoken = Cookies.get('csrftoken');


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});

// Función para obtener el token CSRF
const getCsrfToken = () => {
  const cookie = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("csrftoken="));
  return cookie ? cookie.split("=")[1] : null;
};


const VerPerfil = ({usuario}) => {

  const navigate = useNavigate(); 
  const [file, setFile] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const [formulario,setFormulario] = useState({
    email: '',
    username: '',
    nombre: '',
    apellido: '',
    telefono: ''
});

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const toggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
  };

  const toggleDisableFields = () => {
    setIsDisabled(!isDisabled); // Alternar el estado de habilitación
  };
   useEffect(() => {

  }, []);

  const handleDelete = async () => {
    try {
      await client.delete(`api/user/delete/`, {
        headers: { "X-CSRFToken": getCsrfToken() },
      });
      console.log('Elemento eliminado');
      await client.post("/api/logout", { withCredentials: true });
      // Limpiar el localStorage
      localStorage.clear();
      Swal.fire("Éxito", "Su cuenta ha sido desactivada", "success");
      navigate("/Sesion");  // Usar navigate en lugar de Navigate
    } catch(error) {
      console.log("Error al desactivar la cuenta:", error.response)
      Swal.fire("Error", "Su cuenta no ha podido ser desactivada", "error");
    }
  };


  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Añadir los campos al FormData
      formData.append('email', usuario.email);
      formData.append('username', formulario.username);
      formData.append('nombre', formulario.nombre);
      formData.append('apellido', formulario.apellido);
      formData.append('telefono', formulario.telefono);
      
      // Añadir la foto si existe
      if (file) {
        formData.append('foto', file);
      }

      await client.put(`/api/user/update/${usuario.email}/`, formData, {
        headers: {
          'X-CSRFToken': csrftoken,
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Usuario Actualizado con éxito',
      });
    } catch (error) {
      console.log({error});
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al Actualizar Usuario',
      });
    }  
  };


  return (
      <div className='div-perfil'>
          
        <Stack direction='horizontal' gap={2} className='p-3 justify-content-center'>
          <Button variant="secondary" onClick={toggleDisableFields}>
            {isDisabled ? 'Modificar Perfil' :'No modificar' }
          </Button>
          <Button variant="danger" onClick={handleShow}>
            Desactivar cuenta
          </Button>
        </Stack>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación de Desactivacion</Modal.Title>
          </Modal.Header>
          <Modal.Body>¿Estás seguro de que deseas desactivar tu cuenta?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
          <Form className='m-3' onSubmit={e => submitUpdate(e)}>
            <Row className='mb-3'>
              <Form.Group as={Col} controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" disabled name='email' value={usuario.email}/>
              </Form.Group>

              <Form.Group as={Col} controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder={usuario.username} disabled={isDisabled}  name='username' value={formulario.username} onChange={handleChange}/>
              </Form.Group>
            </Row>
            <Row className='mb-3'>
            <Form.Group as={Col} controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder={usuario.nombre} disabled={isDisabled} name='nombre' value={formulario.nombre} onChange={handleChange}/>
            </Form.Group>

            <Form.Group as={Col} controlId="formApellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control type="text" placeholder={usuario.apellido} disabled={isDisabled} name='apellido' value={formulario.apellido} onChange={handleChange} />
            </Form.Group>
            </Row>
            <Row className='mb-3'>
              <Form.Group as={Col} controlId="formFechaNacimiento">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control type="date" disabled={isDisabled}   value={formulario.fechaNac}/>
              </Form.Group>
            </Row>
            <Row className='mb-3'>
              <Form.Group as={Col} controlId="formTelefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control type="tel" placeholder={usuario.telefono} disabled={isDisabled}  name='telefono' value={formulario.telfono} onChange={handleChange} />
              </Form.Group>
            </Row>
            <Row lg={2} className='mb-3'>
              <Form.Group as={Col} controlId="formFoto">
                <Form.Label>Foto</Form.Label>
                <Form.Control type="file" disabled={isDisabled} placeholder={file} onChange={handleFileChange} />
              </Form.Group>
              </Row>
            <Button variant="secondary" type='submit'>Guarda Cambios</Button>

          </Form>
        </div>
  );
};

export default VerPerfil;