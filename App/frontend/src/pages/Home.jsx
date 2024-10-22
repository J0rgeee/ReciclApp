import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Card from 'react-bootstrap/Card';
import { Carrusel } from './componentes/Carrusel';
import { Register } from './componentes/Register';
import { Login } from './componentes/Login';
import { MenuUsuario } from './componentes/MenuUsuario';
import {PuntosVerdesW} from './trabajador/PuntosVerdesW';
import { Navigate } from 'react-router-dom';
import PerfilUsuario from './usuario/PerfilUsuario';
import AdminHome from './admin/AdminHome';
import PerfilTrabajador from './trabajador/PerfilTrabajador';



axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:8000"
});

export function Home() {

    const [usuarioActivo, setUsuarioActivo] = useState();
    const [usuario, setUsuario] = useState([]);

    const usuAct = async() =>{
        const useract = await axios.get('http://localhost:8000/api/user');
        //  console.log(useract);
        setUsuario(useract.data.user);
        console.log(usuario);
  
      }

    useEffect(() => {
        client.get("/api/user").then(function (res) {
            setUsuarioActivo(true);
            usuAct();
        })
            .catch(function (error) {
                setUsuarioActivo(false);
            });
    }, []);

    function submitLogout(e) {
        e.preventDefault();
        client.post(
            "/api/logout",
            { withCredentials: true }
        ).then(function (res) {
            setUsuarioActivo(false);
            window.location.replace('/'); 

        });
    }

    if (usuario.tipoUser===1)
        {
            return(
                <div>
                        <AdminHome/>
                </div>
            )
        } 

    if (usuario.tipoUser===2)
        {
            return(
                <div>
                    <PerfilUsuario/>
                </div>
            )
        } 
    if (usuario.tipoUser===3)
        {
            return(
                <div>
                        <PerfilTrabajador/>
                </div>
            )
        } 
    
    return ( 
        <div>
            
           <Container>
                <Row>
                    <Col>
                        <Carrusel />
                    </Col>
                </Row>
            </Container>

        </div>
    )
}