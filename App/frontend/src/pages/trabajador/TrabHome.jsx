import React, { useEffect, useState } from 'react';
import SidebarTrab from './SidebarTrab';
import axios from 'axios';
import { Alert } from 'react-bootstrap';

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


const TrabHome = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  const handleInicioClick = () => {
    setShowSidebar(false);
  };

  return (
    <div>
      <SidebarTrab 
        className={`sidebar-admin ${showSidebar ? "" : "hidden"}`}
        onInicioClick={handleInicioClick} 
        isVisible={true} 
      />
    </div>
  )
}

export default TrabHome;