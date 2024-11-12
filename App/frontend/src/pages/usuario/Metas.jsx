import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProgressBar, Card, Button } from 'react-bootstrap';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});

function Metas({ email }) {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/api/metas/${email}/`)
      .then(response => {
        setMetas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al traer las metas:", error);
        setLoading(false);
      });
  }, [email]);

  const renderProgreso = (progreso, finalMeta) => {
    const progresoPorcentaje = (progreso / finalMeta) * 100;  // Calculamos el porcentaje

    return (
      <div>
        <ProgressBar now={progresoPorcentaje} label={`${progresoPorcentaje.toFixed(2)}%`} />
        <div className="mt-3">
          <p>{progreso >= finalMeta ? "Meta Completada!" : "En Progreso"}</p>
          <p>{progreso >= finalMeta * 0.25 ? "25% Completado" : "25% No Completado"}</p>
          <p>{progreso >= finalMeta * 0.50 ? "50% Completado" : "50% No Completado"}</p>
          <p>{progreso >= finalMeta * 0.75 ? "75% Completado" : "75% No Completado"}</p>
          <p>{progreso === finalMeta ? "100% Completado!" : "100% No Completado"}</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h3>Metas y Progreso</h3>
      {loading ? (
        <p>Cargando metas...</p>
      ) : (
        metas.map(meta => (
          <Card key={meta.idMeta} className="mb-4">
            <Card.Body>
              <Card.Title>{meta.nombre}</Card.Title>
              <Card.Text>{meta.desc}</Card.Text>
              <Card.Text>Meta Final: {meta.finalMeta} puntos</Card.Text>
              {meta.progreso ? renderProgreso(meta.progreso.progreso, meta.finalMeta) : <p>No hay progreso registrado</p>}
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default Metas;