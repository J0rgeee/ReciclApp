import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button } from "react-bootstrap";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;


const AdminPubli = () => {

    const [todosPubli, setTodoPubli] = useState([]);

    const usuActi = async() =>{
         const publi = await axios.get('http://localhost:8000/api/Publi/publi/');
        //console.log(useract);
         setTodoPubli(publi.data);
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
          {todosPubli.map(publicaciones =>(
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