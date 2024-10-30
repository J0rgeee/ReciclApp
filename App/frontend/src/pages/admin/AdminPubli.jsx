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
         console.log(todosPubli);
      }


    useEffect(() => {
        usuActi();
    },[]);

  return (
    <div style={{ marginLeft: '250px', flexGrow: 1 }}>
        
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th>Comuna</th>
          <th>Eliminar</th>

        </tr>
      </thead>
      <tbody>
       {todosPubli.map(publicaciones =>(
        <tr>
            <td>{publicaciones.desc}</td>
            <td>{publicaciones.img}</td>
            <td>{publicaciones.emailUsuario}</td>
            <td><Button variant="danger"></Button></td>

        </tr>
        ))} 
      </tbody>
    </Table>
    </div>
  );
};

export default AdminPubli;