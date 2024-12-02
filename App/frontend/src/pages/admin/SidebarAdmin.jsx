import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import axios from 'axios';
import AdminUsuarios from "./AdminUsuarios";
import AdminPV from "./AdminPV";
import AdminPubli from "./AdminPubli";
import AdminRetiros from "./AdminRetiros";
import './admin.styles.css';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;
/*
const client = axios.create({
    baseURL: "http://localhost:8000"
});
*/

const SidebarAdmin = () => {
  const [activeDiv, setActiveDiv] = useState(null);
  const [usuario, setUsuario] = useState([]);

  const handleButtonClick = (divNumber) => {
    console.log("Botón clickeado:", divNumber);
    setActiveDiv(divNumber);
  };

  const usuAct = async() =>{
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

  return (
    <div className="d-flex">
      <Nav className="flex-column sidebar-admin navadmin"> 
        <img
          variant="top"
          src="Usuarios/perfilH.png" // Reemplaza con la ruta de tu imagen
          className="img"
        />
        <h4 className="text-center m-3">Administrador <br/>{usuario.username || "Cargando..."}</h4>
        <Nav.Link className="p-2"><Button className="button" onClick={() => handleButtonClick(1)}>Administrar Usuarios</Button></Nav.Link>
        <Nav.Link className="p-2"><Button className="button" onClick={() => handleButtonClick(2)}>Administrar Puntos Verdes</Button></Nav.Link>
        <Nav.Link className="p-2"><Button className="button" onClick={() => handleButtonClick(3)}>Administrar Foro</Button></Nav.Link>
        <Nav.Link className="p-2"><Button className="button" onClick={() => handleButtonClick(4)}>Administrar Retiros</Button></Nav.Link>
        <Nav.Link className="p-2"><Button className="button" onClick={() => handleButtonClick(5)}>Administrar Tienda</Button></Nav.Link>
      </Nav>
      <div className="content" key={activeDiv}>
        {activeDiv === 1 && <AdminUsuarios/>}
        {activeDiv === 2 && <AdminPV/>}
        {activeDiv === 3 && <AdminPubli/>}
        {activeDiv === 4 && <AdminRetiros/>}
        {activeDiv === 5 && <AdminRetiros/>}
      </div>
      
    </div>
    
  );
};

export default SidebarAdmin;