import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button } from "react-bootstrap";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;


const AdminPubli = () => {

    const [todosPV, setTodoPV] = useState([]);

    const usuActi = async() =>{
        // const puntoverde = await axios.get('http://localhost:8000/api/Publi/publi/');
        //console.log(useract);
        // setTodoPV(puntoverde.data);
        // console.log(todosPV);
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
      {/* {todosPV.map(publi =>(
        <tr>
            <td>{publi.desc}</td>
            <td>{publi.img}</td>
            <td>{publi.emailusuario}</td>
            <td><Button variant="danger"></Button></td>

        </tr>
        ))} */}
      </tbody>
    </Table>
    </div>
  );
};

export default AdminPubli;