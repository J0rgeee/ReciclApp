import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, Autocomplete, Marker } from "@react-google-maps/api";
import axios from 'axios';
import "./PuntosVerdesW.css";

// Configuración de axios
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});

const initialCenter = { lat: -33.363579, lng: -70.678193 };

function PuntosVerdesW() {
  const [items, setItems] = useState([]);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [center, setCenter] = useState(initialCenter);

  const autoCompleteRef = useRef(null);
  const inputRef = useRef(null);

  const onLoad = (autocomplete) => {
    autoCompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const autocomplete = autoCompleteRef.current;
    if (autocomplete && autocomplete.getPlace()) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        setSearchLocation({
          lat: location.lat(),
          lng: location.lng(),
          address: place.formatted_address || "Dirección no disponible",
        });
      }
    }
  };

  const handleAddMarker = () => {
    if (searchLocation) {
      setMarker(searchLocation);
      setItems((prevItems) => [...prevItems, searchLocation]);
    }
  };

  const handleLocationClick = (location) => {
    setCenter({ lat: location.lat, lng: location.lng });
    setMarker({ lat: location.lat, lng: location.lng });
    map.panTo({ lat: location.lat, lng: location.lng });
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await client.get('/api/PtoVerde/ptoverde/');
        setItems(response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="map-container">
      <div className="map-section">
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            ref={inputRef}
            placeholder="Ingresa dirección"
            className="autocomplete-input"
          />
        </Autocomplete>
        <button onClick={handleAddMarker} className="add-marker-button">
          Agregar Punto Verde
        </button>
        <GoogleMap
          mapContainerClassName="google-map"
          center={center}
          zoom={15}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>
      </div>
      {/*Lista de direcciones*/}
      <div className="list-section">
        <h3>Puntos Verdes Guardados</h3>
        <ul className="puntos-verdes-lista">
          {items.map((item, index) => (
            <li key={index} onClick={() => handleLocationClick(item)}>
              {item.address || item.direccion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PuntosVerdesW;
