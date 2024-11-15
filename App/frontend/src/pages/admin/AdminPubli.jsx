import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button } from "react-bootstrap";


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;


const AdminPubli = () => {

  const [todasPubli, setTodasPubli] = useState([]);
  
  const traerPubli = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/Publi/publi/');
        setTodasPubli(response.data);
        console.log(todasPubli)
    } catch (error) {
        console.error("Error al obtener datos:", error.message);
    }
  };

  useEffect(() => {
    traerPubli();
  }, []);


    return (
      <div>
          
      <Table bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Descripcion</th>
            <th>Fecha publicación</th>
            <th>Ruta</th>
            <th>Email</th>
            <th>Usuario</th>
            <th>Likes</th>
          </tr>
        </thead>
        <tbody>
          {todasPubli.map(publicacion =>(
            <tr key={publicacion.idPublicacion}>
                <td>{publicacion.idPublicacion}</td>
                <td>{publicacion.desc}</td>
                <td>{publicacion.timeCreate}</td>
                <td>{publicacion.img}</td>
                <td>{publicacion.emailUsuario}</td>
                <td>{publicacion.username}</td>
                <td>{publicacion.likes_count}</td>
                <td><Button variant="danger">Eliminar</Button></td>

            </tr>
            ))} 
        </tbody>
      </Table>
      </div>
    );
};

export default AdminPubli;