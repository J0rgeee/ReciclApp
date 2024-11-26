import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Alert, Button, Fade, Tab } from "react-bootstrap";
import Form from 'react-bootstrap/Form';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const getCsrfToken = () => {
  const cookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : null;
};

const AdminPubli = () => {
  const [publicaciones, setPublicaciones] = useState({ aprobadas: [], pendientes: [] });
  const [loading, setLoading] = useState(true);

  const [alerta, setAlerta] = useState({ tipo: '', mensaje: '' });

  const [show, setShow] = useState(false);

  //------------------------------------------Popup mensajes de alerta---------------------------------------------------------------------//
  const Popup = ({ type, message, onClose }) => {
    // Determinar el estilo del popup según el tipo
    const popupClass = type === 'success' ? 'popup success' : 'popup error';

    return (
      <div className={popupClass}>
        <span>{message}</span>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
    );
  };

  const [popup, setPopup] = useState({ visible: false, message: '', type: '' });

  const showPopup = (message, type) => {
    setPopup({ visible: true, message, type });
    setTimeout(() => {
      setPopup({ visible: false, message: '', type: '' });
    }, 3000); // El popup desaparecerá después de 3 segundos
  };
  //------------------------------------------Popup mensajes de alerta---------------------------------------------------------------------//

  //------------------------------------------Popup imagen---------------------------------------------------------------------//

  const [popupimg, setPopupimg] = useState({ visible: false, imgSrc: '' });

  const openPopup = (imgSrc) => {
    setPopupimg({ visible: true, imgSrc });
  };

  const closePopup = () => {
    setPopupimg({ visible: false, imgSrc: '' });
  };

  //------------------------------------------Popup imagen---------------------------------------------------------------------//

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };


  useEffect(() => {
    const fetchPublicaciones = async () => {
      setLoading(true);
      try {
        const pendientesRes = await axios.get('http://localhost:8000/api/pendientes/');
        const aprobadasRes = await axios.get('http://localhost:8000/api/Publi/publi/');
        setPublicaciones({
          pendientes: pendientesRes.data,
          aprobadas: aprobadasRes.data,
        });
      } catch (error) {
        console.error('Error al obtener publicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicaciones();
  }, []);

  const aprobarPost = async (postId) => {
    try {
      await axios.patch(`http://localhost:8000/api/pendientes/${postId}/aprobar/`, {}, {
        headers: {
          'X-CSRFToken': getCsrfToken(),  // Incluye el token CSRF en los encabezados
        },
        withCredentials: true,
      });
      // Actualizar el estado directamente después de la aprobación
      setPublicaciones((prev) => {
        const postAprobado = prev.pendientes.find((post) => post.idPublicacion === postId);
        return {
          ...prev,
          pendientes: prev.pendientes.filter((post) => post.idPublicacion !== postId),
          aprobadas: [...prev.aprobadas, postAprobado],
        };
      });
      setAlerta({ tipo: 'success', mensaje: "Publicacion aprobada con éxito" });
    } catch (error) {
      console.error('Error al aprobar la publicación:', error);
      setAlerta({ tipo: 'danger', mensaje: "Error al aprobar la publicacion" });
    }
  };

  const desaprobarPost = async (postId) => {
    try {
      await axios.patch(`http://localhost:8000/api/pendientes/${postId}/desaprobar/`, {}, {
        headers: {
          'X-CSRFToken': getCsrfToken(),  // Incluye el token CSRF en los encabezados
        },
        withCredentials: true,
      });

      // Actualizar el estado directamente después de la desaprobación
      setPublicaciones((prev) => {
        const postDesaprobado = prev.aprobadas.find((post) => post.idPublicacion === postId);
        return {
          ...prev,
          aprobadas: prev.aprobadas.filter((post) => post.idPublicacion !== postId),
          pendientes: [...prev.pendientes, postDesaprobado],
        };
      });

      setAlerta({ tipo: 'success', mensaje: "Publicacion pendiente" });
    } catch (error) {
      console.error('Error al desaprobar la publicación:', error);
      setAlerta({ tipo: 'danger', mensaje: "Ocurrió un error al desaprobar la publicación" });
    }
  };

  const eliminarPost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8000/api/pendientes/${postId}/eliminar/`, {
        headers: {
          'X-CSRFToken': getCsrfToken(),  // Incluye el token CSRF en los encabezados
        },
        withCredentials: true,
      });

      setPublicaciones((prev) => ({
        ...prev,
        pendientes: prev.pendientes.filter((post) => post.idPublicacion !== postId),
      }));

      setAlerta({ tipo: 'success', mensaje: "Publicacion eliminada con éxito" });
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
      setAlerta({ tipo: 'danger', mensaje: "Ocurrió un error al eliminar la publicación" });
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="m-2">
      

      {/* Mostrar la alerta si existe */}
      {alerta.mensaje && (
        <Alert variant={alerta.tipo} onClose={() => setAlerta({ tipo: '', mensaje: '' })} dismissible>
          {alerta.mensaje}
        </Alert>
      )}

      {/* popup imagen */}
      {popupimg.visible && (
        <div className="popupImg" onClick={closePopup}>
          <div className="fondoimg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={popupimg.imgSrc}
              alt="Imagen"
              className="imgdesplegada"
            />
            <Button className="close-btn" onClick={closePopup}>
              &times;
            </Button>
          </div>
        </div>
      )}

      <div className="m-4">
        <h1 className="m-3 text-center nerko-one-regular"> Publicaciones Aprobadas </h1>
        <Table bordered hover className="table-light shadow">
          <thead className="table-primary">
            <tr>
              <th>Id</th>
              <th>Descripción</th>
              <th>Fecha Publicación</th>
              <th>Imagen</th>
              <th>Email</th>
              <th>Usuario</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {publicaciones.aprobadas.map((post) => (
              <tr key={post.idPublicacion}>
                <td className="text-center">{post.idPublicacion}</td>
                <td>{post.desc}</td>
                <td>{formatDate(post.timeCreate)}</td>
                <td className="text-center">
                  <Button
                    onClick={() => openPopup(post.img)}
                    className="btnpopup btn btn-outline-info"
                  >
                    <img src={post.img} className="img-fluid imgTabla rounded-circle" alt="Miniatura" />
                  </Button>
                </td>
                <td>{post.emailUsuario}</td>
                <td>{post.username}</td>
                <td className="text-center">
                  <Form.Check
                    type="switch"
                    id={`custom-switch-${post.idPublicacion}`}
                    checked
                    label=""
                    onClick={() => desaprobarPost(post.idPublicacion)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h1 className="ms-3 text-center text-warning geo-regular-italic">🌟 Publicaciones Pendientes 🌟</h1>
        <Table bordered hover className="table-light shadow">
          <thead className="table-warning">
            <tr>
              <th>Id</th>
              <th>Descripción</th>
              <th>Fecha Publicación</th>
              <th>Imagen</th>
              <th>Email</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {publicaciones.pendientes.map((post) => (
              <tr key={post.idPublicacion}>
                <td className="text-center">{post.idPublicacion}</td>
                <td>{post.desc}</td>
                <td>{formatDate(post.timeCreate)}</td>
                <td className="text-center">
                  <Button
                    onClick={() => openPopup(post.img)}
                    className="btnpopup btn btn-outline-warning"
                  >
                    <img src={post.img} className="img-fluid imgTabla rounded-circle" alt="Miniatura" />
                  </Button>
                </td>
                <td>{post.emailUsuario}</td>
                <td>{post.username}</td>
                <td className="text-center">
                  <Form.Check
                    type="switch"
                    id={`custom-switch-${post.idPublicacion}`}
                    label=""
                    onClick={() => aprobarPost(post.idPublicacion)}
                  />
                </td>
                <td className="text-center">
                  <Button
                    variant="danger"
                    className="btn-sm rounded-pill"
                    onClick={() => eliminarPost(post.idPublicacion)}
                  >
                    ❌ Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Alerta */}
        {alerta.mensaje && (
          <Alert
            variant={alerta.tipo}
            onClose={() => setAlerta({ tipo: '', mensaje: '' })}
            dismissible
            className="text-center fw-bold"
          >
            {alerta.mensaje}
          </Alert>
        )}

        {/* Popup Imagen */}
        {popupimg.visible && (
          <div className="popupImg" onClick={closePopup}>
            <div
              className="fondoimg p-3 rounded shadow"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={popupimg.imgSrc}
                alt="Imagen"
                className="imgdesplegada img-fluid rounded"
              />
              <Button
                className="close-btn btn-danger btn-sm mt-3 rounded-pill"
                onClick={closePopup}
              >
                ✖ Cerrar
              </Button>
            </div>
          </div>
        )}
      </div>

        

    </div>
    
  );
};

export default AdminPubli;