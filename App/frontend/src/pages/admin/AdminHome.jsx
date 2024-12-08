import React, { useEffect, useState } from 'react';
import SidebarAdmin from './SidebarAdmin';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import { Footer } from '../../componentes/Footer';

// Configuración global para Axios
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

// Función para obtener el token CSRF
const getCsrfToken = () => {
  const cookie = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("csrftoken="));
  return cookie ? cookie.split("=")[1] : null;
};

export const Alerta = ({ alerta, setAlerta, duracion = 3000 }) => {
  useEffect(() => {
    if (alerta.mensaje) {
      const timeout = setTimeout(() => {
        setAlerta({ tipo: '', mensaje: '' });
      }, duracion);

      return () => clearTimeout(timeout); // Limpia el timeout si el componente se desmonta
    }
  }, [alerta, duracion, setAlerta]);

  return (
    <>
      {alerta.mensaje && (
        <Alert
          variant={alerta.tipo}
          onClose={() => setAlerta({ tipo: '', mensaje: '' })}
          dismissible
        >
          {alerta.mensaje}
        </Alert>
      )}
    </>
  );
};

export const fetchNotificaciones = async () => {
  const response = await axios.get('http://localhost:8000/api/listNotificaciones/', {
    headers: { "X-CSRFToken": getCsrfToken() },
  });
  return response.data;
};

export const crearUsuario = async (nuevoUsuario) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/AdminUsuario/adminusuario/create-user/",
      nuevoUsuario,
      {
        headers: { "X-CSRFToken": getCsrfToken() },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return { success: false, error };
  }
};

// Actualizar datos de usuario existente
export const actualizarUsuario = async (email, datosActualizados) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/api/user/update/${encodeURIComponent(email)}/`,
      datosActualizados,
      {
        headers: { "X-CSRFToken": getCsrfToken() },
      }
    );
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error }
  }
};

// Eliminar usuario
export const eliminarUsuario = async (email) => {
  try {
    await axios.delete(`http://localhost:8000/api/AdminUsuario/adminusuario/delete-by-email/`, {
      data: { email },
      headers: { "X-CSRFToken": getCsrfToken() },
    }
    );
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return { success: false, error };
  }
};

// Cambiar estado del usuario
export const cambiarEstadoUsuario = async (email, estadoActual) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/api/user/desactivar-cuenta/${encodeURIComponent(email)}`,
      { estado: !estadoActual },
      {
        headers: { "X-CSRFToken": getCsrfToken() },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al cambiar el estado del usuario:", error);
    return { success: false, error };
  }
};

const AdminHome = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  const handleInicioClick = () => {
    setShowSidebar(false);
  };

  return (
    <div>
      <SidebarAdmin 
        className={`sidebar-admin ${showSidebar ? "" : "hidden"}`}
        onInicioClick={handleInicioClick} 
        isVisible={true} 
      />
    </div>
  )
}

export default AdminHome;