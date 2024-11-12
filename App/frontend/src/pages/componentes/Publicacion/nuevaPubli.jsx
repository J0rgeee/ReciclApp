import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';

const AgregarPublicacion = () => {
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState('');
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

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
      const response = await axios.post('/api/Publi/publi', formData, {
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
      <h2>Agregar Publicación</h2>
      {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form onSubmit={handleSubmit}>
        <div>
          <Form.Label>Descripción:</Form.Label>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Imagen:</label>
          <input
            type="file"
            onChange={handleFileChange} required 
          />
        </div>
        <button type="submit">Publicar</button>
      </Form>
    </div>
  );
};

export default AgregarPublicacion;
