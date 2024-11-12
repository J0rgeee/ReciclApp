import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button } from "react-bootstrap";


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

const AdminPubli = () => {
  const [todasPubli, setTodasPubli] = useState([]);
  
  const traerPubli = async () => {
    try {
        const response = await client.get('/api/Publi/publi/');
        setTodasPubli(response.data);
        console.log(todasPubli)
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
  };

  useEffect(() => {
    traerPubli();
  }, []);


  return (
    <div style={{ marginLeft: '250px', flexGrow: 1 }}>
        
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Id</th>
          <th>Descripcion</th>
          <th>Imagen</th>
          <th>Fecha Creacion</th>
          <th>Email Usuario</th>
          <th>Likes</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
       {todasPubli.map(publicaciones =>(
        <tr>
            <td>{publicaciones.idPublicacion}</td>
            <td>{publicaciones.desc}</td>
            <td>{publicaciones.img}</td>
            <td>{publicaciones.timeCreate}</td>
            <td>{publicaciones.emailUsuario}</td>
            <td>{publicaciones.likes}</td>
            <td>{publicaciones.estado}</td>
            <td><Button variant="danger"></Button></td>
        </tr>
        ))} 
      </tbody>
    </Table>
    </div>
  );
};

export default AdminPubli;