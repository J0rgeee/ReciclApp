import React, { useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup, ListGroupItem, CardBody } from 'react-bootstrap';

const PerfilUsuario = () => {
  const [selectedOption, setSelectedOption] = useState('perfil');
  const [showAddressForm, setShowAddressForm] = useState(false);

  const toogleAddressForm = () => {
    setShowAddressForm((prev) => !prev);
  };

  return (
    <Container>
      <Row>
        <Col>
          <ListGroup>
            <ListGroupItem action active={selectedOption === 'perfil'} onClick={() => 
              { setSelectedOption('perfil');
              setShowAddressForm(false);
              }}>
              Mi Perfil
            </ListGroupItem>

            <ListGroupItem action active={selectedOption === 'configuracion'} onClick={() => 
              { setSelectedOption('configuracion');
                setShowAddressForm(false);
              }}>
              Configuracion
            </ListGroupItem>

            <ListGroupItem action active={selectedOption === 'direcciones'} onClick={() => { 
              setSelectedOption('direcciones');
              setShowAddressForm(false);
              }}>
              Direcciones de domicilio
            </ListGroupItem>

          </ListGroup>
        </Col>

        <Col>

          {selectedOption === 'perfil' && (
            <Card className="user-profile-card">
              <CardBody>
                <h4>Nombre</h4>
                <p>Email</p>
                <Button variant="primary" onClick={() => setSelectedOption('configuracion')}>
                  Editar perfil
                </Button>
              </CardBody>
            </Card>
          )}
          
          {selectedOption === 'configuracion'}

          {selectedOption === 'direcciones' && (
            <Card className="address-card">
              <CardBody>
                <h4>Direcciones de domicilio</h4>
                <ul>
                  <li>Calle Huechuraba, 1540</li>
                </ul>
                <Button variant="secondary" onClick={toogleAddressForm}>{showAddressForm ? 'Ocultar' : 'Agregar Direccion'}</Button>
                {showAddressForm}
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PerfilUsuario;