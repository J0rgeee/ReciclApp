import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import axios from "axios";
import { useMarkers } from "./MarkerContext";
import "./PuntosVerdesW.css";

const client = axios.create({
  baseURL: "http://localhost:8000",
});

function PuntosVerdesW() {
  const { markers, setMarkers } = useMarkers();
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: -33.363579, lng: -70.678193 });
  const [comunas, setComunas] = useState([]);
  const [selectedComuna, setSelectedComuna] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await client.get("/api/get-google-maps-api-key/");
        setApiKey(response.data.apiKey);
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };
    fetchApiKey();
  }, []);

  useEffect(() => {
    const fetchComunas = async () => {
      try {
        const response = await client.get("/api/Comuna/comuna/");
        setComunas(response.data);
      } catch (error) {
        console.error("Error fetching comunas:", error);
      }
    };
    fetchComunas();
  }, []);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await client.get("/api/PtoVerde/ptoverde/");
        setMarkers(response.data);
      } catch (error) {
        console.error("Error fetching markers:", error);
      }
    };
    fetchMarkers();
  }, [setMarkers]);

  const filteredMarkers = selectedComuna
    ? markers.filter((item) => item.nomComuna === parseInt(selectedComuna))
    : markers;

  const handleLocationClick = (location) => {
    if (location.lat && location.lng) {
      setCenter({
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng),
      });
      map.panTo({
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng),
      });
    } else {
      console.error("Latitud o longitud inválida:", location);
    }
  };

  return (
    <div className="map-container">
      <div className="map-section">
        {apiKey ? (
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerClassName="google-map"
              center={center}
              zoom={12}
              onLoad={(mapInstance) => setMap(mapInstance)}
            >
              {filteredMarkers.map((item) => {
                if (
                  !item.lat ||
                  !item.lng ||
                  isNaN(parseFloat(item.lat)) ||
                  isNaN(parseFloat(item.lng))
                ) {
                  return null;
                }
                return (
                  <Marker
                    key={item.idPv}
                    position={{
                      lat: parseFloat(item.lat),
                      lng: parseFloat(item.lng),
                    }}
                    title={item.direccion}
                  />
                );
              })}
            </GoogleMap>
          </LoadScript>
        ) : (
          <div>Loading map...</div>
        )}
      </div>
      <div className="list-section">
        <h3>Puntos Verdes Guardados</h3>
        <button
          onClick={() => setFilterVisible(!filterVisible)}
          className="toggle-filter-button"
        >
          {filterVisible ? "Ocultar Filtro" : "Filtrar por Comuna"}
        </button>
        {filterVisible && (
          <select
            value={selectedComuna}
            onChange={(e) => setSelectedComuna(e.target.value)}
            className="comuna-filter"
          >
            <option value="">Todas las Comunas</option>
            {comunas.map((comuna) => (
              <option key={comuna.idComuna} value={comuna.idComuna}>
                {comuna.nombre}
              </option>
            ))}
          </select>
        )}
        <ul className="puntos-verdes-lista">
          {filteredMarkers.map((item) => (
            <li key={item.idPv} onClick={() => handleLocationClick(item)}>
              {item.direccion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PuntosVerdesW;
