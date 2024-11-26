import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Alert, Button, Modal } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Swal from "sweetalert2";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const getCsrfToken = () => {
  const cookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : null;
};

const AdminUsuarios = () => {
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [alerta, setAlerta] = useState({ tipo: '', mensaje: '' });
  const [todosUsuarios, setTodosUsuarios] = useState([].sort((a, b) => a - b));
  const [formulario, setFormulario] = useState({
    email: "",
    username: "",
    nombre: "",
    apellido: "",
    telefono: "",
  });

  const TodosUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/AdminUsuario/adminusuario/');
      setTodosUsuarios(response.data);
      console.log(todosUsuarios);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

    // Obtener la lista de tipos de usuario
    useEffect(() => {
      const fetchTiposUsuario = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/AdminUsuario/adminusuario/list-tipo-user/"
          );
          setTiposUsuario(response.data);
        } catch (error) {
          console.error("Error al obtener los tipos de usuario:", error);
        }
      };
  
      fetchTiposUsuario();
    }, []);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (usuario) => {
    setSelectedUsuario(usuario);
    setFormulario(usuario); // Rellena el formulario con los datos del usuario seleccionado
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/user/update/${selectedUsuario.email}/`, formulario, {
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': getCsrfToken(),  // Incluye el token CSRF en los encabezados
        },
        withCredentials: true,
      });
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Usuario actualizado correctamente",
      });
      handleCloseModal();
      TodosUsuarios();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar el usuario",
      });
    }
  };

  const eliminarUsuario = async (email) => {
    const resultado = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminarás al usuario con email: ${email}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (resultado.isConfirmed) {
      try {
        
        await axios.delete(
          `http://localhost:8000/api/AdminUsuario/adminusuario/delete-by-email/`, {
          data: { email: email },
          headers: {
            'X-CSRFToken': getCsrfToken(),  // Incluye el token CSRF en los encabezados
          },
          withCredentials: true,
        }
        );
        setAlerta({ tipo: 'success', mensaje: "Usuario eliminado exitosamente." });
        TodosUsuarios(); // Actualiza la lista
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        setAlerta({ tipo: 'danger', mensaje: "No se pudo eliminar el usuario." });
      } 
    } else {
      setAlerta({ tipo: 'info', mensaje: "Eliminación cancelada." });
    }
  };

  const cambiarEstadoUsuario = async (email, estadoActual) => {
    try {
      const encodedEmail = encodeURIComponent(email);
      await axios.put(
        `http://localhost:8000/api/user/desactivar-cuenta/${encodedEmail}`,
        { estado: !estadoActual }, {
        headers: {
          'X-CSRFToken': getCsrfToken(),  // Incluye el token CSRF en los encabezados
        },
        withCredentials: true,
      }
      );
      setAlerta({
        tipo: 'success',
        mensaje: `El usuario ha sido ${estadoActual ? "desactivado" : "activado"} exitosamente.`
      });
      TodosUsuarios(); // Actualiza la lista
    } catch (error) {
      console.error("Error al cambiar el estado del usuario:", error);
      setAlerta({ tipo: 'danger', mensaje: "No se pudo cambiar el estado del usuario." });
    }
  };

  const [showModal2, setShowModal2] = useState(false);
  const handleShowmodal2 = () => setShowModal2(true);
  const handleClosemodal2 = () => setShowModal2(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");

  const crearUsuario = async (e) => {
    e.preventDefault();

    if (!email || !password || !tipoUsuario) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:8000/api/AdminUsuario/adminusuario/create-user/',
        {
          email: email,
          password: password,
          tipoUser: tipoUsuario,
        },
        {
          headers: {
            'X-CSRFToken': getCsrfToken(),  // Token CSRF para seguridad
          },
          withCredentials: true,
        }
      );
      setAlerta({ tipo: 'success', mensaje: response.data.message });
      TodosUsuarios(); // Actualizar la lista de usuarios si aplica
      handleClosemodal2();
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      setAlerta({ tipo: 'danger', mensaje: "No se pudo crear el usuario." });
    }
  };

  useEffect(() => {
    TodosUsuarios();
  }, []);

  return (
    <div className="div">

      {/* Mostrar la alerta si existe */}
      {alerta.mensaje && (
        <Alert variant={alerta.tipo} onClose={() => setAlerta({ tipo: '', mensaje: '' })} dismissible>
          {alerta.mensaje}
        </Alert>
      )}

      <Table bordered hover >
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Username</th>
            <th>Email</th>
            <th>Fecha Nacimineto</th>
            <th>Telefono</th>
            <th>Estado Cuenta</th>
            <th >Acciones</th>
          </tr>
        </thead>
        <tbody>
          {todosUsuarios.slice().sort((a, b) => a.email.localeCompare(b.email)).map((usuario) => (
            <tr key={usuario.email}>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.username}</td>
              <td>{usuario.email}</td>
              <td>{usuario.fechaNac}</td>
              <td>{usuario.telefono}</td>
              <td >{usuario.estado ? "Activa" : "Inactiva"}</td>
              <td className="tr">
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={usuario.estado}
                  label=""

                  onClick={() => cambiarEstadoUsuario(usuario.email, usuario.estado)}
                />
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(usuario)}
                >
                  Modificar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => eliminarUsuario(usuario.email)}
                >
                  Eliminar
                </Button>

              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <Button variant="danger" onClick = {handleShowmodal2}>
        Agregar Usuario
      </Button>

      {/* Modal para crear usuario */}
      <Modal show={showModal2} onHide={handleClosemodal2}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Usuario</Modal.Title>
        </Modal.Header>
        <Form onSubmit={crearUsuario}>
          <Modal.Body>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="tipoUser">
              <Form.Label>Tipo de Usuario</Form.Label>
              <Form.Control
                as="select"
                value={tipoUsuario}
                onChange={(e) => setTipoUsuario(e.target.value)}
              >
                <option value="">Selecciona un tipo de usuario</option>
                {tiposUsuario.map((tipo) => (
                  <option key={tipo.idTR} value={tipo.idTR}>
                    {tipo.desc}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosemodal2}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Crear Usuario
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal para modificar usuario */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Usuario</Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitUpdate}>
          <Modal.Body>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formApellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={formulario.apellido}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formulario.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="telefono"
                value={formulario.telefono}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsuarios;