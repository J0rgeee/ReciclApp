import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button } from "react-bootstrap";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:8000"
});


const AdminUsuarios = () => {

    const [todosUsuarios, setTodosUsuarios] = useState([]);

    const TodosUsuarios = async() =>{
        const useract = await axios.get('http://localhost:8000/api/AdminUsuario/adminusuario/');
        setTodosUsuarios(useract.data);
        console.log(todosUsuarios);
      }


    useEffect(() => {
      TodosUsuarios();
    },[]);

  return (
    <div className="div">  
      <Table bordered hover >
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Username</th>
            <th>Email</th>
            <th>Fecha Nacimineto</th>
            <th>Telefono</th>
            <th>Estado Cuenta</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {todosUsuarios.map(usuario =>(
          <tr>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.username}</td>
              <td>{usuario.email}</td>
              <td>{usuario.fechaNac}</td>
              <td>{usuario.telefono}</td>
              <td>{usuario.estado}</td>
              <td><Button variant="danger">Eliminar Usuario</Button></td>
          </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminUsuarios;