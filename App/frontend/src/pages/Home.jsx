import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.styles.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import BajaNavBar from './componentes/BajadaNavBar';
import Empresas from './componentes/Empresas';
import Demo from './componentes/Demo';
import Contacto from './componentes/Contacto';
import Footer from './componentes/Footer';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:8000"
});

export function Home() {

    const [usuarioActivo, setUsuarioActivo] = useState();
    const [usuario, setUsuario] = useState([]);
    const navigate = useNavigate();

    const usuAct = async () => {
        const useract = await client.get('/api/user');
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

    useEffect(() => {
        if (usuario.tipoUser === 1) {
            navigate('/AdminHome');
        } else if (usuario.tipoUser === 2) {
            navigate('/MenuUsuario');
        } else if (usuario.tipoUser === 3) {
            navigate('/TrabHome');
        }
    }, [usuario.tipoUser]);

    return (
        <div>

            <Container fluid >
                <Row>
                    <BajaNavBar />
                </Row>
                <Row>
                    <Empresas />
                </Row>
                <Row>
                    <Demo />
                </Row>
                <Row>
                    <Contacto />
                </Row>
                <Row>
                    <Footer />
                </Row>
            </Container>

        </div>
    )
}