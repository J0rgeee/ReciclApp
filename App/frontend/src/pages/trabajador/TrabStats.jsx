import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import useStats from '../../hooks/useStats';
import './trabajador.styles.css';

const TrabStats = () => {
    const { stats, loading, error } = useStats();

    if (loading) return <div>Cargando estadísticas...</div>;
    if (error) return <div>Error: {error}</div>;

    // Calcular total de kilos
    const totalKilos = Object.values(stats.pesosPorTipo || {}).reduce((a, b) => a + b, 0);

    return (
        <div className="d-flex">
            <div className="content">
                <Container fluid className="admin-stats-container">
                    <h2 className="text-center mb-4">Panel de Control</h2>
                    
                    {/* Estadísticas Generales */}
                    <h4 className="mb-3">Estadísticas Generales</h4>
                    <Row className="mb-4">
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

                    {/* Estadísticas de Reciclaje */}
                    <h4 className="mb-3">Estadísticas de Reciclaje</h4>
                    <Row>
                        <Col md={12} className="mb-4">
                            <Card className="stat-card">
                                <Card.Body>
                                    <Card.Title>Total Kilos Reciclados</Card.Title>
                                    <Card.Text className="stat-number">
                                        {totalKilos.toFixed(2)} kg
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        {Object.entries(stats.pesosPorTipo || {}).map(([tipo, kilos]) => (
                            <Col md={4} key={tipo} className="mb-3">
                                <Card className="stat-card">
                                    <Card.Body>
                                        <Card.Title>{tipo}</Card.Title>
                                        <Card.Text className="stat-number">
                                            {kilos.toFixed(2)} kg
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default TrabStats; 