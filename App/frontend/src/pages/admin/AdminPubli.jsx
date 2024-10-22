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


const AdminPubli = () => {

    const [todosPV, setTodoPV] = useState([]);

    const usuAct = async() =>{
        const puntoverde = await axios.get('http://localhost:8000/api/PtoVerde/ptoverde/');
        //console.log(useract);
        setTodoPV(puntoverde.data);
        console.log(todosPV);
      }


    useEffect(() => {
        usuAct();
    },[]);

  return (
    <div style={{ marginLeft: '250px', flexGrow: 1 }}>
        
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th>Comuna</th>
          <th>Direccion</th>
          <th>Nro</th>
          <th>Estado</th>
          <th>Eliminar</th>

        </tr>
      </thead>
      <tbody>
        {todosPV.map(puntoVerde =>(
        <tr>
            <td>{puntoVerde.idpv}</td>
            <td>{puntoVerde.nombre}</td>
            <td>{puntoVerde.comuna}</td>
            <td>{puntoVerde.direccion}</td>
            <td>{puntoVerde.nro}</td>
            <td>{puntoVerde.estado}</td>
            <td><Button variant="danger"></Button></td>

        </tr>
        ))}
      </tbody>
    </Table>
    </div>
  );
};

export default AdminPubli;