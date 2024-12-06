import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './admin.styles.css';

const AdminStats = () => {
    const [stats, setStats] = useState({
        totalUsuarios: 0,
        usuariosActivos: 0,
        totalPuntosVerdes: 0,
        totalPublicaciones: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/admin/stats/');
                setStats(response.data);
            } catch (error) {
                console.error('Error al cargar estadísticas:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="d-flex">
            <div className="content">
                <Container fluid className="admin-stats-container">
                    <h2 className="text-center mb-4">Panel de Control</h2>
                    <Row>
                        <Col md={3}>
                            <Card className="stat-card">
                                <Card.Body>
                                    <Card.Title>Usuarios Totales</Card.Title>
                                    <Card.Text className="stat-number">
                                        {stats.totalUsuarios}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="stat-card">
                                <Card.Body>
                                    <Card.Title>Usuarios Activos</Card.Title>
                                    <Card.Text className="stat-number">
                                        {stats.usuariosActivos}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="stat-card">
                                <Card.Body>
                                    <Card.Title>Puntos Verdes</Card.Title>
                                    <Card.Text className="stat-number">
                                        {stats.totalPuntosVerdes}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="stat-card">
                                <Card.Body>
                                    <Card.Title>Publicaciones</Card.Title>
                                    <Card.Text className="stat-number">
                                        {stats.totalPublicaciones}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default AdminStats; 