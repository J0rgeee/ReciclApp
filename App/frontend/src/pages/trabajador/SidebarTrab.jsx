import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import axios from 'axios';
import TrabPV from "./TrabPV";
import TrabPubli from "./TrabPubli";
import TrabStats from "./TrabStats";
import TrabPesos from "./TrabPesos";
import './trabajador.styles.css';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;


const SidebarTrab = ({  isVisible }) => {
  const [activeDiv, setActiveDiv] = useState(0);
  const [usuario, setUsuario] = useState([]);
  const [showTransition, setShowTransition] = useState(false);
  const [activeKey, setActiveKey] = useState("1");

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
    <div className="d-flex-side">
       <Nav
      className="flex-column sidebar-admin"
      activeKey={activeKey} // Vincula el estado al `activeKey`
      onSelect={(selectedKey) => setActiveKey(selectedKey)} // Actualiza el estado al seleccionar
    >
      <img
        variant="top"
        src={usuario.img} // Reemplaza con la ruta de tu imagen
        className="img"
      />
      <h4 className="text-center m-3">
        Trabajador <br />
        {usuario.username || "Cargando..."}
      </h4>
      <Nav.Link eventKey="1" className="p-2">
        <Button
          className={`button ${activeKey === "1" ? "active" : ""}`}
          onClick={() => handleButtonClick(1)}
        >
          Panel de control
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
          Administrar Pesos
        </Button>
      </Nav.Link>
    </Nav>
      <div className="content" key={activeDiv}>
        {showTransition && (
          <div className="transition-overlay">
            <div className="loading-animation">Cargando...</div>
          </div>
        )}
        {activeDiv === 1 && <TrabStats />}
        {activeDiv === 2 && <TrabPV />}
        {activeDiv === 3 && <TrabPubli />}
        {activeDiv === 4 && <TrabPesos />}
      </div>
    </div>
  );
};

export default SidebarTrab;