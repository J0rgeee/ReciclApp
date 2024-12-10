import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col,Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from "js-cookie";

const csrftoken = Cookies.get("csrftoken");

const client = axios.create({
    baseURL: "http://localhost:8000",
});

function PesaLata() {
    const [weight, setWeight] = useState(null);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user', { withCredentials: true });
                setCurrentUser(response.data.user);
            } catch (error) {
                console.error("Error al obtener el usuario autenticado:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo obtener la información del usuario'
                });
            }
        };
        fetchUser();
    }, []);

    const fetchWeight = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/read-weight/');
            const pesoRedondeado = parseFloat(response.data.max_weight).toFixed(2);
            setWeight(pesoRedondeado);
            setError(null);
            
            Swal.fire({
                icon: 'success',
                title: 'Peso registrado',
                text: `Se registró un peso de ${pesoRedondeado} gramos`
            });
        } catch (error) {
            setError('No se encontró peso válido');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo obtener el peso'
            });
        }
    };

    const subirPeso = async () => {
        if (!weight) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'No hay un peso calculado para guardar'
            });
            return;
        }

        try {
            const pesoKg = (parseFloat(weight) / 1000).toFixed(2);
            const payload = {
                emailusuario: currentUser.email,
                cantidadpeso: pesoKg,
                estado: false,
                tiporec: 9,
            };

            const response = await client.post(
                `/api/transpeso/`,
                payload,
                { headers: { "X-CSRFToken": csrftoken } }
            );

            Swal.fire({
                icon: 'success',
                title: '¡Peso guardado exitosamente!',
                text: `Se han registrado ${weight} gramos de plástico`
            });

            setWeight(null);
            setError(null);
        } catch (error) {
            console.error("Error al guardar el peso:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo guardar el peso'
            });
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={8}>
                    <h1 className="text-center mb-4">RECICLAJE DE LATA</h1>
                    <div className="text-center mb-4">
                        <h2>Peso Actual:</h2>
                        {error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
                            <p className="h3">
                                {weight !== null ? `${weight} gramos` : 'Presione el botón para iniciar el registro'}
                            </p>
                        )}
                    </div>
                    <div className="d-grid gap-2">
                        <Button 
                            variant="primary" 
                            size="lg"
                            onClick={fetchWeight}
                            className="mb-2"
                        >
                            Calcular mi peso
                        </Button>
                        <Button 
                            variant="success" 
                            size="lg"
                            onClick={subirPeso}
                            disabled={!weight}
                        >
                            Guardar mi Peso
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default PesaLata;