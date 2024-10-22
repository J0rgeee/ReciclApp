import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, ListGroup, ListGroupItem, CardBody } from 'react-bootstrap';
import axios from 'axios';
import AdminUsuarios from "./AdminUsuarios";
import AdminPV from "./AdminPV";


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:8000"
});


const SidebarAdmin = () => {
    const [activeDiv, setActiveDiv] = useState(null);
    const [usuarioActivo, setUsuarioActivo] = useState();
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
      <div className="d-flex">
      <div
        style={{
          width: '250px',
          backgroundColor: '#228b22',
          height: 'calc(100vh - 56px)', // Ajuste para que no cubra el navbar
          position: 'fixed',
          left: 0,
          top: '125px' // Asegúrate de que esto coincida con la altura del navbar
        }}
      >
        <Card className="text-center" style={{ margin: '20px' }}>
          <Card.Img
            variant="top"
            src="path/to/your/photo.jpg" // Reemplaza con la ruta de tu imagen
            style={{ borderRadius: '50%', width: '100px', height: '100px', margin: '20px auto' }}
          />
          <Card.Body>
            <Card.Title>Menu de administrador <br/>{usuario.username}</Card.Title>
          </Card.Body>
        </Card>
        <div className="d-flex flex-column align-items-center">
          
          <Button variant="primary" className="mb-2" style={{ width: '80%' }} onClick={() => handleButtonClick(1)}>Administrar Usuarios</Button>
          <Button variant="primary" className="mb-2" style={{ width: '80%' }} onClick={() => handleButtonClick(2)}>Administrar Puntos Verdes</Button>
          <Button variant="primary" className="mb-2" style={{ width: '80%' }} onClick={() => handleButtonClick(3)}>Administrar Publicaciones</Button>
          <Button variant="primary" className="mb-2" style={{ width: '80%' }} onClick={() => handleButtonClick(4)}>Administrar Retiros</Button>

        </div>
        
      </div>
      <div>
        {activeDiv === 1 && <div><AdminUsuarios/></div>}
        {activeDiv === 2 && <div><AdminPV/></div>}
        {activeDiv === 3 && <div></div>}
        {activeDiv === 4 && <div></div>}
      </div>
    </div>
  );
};

export default SidebarAdmin;