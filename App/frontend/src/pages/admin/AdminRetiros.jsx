import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button } from "react-bootstrap";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;




const AdminRetiros = () => {

    const [todosRetiros, setTodosRetiros] = useState([]);

    const usuAct = async() =>{
        const retiro = await axios.get('http://localhost:8000/api/Regret/regret/');
        //console.log(useract);
        setTodosRetiros(retiro.data);
        console.log(todosRetiros);
      }


    useEffect(() => {
        usuAct();
    },[]);

  return (
    <div style={{ marginLeft: '250px', flexGrow: 1 }}>
        
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>fechavisita</th>
          <th>HoraVisita</th>
          <th>Desc</th>
          <th>EmailUser</th>
          <th>EstadoVisita</th>
          <th>IdDireccion</th>
          <th>Eliminar</th>

        </tr>
      </thead>
      <tbody>
        {todosRetiros.map(retiro =>(
        <tr>
            <td>{retiro.fechavisita}</td>
            <td>{retiro.HoraVisita}</td>
            <td>{retiro.Desc}</td>
            <td>{retiro.EmailUser}</td>
            <td>{retiro.EstadoVisita}</td>
            <td>{retiro.IdDireccion}</td>
            <td><Button variant="danger"></Button></td>

        </tr>
        ))}
      </tbody>
    </Table>
    </div>
  );
};

export default AdminRetiros;