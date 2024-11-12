import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button, Modal, Form } from "react-bootstrap";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import AgregarPv from "./AgregarPv";
import EliminarPv from "./EliminarPv";



const csrftoken = Cookies.get('csrftoken');

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:8000"
});

const AdminPV = () => {
    const [todosPV, setTodoPV] = useState([]);
    const [show, setShow] = useState(false);

    const [formulario, setFormulario] = useState({
        "idPv": '',
        "nombre": '',
        "direccion": '',
        "nro": '',
        "estado": false,
        "nomComuna": ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormulario({
            ...formulario,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleClose = () => setShow(false);

    const handleShow = (puntoVerde) => {
        setFormulario({
            "idPv": puntoVerde.idPv,
            "nombre": puntoVerde.nombre,
            "direccion": puntoVerde.direccion,
            "nro": puntoVerde.nro,
            "estado": puntoVerde.estado,
            "nomComuna": puntoVerde.nomComuna
        });
        setShow(true);
    };

    const usuAct = async () => {
        try {
            const response = await client.get('/api/PtoVerde/ptoverde/');
            setTodoPV(response.data);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formulario);
        try {
            await client.put(`/api/PtoVerde/ptoverde/${formulario.idPv}/`, {
                "idPv": formulario.idPv,
                "nombre": formulario.nombre,
                "direccion": formulario.direccion,
                "nro": formulario.nro,
                "estado": formulario.estado,
                "nomComuna": formulario.nomComuna
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'X-CSRFToken': csrftoken,  // Token CSRF desde la cookie
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Punto Verde actualizado con éxito!',
            });
            handleClose();
            usuAct();  // Actualizar lista
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al actualizar el Punto Verde.',
            });
            console.error("Error al actualizar:", error);
        }
    };

    useEffect(() => {
        usuAct();
    }, []);

    return (
        <>
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
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {todosPV.map(puntoVerde => (
                        <tr key={puntoVerde.idPv}>
                            <td>{puntoVerde.idPv}</td>
                            <td>{puntoVerde.nombre}</td>
                            <td>{puntoVerde.nomComuna}</td>
                            <td>{puntoVerde.direccion}</td>
                            <td>{puntoVerde.nro}</td>
                            <td><Form.Check type="checkbox" checked={puntoVerde.estado} disabled /></td>
                            <td><EliminarPv campoId={puntoVerde.idPv}/></td>
                            <td><Button variant="info" onClick={() => handleShow(puntoVerde)}>Editar</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Punto Verde</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" name='nombre' value={formulario.nombre} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Direccion</Form.Label>
                            <Form.Control type="text" name='direccion' value={formulario.direccion} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Numero</Form.Label>
                            <Form.Control type="text" name='nro' value={formulario.nro} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Comuna</Form.Label>
                            <Form.Control type="text" name='nomComuna' value={formulario.nomComuna} disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Estado</Form.Label>
                            <Form.Check type="checkbox" name='estado' checked={formulario.estado} onChange={handleChange} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                        <Button variant="primary" type="submit">Guardar Cambios</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        <AgregarPv />
        </div>
        </>
    );
};

export default AdminPV;