import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ModalBody, ModalFooter, ModalTitle } from 'react-bootstrap';

const AgregarPublicacion = () => {
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState('');
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);
  //Boton Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getCsrfToken = () => {
    const cookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : null;
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
     e.preventDefault();
    const formData = new FormData();
    formData.append('desc', desc);
    //formData.append('emailUsuario', userEmail);
    formData.append('img', file);

    try {
      
      // Realizar la solicitud POST al backend
      const response = await axios.post('http://localhost:8000/api/Publi/publi', formData, {
        headers: {
          'Content-Type': 'application/json',
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
      <Button variant="light" onClick={handleShow} className='boton-fijo'>
        Nueva Publicacion
      </Button>
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
