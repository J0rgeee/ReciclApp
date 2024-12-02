import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Alert, Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import './admin.styles.css';

// Configuración global para Axios
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

// Función para obtener el token CSRF
const getCsrfToken = () => {
  const cookie = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("csrftoken="));
  return cookie ? cookie.split("=")[1] : null;
};

// Estado inicial del formulario
const initialFormState = {
  email: "",
  username: "",
  nombre: "",
  apellido: "",
  telefono: "",
};

const AdminUsuarios = () => {
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [alerta, setAlerta] = useState({ tipo: "", mensaje: "" });
  const [showModal, setShowModal] = useState(false);
  const [showModalCrear, setShowModalCrear] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [formulario, setFormulario] = useState(initialFormState);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    email: "",
    password: "",
    tipoUsuario: "",
  });

  // Obtener lista de usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/AdminUsuario/adminusuario/");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  // Obtener lista de tipos de usuario
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

  useEffect(() => {
    fetchUsuarios();
    fetchTiposUsuario();
  }, []);

  // Manejar cambios en los formularios
  const handleChange = (e, isNuevo = false) => {
    const { name, value } = e.target;
    isNuevo
      ? setNuevoUsuario({ ...nuevoUsuario, [name]: value })
      : setFormulario({ ...formulario, [name]: value });
  };

  // Actualizar usuario existente
  const actualizarUsuario = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/api/user/update/${selectedUsuario.email}/`,
        formulario,
        {
          headers: { "X-CSRFToken": getCsrfToken() },
        }
      );
      Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      setShowModal(false);
      fetchUsuarios();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (email) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminarás al usuario con email: ${email}. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/AdminUsuario/adminusuario/delete-by-email/`, {
          data: { email },
          headers: { "X-CSRFToken": getCsrfToken() },
        });
        setAlerta({ tipo: "success", mensaje: "Usuario eliminado exitosamente." });
        fetchUsuarios();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        setAlerta({ tipo: "danger", mensaje: "No se pudo eliminar el usuario." });
      }
    }
  };

  // Cambiar estado del usuario
  const cambiarEstadoUsuario = async (email, estadoActual) => {
    try {
      await axios.put(
        `http://localhost:8000/api/user/desactivar-cuenta/${encodeURIComponent(email)}`,
        { estado: !estadoActual },
        {
          headers: { "X-CSRFToken": getCsrfToken() },
        }
      );
      setAlerta({
        tipo: "success",
        mensaje: `El usuario ha sido ${estadoActual ? "desactivado" : "activado"} exitosamente.`,
      });
      fetchUsuarios();
    } catch (error) {
      console.error("Error al cambiar el estado del usuario:", error);
      setAlerta({ tipo: "danger", mensaje: "No se pudo cambiar el estado del usuario." });
    }
  };

  // Crear nuevo usuario
  const crearUsuario = async (e) => {
    e.preventDefault();
    if (!nuevoUsuario.email || !nuevoUsuario.password || !nuevoUsuario.tipoUsuario) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/AdminUsuario/adminusuario/create-user/",
        nuevoUsuario,
        {
          headers: { "X-CSRFToken": getCsrfToken() },
        }
      );
      setAlerta({ tipo: "success", mensaje: response.data.message });
      fetchUsuarios();
      setShowModalCrear(false);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setAlerta({ tipo: "danger", mensaje: "No se pudo crear el usuario." });
    }
  };

  return (
    <div className="m-2">
      {alerta.mensaje && (
        <Alert variant={alerta.tipo} onClose={() => setAlerta({ tipo: "", mensaje: "" })} dismissible>
          {alerta.mensaje}
        </Alert>
      )}

      <Table bordered hover className="table-light shadow tabla-usuarios">
        <thead className="thead">
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Username</th>
            <th>Email</th>
            <th>Fecha Nacimiento</th>
            <th>Teléfono</th>
            <th>Estado Cuenta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.email}>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.username}</td>
              <td>{usuario.email}</td>
              <td>{usuario.fechaNac}</td>
              <td>{usuario.telefono}</td>
              <td>{usuario.estado ? "Activa" : "Inactiva"}
                <Form.Check
                  type="switch"
                  checked={usuario.estado}
                  onChange={() => cambiarEstadoUsuario(usuario.email, usuario.estado)}
                />
              </td>
              <td>
                <Button variant="warning"
                className="btn-sm rounded-pill" onClick={() => setSelectedUsuario(usuario) || setShowModal(true)}>
                  ✏ Modificar
                  </Button>
                <Button variant="danger"
                  className="btn-sm rounded-pill" onClick={() => eliminarUsuario(usuario.email)}>
                  ❌ Eliminar
                  </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="primary" onClick={() => setShowModalCrear(true)}>
        Agregar Usuario
      </Button>

      {/* Modal para modificar usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={actualizarUsuario}>
          <Modal.Header closeButton>
            <Modal.Title>Modificar Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {Object.keys(initialFormState).map((key) => (
              <Form.Group controlId={`form${key}`} key={key}>
                <Form.Label>{key}</Form.Label>
                <Form.Control
                  type="text"
                  name={key}
                  value={formulario[key] || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal para crear usuario */}
      <Modal show={showModalCrear} onHide={() => setShowModalCrear(false)}>
        <Form onSubmit={crearUsuario}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {["email", "password", "tipoUsuario"].map((field) => (
              <Form.Group controlId={`formNuevo${field}`} key={field}>
                <Form.Label>
                  {field === "tipoUsuario" ? "Tipo de Usuario" : field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                {field === "tipoUsuario" ? (
                  <Form.Control
                    as="select"
                    name={field}
                    value={nuevoUsuario[field] || ""}
                    onChange={(e) => handleChange(e, true)}
                  >
                    <option value="">Selecciona un tipo de usuario</option>
                    {tiposUsuario.map((tipo) => (
                      <option key={tipo.idTR} value={tipo.idTR}>
                        {tipo.desc}
                      </option>
                    ))}
                  </Form.Control>
                ) : (
                  <Form.Control
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    value={nuevoUsuario[field] || ""}
                    onChange={(e) => handleChange(e, true)}
                  />
                )}
              </Form.Group>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalCrear(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Crear Usuario
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsuarios;
