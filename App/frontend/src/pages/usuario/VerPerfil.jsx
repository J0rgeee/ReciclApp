import React from 'react';
import axios from 'axios';
import  { useState,useEffect } from 'react';
import { Button,Form, } from 'react-bootstrap';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});



const VerPerfil = ({usuario}) => {


  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [nomUsuario, setNomUsaurio] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nac, setNac] = useState('');
  const [activa,setActiva] = useState(false);
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


  function submitUpdate(e) {
    e.preventDefault();
    client.put("/api/user/update",{
      email: correo,
      username: nomUsuario,
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      estado: activa,
    }
  ).then(function (res) {
      setSuccess('Usuario actualizado con éxito!');
      setError(null);
      
    })
      .catch(function (error) {
        setError('Error al actualizar el usuario.');
      setSuccess(null);
      });
}



  return (
      <div style={{ marginLeft: '250px', flexGrow: 1 }}>
          <Form style={{ margin: '20px' }} onSubmit={e => submitUpdate(e)}>
            <Button variant="secondary" onClick={toggleDisableFields} style={{ marginTop: '20px' }}>
              {isDisabled ? 'Modificar Perfil' :'No modificar' }
              
            </Button>
            <Button variant="danger" onClick={DesactivarCuenta}>
              Eliminar Perfil
            </Button>
            
            
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder={usuario.email} disabled={isDisabled} value={usuario.email}  onChange={e => setCorreo(e.target.value)}/>
            </Form.Group>

            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder={usuario.username} disabled={isDisabled} value={usuario.username}  onChange={e => setNomUsaurio(e.target.value)}/>
            </Form.Group>

            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder={usuario.nombre} disabled={isDisabled} value={usuario.nombre}  onChange={e => setNombre(e.target.value)}/>
            </Form.Group>

            <Form.Group controlId="formApellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control type="text" placeholder={usuario.apellido} disabled={isDisabled} value={usuario.apellido}  onChange={e => setApellido(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formFechaNacimiento">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control type="date" disabled={isDisabled} />
            </Form.Group>

            <Form.Group controlId="formTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="tel" placeholder={usuario.telefono} disabled={isDisabled}  value={usuario.telefono}  onChange={e => setTelefono(e.target.value)} />
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
<Button variant="secondary" type='submit' style={{ marginTop: '20px' }} >  Guarda Cambios</Button>
{success && <div className="alert alert-success mt-3">{success}</div>}
{error && <div className="alert alert-danger mt-3">{error}</div>}
          </Form>
      </div>
  );
};

//Codigo para desactivar cuenta
const DesactivarCuenta = () => {
  const desactivarCuenta = async () => {
    if (window.confirm('¿Estás seguro de que deseas desactivar tu cuenta?')) {
      try {
        const token = localStorage.getItem('token');  // Obtener el token de autenticación
        const response = await axios.delete('/api/desactivar-cuenta/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          alert('Tu cuenta ha sido desactivada. Revisa tu correo para más información.');
          // Opcional: Redirigir al usuario a la página de inicio
          window.location.href = '/sesion';
        }
      } catch (error) {
        console.error('Error al desactivar la cuenta:', error);
        alert('Hubo un problema al desactivar tu cuenta.');
      }
    }
  };
  
  return (
    <div>
      <h1>Desactivar cuenta</h1>
      <Button onClick={desactivarCuenta}>Desactivar mi cuenta</Button>
    </div>
  )
};

export default VerPerfil;