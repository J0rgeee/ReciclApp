import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export function BarraNavegacion() {
  return (
    <div>
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>ReciclApp</Navbar.Brand>
        <Navbar.Brand><img
              src=""
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="logoReci"
            /></Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
           <Nav>
                <Nav.Link href="#inicio">Inico</Nav.Link>
                <Nav.Link href="#register">Registrarse</Nav.Link>
                <Nav.Link href="#foro">Foro</Nav.Link>
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  )
}
