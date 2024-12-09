import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, OverlayTrigger, Tooltip, Tab, Tabs } from "react-bootstrap";
import Swal from "sweetalert2";
import './admin.styles.css';
import { fetchNotificaciones, crearUsuario, actualizarUsuario, eliminarUsuario, cambiarEstadoUsuario, Alerta } from './AdminHome';
import notificacionService from "../../hooks/notificacionService";

// Configuración global para Axios
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

// Estado inicial del formulario
const initialFormState = {
  username: "",
  nombre: "",
  apellido: "",
  fechaNac: "",
  telefono: "",
};

const AdminUsuarios = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [key, setKey] = useState('inicio');
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [alerta, setAlerta] = useState({ tipo: "", mensaje: "" });
  const [showModal, setShowModal] = useState(false);
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
      const response = await axios.get("http://localhost:8000/api/adminusuario/");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const obtenerNotificaciones = async () => {
    try {
      const data = await notificacionService.listar();
      setNotificaciones(data);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las notificaciones', 'error');
    }
  };

  const eliminarNotificaciones = async (id) => {
    try {
      await notificacionService.eliminar(id);
      setNotificaciones(notificaciones.filter(n => n.id !== id));
      Swal.fire('Éxito', 'Notificación eliminada correctamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar la notificación', 'error');
    }
  };

  const marcarComoLeida = async (id) => {
    try {
      const response = await notificacionService.toggleLeido(id);
      setNotificaciones(notificaciones.map((n) =>
        n.id === id ? { ...n, leido: response.leido } : n
      ));
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el estado de la notificación', 'error');
    }
  };

  // Obtener lista de tipos de usuario
  const fetchTiposUsuario = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/adminusuario/list-tipo-user/"
      );
      setTiposUsuario(response.data);
    } catch (error) {
      console.error("Error al obtener los tipos de usuario:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchTiposUsuario();
    obtenerNotificaciones();
  }, []);

  // Manejar cambios en los formularios
  const handleChange = (e, isNuevo = false) => {
    const { name, value } = e.target;
    isNuevo
      ? setNuevoUsuario({ ...nuevoUsuario, [name]: value })
      : setFormulario({ ...formulario, [name]: value });
  };

  // Actualizar usuario
  const actualizarUser = async (e) => {
    e.preventDefault();
    const result = await actualizarUsuario(selectedUsuario.email, formulario)
    if (result.success) {
      Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      setShowModal(false);
      fetchUsuarios();
    } else {
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  };

  // Eliminar usuario
  const eliminarUser = async (email) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminarás al usuario con email: ${email}. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      const result = await eliminarUsuario(email)
      if (result.success) {
        setAlerta({ tipo: "success", mensaje: "Usuario eliminado exitosamente." });
        fetchUsuarios();
      } else {
        setAlerta({ tipo: "danger", mensaje: "No se pudo eliminar el usuario." });
      }
    }
  };

  // Cambiar estado del usuario
  const cambiarEstadoUser = async (email, estadoActual) => {
    const result = await cambiarEstadoUsuario(email, estadoActual)
    if (result.success) {
      setAlerta({
        tipo: "success",
        mensaje: `El usuario ha sido ${estadoActual ? "desactivado" : "activado"} exitosamente.`,
      });
      fetchUsuarios();
    } else {
      setAlerta({ tipo: "danger", mensaje: "No se pudo cambiar el estado del usuario." });
    }
  };

  // Crear nuevo usuario
  const crearUser = async (e) => {
    e.preventDefault();
    if (!nuevoUsuario.email || !nuevoUsuario.password || !nuevoUsuario.tipoUser) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    console.log("Datos a enviar:", nuevoUsuario);
    const result = await crearUsuario(nuevoUsuario);
    if (result.success) {
      setAlerta({ tipo: "success", mensaje: result.data.message });
      fetchUsuarios();
    } else {
      setAlerta({ tipo: "danger", mensaje: "No se pudo crear el usuario." });
    }
  };

  return (

    <div className="m-2 admin-usuarios">

      <Tabs
        id="tab"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-2"
        justify
      >
        <Tab eventKey="inicio" title="Lista de usuarios" className="tab">
          <div className="scroll">
            <Table bordered hover className="table-light shadow tabla-usuarios">
              <thead className="table-primary">
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Tipo Usuario</th>
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
                    <td>{usuario.tipoUser}</td>
                    <td>{usuario.telefono}</td>
                    <td>{usuario.estado ? "Activa" : "Inactiva"}
                      <Form.Check
                        type="switch"
                        checked={usuario.estado}
                        onChange={() => cambiarEstadoUser(usuario.email, usuario.estado)}
                      />
                    </td>
                    <td className="td">
                      <Button variant="warning"
                        className="btn-sm rounded-pill" onClick={() => setSelectedUsuario(usuario) || setShowModal(true)}>
                        ✏ Modificar
                      </Button>
                      <Button variant="danger ms-4"
                        className="btn-sm rounded-pill" onClick={() => eliminarUser(usuario.email)}>
                        ❌ Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Tab>
        <Tab eventKey="notificaciones" title="Notificaciones" className="tab">
          <div className="scroll">
            <h3>Notificaciones</h3>
            <ul>
              {notificaciones.map((notificacion) => (
                <li
                  key={notificacion.id}
                  className={`notificacion ${notificacion.leido ? 'leida' : 'no-leida'}`}>
                  <p><strong>{notificacion.usuario_email}</strong>: {notificacion.mensaje}
                    <p>{new Date(notificacion.fecha_envio).toLocaleString()}</p>
                  </p>
                  <div>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip>{notificacion.leido ? "Marcar como no leída" : "Marcar como leída"}</Tooltip>}
                    >
                      <Button className="btn-noti" onClick={() => marcarComoLeida(notificacion.id)}>
                        <img src={notificacion.leido ? "/botones/mark_chat_read.svg" : "/botones/chat_bubble.svg"}
                          alt={notificacion.leido ? "Leída" : "Marcar como leída"}></img>
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Borrar</Tooltip>}
                    >
                    <Button className="boton-delete-noti" onClick={() => eliminarNotificaciones(notificacion.id)}><img src="/botones/btn-delete.svg"></img></Button>
                    </OverlayTrigger>
                    
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Tab>
        <Tab eventKey="crearUser" title="Crear nuevo usuario" className="tab">
          <Form onSubmit={crearUser}>
            <Modal.Header>
              <Modal.Title>Crear Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {["email", "password", "tipoUser"].map((field) => (
                <Form.Group controlId={`formNuevo${field}`} key={field}>
                  <Form.Label>
                    {field === "tipoUser" ? "Tipo de Usuario" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </Form.Label>
                  {field === "tipoUser" ? (
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
              <Button variant="primary" type="submit">
                Crear Usuario
              </Button>
            </Modal.Footer>
          </Form>
        </Tab>
      </Tabs>

      {/* Modal para modificar usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={actualizarUser}>
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
      <Alerta alerta={alerta} setAlerta={setAlerta} />
    </div>
  );
};

export default AdminUsuarios;
