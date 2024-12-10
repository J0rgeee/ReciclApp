import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ModalBody, ModalFooter, ModalTitle } from 'react-bootstrap';

const AgregarPublicacion = () => {
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [usuarioActivo, setUsuario] = useState(false); // Controla la autenticación del usuario
  const [show, setShow] = useState(false); // Controla la visibilidad del modal

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getCsrfToken = () => {
    const cookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : null;
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    // Obtener usuario autenticado
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user', { withCredentials: true });
        setCurrentUser(response.data.user);  // Supón que response.data contiene el objeto de usuario
        setUsuario(true);  // Usuario logueado
        console.log(response.data.user.email);
      } catch (error) {
        console.error("Error al obtener el usuario autenticado:", error);
        setUsuario(false);  // Si ocurre un error, el usuario no está autenticado
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('desc', desc);
    formData.append('emailUsuario', currentUser.email);
    formData.append('img', file);
    console.log(formData);

    try {
      // Realizar la solicitud POST al backend
      const response = await axios.post('http://localhost:8000/api/Publi/publi/', formData, {
        headers: {
          'X-CSRFToken': getCsrfToken(),  // Incluir el token CSRF si es necesario
        },
        withCredentials: true,  // Permitir envío de cookies de sesión
      });

      setMensajeExito("Publicación agregada exitosamente");
      setDesc('');
      setFile('');
      console.log('Publicación creada:', response.data);
    } catch (error) {
      setError("Error al agregar la publicación");
      console.error("Error al agregar publicación:", error.response.data);
    }
  };

  return (
    <div>
      {usuarioActivo && (  // Solo mostrar el botón si el usuario está logueado
        <Button id='nuevaPubli' variant="light" onClick={handleShow} className='boton-fijo'>
          Nueva Publicación
        </Button>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <ModalTitle>Agregar Publicación</ModalTitle>
        </Modal.Header>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <div className='mb-2'>
              <Form.Label>Descripción:</Form.Label>
              <Form.Control
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </div>
            <div className='mb-2'>
              <Form.Label>Imagen:</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
              />
            </div>
            <Button type="submit" className='m-2'>Publicar</Button>
          </Form>
        </ModalBody>
        <Modal.Footer>
          {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AgregarPublicacion;
