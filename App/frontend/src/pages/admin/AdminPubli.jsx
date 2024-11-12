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

    const usuActi = async() =>{
         const publi = await axios.get('http://localhost:8000/api/Publi/publi/');
        //console.log(useract);
         setTodasPubli(publi.data);
      }

    useEffect(() => {
        usuActi();
    },[]);

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
          </tr>
        </thead>
        <tbody>
          {todasPubli.map(publicaciones =>(
            <tr key={publicaciones.idPublicacion}>
                <td>{publicaciones.idPublicacion}</td>
                <td>{publicaciones.desc}</td>
                <td>{publicaciones.timeCreate}</td>
                <td>{publicaciones.img}</td>
                <td>{publicaciones.emailUsuario}</td>
                <td>{publicaciones.username}</td>
                <td><Button variant="danger">Eliminar</Button></td>

            </tr>
            ))} 
        </tbody>
      </Table>
      </div>
    );
};

export default AdminPubli;