import React from 'react';
import axios from 'axios';
import  { useState,useEffect } from 'react';
import { Button,Form,Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});



const VerPerfil = ({usuario}) => {

  const [formulario,setFormulario] = useState({
    email: '',
    username: '',
    nombre: '',
    apellido: '',
    telefono: ''
});
  const encodedEmail = encodeURIComponent(formulario.email);


  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  const handleDelete = () => {
    // Aquí va la lógica de eliminación
    console.log('Elemento eliminado');
    handleClose(); // Cierra el modal después de eliminar
  };


  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    try {
      await client.put(`/api/user/update/`, {
        email : formulario.email,
        username : formulario.username,
        nombre : formulario.nombre,
        apellido : formulario.apellido,
        telefono : formulario.telefono
      },{
        headers: {
          'Content-Type': 'application/json'
        }
      });
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Mensaje enviado con éxito!',
      });
    } catch (error) {
      console.log({formulario})
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al crear el contacto.',
      });
    }  
  };


  return (
      <div style={{ marginLeft: '250px', flexGrow: 1 }}>
          <Form style={{ margin: '20px' }} onSubmit={e => submitUpdate(e)}>
            <Button variant="secondary" onClick={toggleDisableFields}>
              {isDisabled ? 'Modificar Perfil' :'No modificar' }
            </Button>
            <Button variant="danger" onClick={handleShow}>
              Desactivar cuenta
            </Button>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Confirmación de Eliminación</Modal.Title>
              </Modal.Header>
              <Modal.Body>¿Estás seguro de que deseas eliminar este elemento?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Confirmar
                </Button>
              </Modal.Footer>
            </Modal>
            
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder={usuario.email} disabled={isDisabled} name='email' value={formulario.email} onChange={handleChange}/>
            </Form.Group>

            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder={usuario.username} disabled={isDisabled}  name='username' value={formulario.username} onChange={handleChange}/>
            </Form.Group>

            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder={usuario.nombre} disabled={isDisabled} name='nombre' value={formulario.nombre} onChange={handleChange}/>
            </Form.Group>

            <Form.Group controlId="formApellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control type="text" placeholder={usuario.apellido} disabled={isDisabled} name='apellido' value={formulario.apellido} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="formFechaNacimiento">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control type="date" disabled={isDisabled}   value={formulario.fechaNac}/>
            </Form.Group>

            <Form.Group controlId="formTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="tel" placeholder={usuario.telefono} disabled={isDisabled}  name='telefono' value={formulario.telfono} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="formFoto">
              <Form.Label>Foto</Form.Label>
              <Form.Control type="file" disabled={isDisabled} />
            </Form.Group>

            <Button variant="primary" onClick={toggleChangePassword}>
              Cambiar Contraseña
            </Button>

            {showChangePassword && (
              <div style={{ marginTop: '20px' }}>
                <Form.Group controlId="formNewPassword">
                  <Form.Label>Nueva Contraseña</Form.Label>
                  <Form.Control type="password" placeholder={usuario.password} disabled={isDisabled} />
                </Form.Group>
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control type="password" placeholder={usuario.password} disabled={isDisabled} />
                </Form.Group>
              </div>
            )}
            <Button variant="secondary" type='submit'>Guarda Cambios</Button>
            {success && <div className="alert alert-success mt-3">{success}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </Form>
        </div>
  );
};

export default VerPerfil;