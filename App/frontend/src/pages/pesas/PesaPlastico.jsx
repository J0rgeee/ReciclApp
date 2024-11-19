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
  

function PesaPlastico({email}) {
  const [weight, setWeight] = useState(null);
  const [formData, setformData] = useState(null);

  const [error, setError] = useState(null);
  const [lastPeso,setLastPeso] = useState(null);

  //Trae el peso de la balanza
  const fetchWeight = async () => {
      try {
          const response = await axios.get('http://localhost:8000/api/read-weight/');
          setWeight(response.data.max_weight); 
          setError(null); 
      } catch (error) {
          setError('No se encontro peso valido');
      }
  };



  //sube el peso a la bbdd
  const subirPeso = async (e) => {
    e.preventDefault();
    setformData(
        {pesoplas:weight,
        emailusuario:email}
    );
    try {
        client.patch(`/api/pesousuario-plas/update/${email}/`,formData,
            { headers: {"X-XSRFToken":csrftoken}}
        )
    } catch (error) {
        console.log(error);
        setError("Error al editar la dirección");
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
                  <p><h1>USTED VA A RECICLAR PLASTICO</h1></p>
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

export default PesaPlastico;