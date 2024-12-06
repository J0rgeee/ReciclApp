import React, { useState, useEffect } from "react";
import { Card, Button, ButtonGroup} from 'react-bootstrap';
import VerPerfil from "./VerPerfil";
import {Link } from 'react-router-dom';
import Retiros from "../retiros/Retiros";
import axios from 'axios';
import './sidebar.style.css';
import Puntuacion from "./Puntuacion";
import Metas from "./Metas";
import Direcciones from "./Direcciones";
import Nav from 'react-bootstrap/Nav';
import HistorialCompras from "./HistorialCompras";



axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;



const MenuUsuario = () => {
    const [activeDiv, setActiveDiv] = useState("1");
    const [usuario, setUsuario] = useState([]);

    const handleButtonClick = (divNumber) => {
      setActiveDiv(divNumber);
    };

    const usuAct = async() =>{
        const useract = await axios.get('http://localhost:8000/api/user');
        setUsuario(useract.data.user);
        console.log(usuario);
    }
    useEffect(() => {
        usuAct();
    }, []);

  return (
      <div>
        <div className="navbar-perfil">
          <Card className="text-center" style={{ margin: '20px' }}>
            <Card.Img variant="top" src={usuario.foto} style={{ borderRadius: '50%', width: '100px', height: '100px', margin: '20px auto' }} />
            <Card.Body>
              <Card.Title>{usuario.username}</Card.Title>
              <Card.Text> sadasdsa</Card.Text>
            </Card.Body>
          </Card>
          <Nav justify variant="underline" className="navuser" activeKey={activeDiv} onSelect={(selectedKey) => setActiveDiv(selectedKey)}>
            <Nav.Item>
              <Nav.Link eventKey="1">Perfil</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="5">Puntuación</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="2">Retiros</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="4">Metas</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="3">Direcciones</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="6">Historial de compra</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Link to='/mapa' className="nav-link">Ver Puntos Verdes</Link>
            </Nav.Item>
          </Nav>
          {/*
          <div className="d-flex flex-column align-items-center">
            <ButtonGroup aria-label="Basic example">
              <Button variant="primary" className="mb-2 button" onClick={() => handleButtonClick(1)}>Perfil</Button>
              <Button variant="primary" className="mb-2" style={{ width: '80%' }} onClick={() => handleButtonClick(5)}>Direcciones</Button>
              <Button variant="primary" className="mb-2" style={{ width: '80%' }} onClick={() => handleButtonClick(2)}>Puntos</Button>
              <Button variant="primary" className="mb-2" style={{ width: '80%' }} onClick={() => handleButtonClick(4)}>Metas y Recompensa</Button>
              <Button variant="primary" className="mb-2" style={{ width: '80%' }} onClick={() => handleButtonClick(3)}>Solicitar Retiros</Button>

              <Link to='/mapa'> 
                <Button variant="primary" className="mb-2" style={{ width: '180%' }} >Ver Puntos Verdes</Button> 
              </Link>
            </ButtonGroup>
          </div>
          */}
        </div>
        <div>
          {activeDiv === "1" && <VerPerfil usuario={usuario}/>}
          {activeDiv === "2" && <Puntuacion  usuario={usuario}/>}
          {activeDiv === "3" && <div><Retiros/></div>}
          {activeDiv === "4" && <div><Metas email={usuario.email}/></div>}
          {activeDiv === "5" && <Direcciones email={usuario.email} />}
          {activeDiv === "6" && <HistorialCompras />}
        </div>
      </div>
  );
};

export default MenuUsuario;