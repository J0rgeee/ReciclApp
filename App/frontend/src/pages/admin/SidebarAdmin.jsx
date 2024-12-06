import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import AdminUsuarios from "./AdminUsuarios";
import AdminPV from "./AdminPV";
import AdminPubli from "./AdminPubli";
import AdminRetiros from "./AdminRetiros";
import './admin.styles.css';
import AdminStats from "./AdminStats";


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;
/*
const client = axios.create({
    baseURL: "http://localhost:8000"
});
*/

const SidebarAdmin = ({  isVisible }) => {
  const [activeDiv, setActiveDiv] = useState(0);
  const [usuario, setUsuario] = useState([]);
  const [showTransition, setShowTransition] = useState(false);
  const [activeKey, setActiveKey] = useState("0");

  const handleButtonClick = (divNumber) => {
    console.log("Botón clickeado:", divNumber);
    setActiveDiv(divNumber);
    setActiveKey(divNumber.toString());
    setShowTransition(true);
  };

  const usuAct = async () => {
    try {
      const useract = await axios.get('http://localhost:8000/api/user');
      setUsuario(useract.data.user);
      console.log(usuario.username);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  };

  useEffect(() => {
    usuAct();
  }, []);

  useEffect(() => {
    if (showTransition) {
      const timer = setTimeout(() => {
        setShowTransition(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showTransition]);

  if (!isVisible) {
    return null; // Si `isVisible` es falso, no renderiza el componente
  }

  return (
    <div className="d-flex">
       <Nav
      className="flex-column sidebar-admin"
      activeKey={activeKey} // Vincula el estado al `activeKey`
      onSelect={(selectedKey) => setActiveKey(selectedKey)} // Actualiza el estado al seleccionar
    >
      <img
        variant="top"
        src="Usuarios/perfilH.png" // Reemplaza con la ruta de tu imagen
        className="img"
      />
      <h4 className="text-center m-3">
        Administrador <br />
        {usuario.username || "Cargando..."}
      </h4>
      <Nav.Link eventKey="0" className="p-2">
        <Button
          className={`button ${activeKey === "0" ? "active" : ""}`}
          onClick={() => handleButtonClick(0)}
        >
          Panel de control
        </Button>
      </Nav.Link>
      <Nav.Link eventKey="1" className="p-2">
        <Button
          className={`button ${activeKey === "1" ? "active" : ""}`}
          onClick={() => handleButtonClick(1)}
        >
          Administrar Usuarios
        </Button>
      </Nav.Link>
      <Nav.Link eventKey="2" className="p-2">
        <Button
          className={`button ${activeKey === "2" ? "active" : ""}`}
          onClick={() => handleButtonClick(2)}
        >
          Administrar Puntos Verdes
        </Button>
      </Nav.Link>
      <Nav.Link eventKey="3" className="p-2">
        <Button
          className={`button ${activeKey === "3" ? "active" : ""}`}
          onClick={() => handleButtonClick(3)}
        >
          Administrar Foro
        </Button>
      </Nav.Link>
      <Nav.Link eventKey="4" className="p-2">
        <Button
          className={`button ${activeKey === "4" ? "active" : ""}`}
          onClick={() => handleButtonClick(4)}
        >
          Administrar Retiros
        </Button>
      </Nav.Link>
      <Nav.Link eventKey="5" className="p-2">
        <Button
          className={`button ${activeKey === "5" ? "active" : ""}`}
          onClick={() => handleButtonClick(5)}
        >
          Administrar Tienda
        </Button>
      </Nav.Link>
    </Nav>
      <div className="content" key={activeDiv}>
        {showTransition && (
          <div className="transition-overlay">
            <div className="loading-animation">Cargando...</div>
          </div>
        )}
        {activeDiv === 0 && <AdminStats />}
        {activeDiv === 1 && <AdminUsuarios />}
        {activeDiv === 2 && <AdminPV />}
        {activeDiv === 3 && <AdminPubli />}
        {activeDiv === 4 && <AdminRetiros />}
        {activeDiv === 5 && <AdminRetiros />}
      </div>
    </div>
  );
};

export default SidebarAdmin;