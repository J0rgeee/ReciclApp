import React, { useState, useEffect } from "react";
import { Card, Button, ButtonGroup} from 'react-bootstrap';
import VerPerfil from "./VerPerfil";
import {Link } from 'react-router-dom';
import Retiros from "../retiros/Retiros";
import axios from 'axios';
import './sidebar.style.css';



axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;



const MenuUsuario = () => {
    const [activeDiv, setActiveDiv] = useState(null);
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
        <div>
          <Card className="text-center" style={{ margin: '20px' }}>
            <Card.Img variant="top" src={usuario.foto} style={{ borderRadius: '50%', width: '100px', height: '100px', margin: '20px auto' }} />
            <Card.Body>
              <Card.Title>{usuario.username}</Card.Title>
              <Card.Text> Puntos en Plastico:</Card.Text>
              <Card.Text> Puntos en Papel:</Card.Text>
              <Card.Text> Puntos en Vidrio:</Card.Text>
              <Card.Text> Puntos en Carton:</Card.Text>
              <Card.Text> Puntos en Latas:</Card.Text>
            </Card.Body>
          </Card>
          <div className="d-flex flex-column align-items-center">
            <ButtonGroup aria-label="Basic example">
              <Button variant="primary" className="mb-2" style={{ width: '80%' }} onClick={() => handleButtonClick(1)}>Perfil</Button>
              <Button variant="primary" className="mb-2" style={{ width: '80%' }} onClick={() => handleButtonClick(2)}>Puntos</Button>
              <Button variant="primary" className="mb-2" style={{ width: '80%' }} onClick={() => handleButtonClick(4)}>Metas y Recompensa</Button>
              <Button variant="primary" className="mb-2" style={{ width: '80%' }} onClick={() => handleButtonClick(3)}>Solicitar Retiros</Button>
              <Link to='/mapa'> 
                <Button variant="primary" className="mb-2" style={{ width: '180%' }} >Ver Puntos Verdes</Button> 
              </Link>
            </ButtonGroup>
          </div>
          
        </div>
        <div>
          {activeDiv === 1 && <div><VerPerfil usuario={usuario}/></div>}
          {activeDiv === 2 && <div></div>}
          {activeDiv === 3 && <div><Retiros/></div>}
          {activeDiv === 4 && <div></div>}
        </div>
      </div>
  );
};

export default MenuUsuario;