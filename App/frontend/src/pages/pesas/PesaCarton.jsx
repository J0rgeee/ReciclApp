import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col,Form } from 'react-bootstrap';
import axios from 'axios';

import Cookies from "js-cookie";

const csrftoken = Cookies.get("csrftoken");

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://localhost:8000",
  });
  

function PesaCarton({email}) {
  const [weight, setWeight] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setformData] = useState(null);
  const [lastPeso,setLastPeso] = useState(null);
  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
    // Obtener usuario autenticado
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user', { withCredentials: true });
        setCurrentUser(response.data.user);  // Supón que response.data contiene el objeto de usuario
        console.log(response.data.user.email);
        console.log("Usuario autenticado:", currentUser.email);

      } catch (error) {
        console.error("Error al obtener el usuario autenticado:", error);
      }
    };
    fetchUser();
  }, []);


  const fetchWeight = async () => {
      try {
          const response = await axios.get('http://localhost:8000/api/read-weight/');
          setWeight(response.data.max_weight); 
          setError(null); 
      } catch (error) {
          setError('No se encontro peso valido');
      }
  };

  // Función para subir el peso calculado
  const subirPeso = async () => {
    if (!weight) {
      setError("No hay un peso calculado para guardar.");
      return;
    }

    try {
      const payload = {
        emailusuario: currentUser.email, // ID del usuario autenticado
        cantidadpeso: weight,        // Peso calculado
        estado: false,                // Estado por defecto
        tiporec: 2,  // Usa el email del usuario autenticado
      };

      const response = await client.post(
        `http://localhost:8000/api/transpeso/`,
        payload,
        { headers: { "X-CSRFToken": csrftoken } }
      );
      console.log("Peso guardado:", response.data);
      setError(null);
    } catch (error) {
      console.error("Error al guardar el peso:", error);
      setError("No se pudo guardar el peso.");
    }
  };

useEffect(() => {
    console.log(email);
    const ultimoPeso = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/pesousuario-plas/${email}/`);
            setLastPeso(response.data);
        } catch (error) {
            setError('No se encontro peso valido');
        }
        };

    ultimoPeso();
    console.log(lastPeso)
}, []);

    
  return (
      <Container>
          <Row className="justify-content-center">
              <Col md={8}>
                  <p><h1>USTED VA A RECICLAR CARTON</h1></p>
                  <h2>Peso Actual:</h2>
                  {error ? (
                      <p>{error}</p>
                  ) : (
                      <p>{weight !== null ? `${weight} gramos` : 'Presione el boton para iniciar el registro'}</p>
                  )}
                  <Button variant="primary" onClick={fetchWeight}>
                      Calcular mi peso 
                  </Button>
                  <Button variant="primary" onClick={subirPeso}>
                      Subir mi Peso 
                  </Button>
                  <p></p>
              </Col>
          </Row>
      </Container>
  );
}

export default PesaCarton;