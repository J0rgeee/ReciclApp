import React, { useState, useRef, useEffect } from "react";

import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";

import "./PuntosVerdesW.css";

import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});


const initialCenter = {
  lat: -33.363579,
  lng: -70.678193,
};

function PuntosVerdesW() {

  const [items, setItems] = useState([]); // Estado para almacenar los datos de las cajitas

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);

  const [puntosVerdes, setPuntosVerdes] = useState([]);
  const [center, setCenter] = useState(initialCenter);
  const [error, setError] = useState('');

  const autoCompleteRef = useRef(null);
  const inputRef = useRef(null);

  const onLoad = (autocomplete) => {
    autoCompleteRef.current = autocomplete;
  };
  // API ya tiene habilitada geolocalizacion, falta modificar codigo correctamente con el uso de geolocalizacion

  const onPlaceChanged = () => {
    const autocomplete = autoCompleteRef.current;
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        setSearchLocation({
          lat: location.lat(),
          lng: location.lng(),
          address: place.formatted_address || "Dirección no disponible",
        });
      } else {
        console.log("Sin información de la ubicación.");
      }
    }
  };

  const handleAddMarker = () => {
    if (searchLocation) {
      setMarker(searchLocation);
      setPuntosVerdes([...puntosVerdes, searchLocation]);
      console.log("Punto verde guardado: ", searchLocation.address);
    }
  };

  const handleLocationClick = (punto) => {
    setCenter({ lat: punto.lat, lng: punto.lng });
    setMarker({ lat: punto.lat, lng: punto.lng });
    map.panTo({ lat: punto.lat, lng: punto.lng });
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este punto verde?"
    );
    if (confirmDelete) {
      const updatedPuntosVerdes = puntosVerdes.filter((_, i) => i !== index);
      setPuntosVerdes(updatedPuntosVerdes);
    }
  };


  const fetchItems = async () => {
    
    try {
      const response = await client.get('/api/PtoVerde/ptoverde/'); // URL de la API
      setItems(response.data); // Guarda los datos en el estado

    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  // Llama a la función fetchItems cuando el componente se monta
  useEffect(() => {
    fetchItems();
  }, []);


  const handleAddressClick = async (ptoVerde) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          ptoVerde: ptoVerde.direccion,
          key: 'AIzaSyAKEX7Y7Xo0tSLxB5fSZGuRZwMlV4NwANY', // Reemplaza con tu clave de API
        },
      });

      if (response.data.status === 'OK') {
        const { lat, lng } = response.data.results[0].geometry.location;
        setMarker({ lat, lng });
        map.panTo({ lat, lng }); // Mover el mapa a la nueva ubicación
        setError('');
      } else {
        setError('No se encontró la dirección.');
      }
    } catch (err) {
      setError('Error al obtener la dirección.');
      console.error(err);
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAKEX7Y7Xo0tSLxB5fSZGuRZwMlV4NwANY"libraries={["places"]}
    >
      <div className="map-container">
        {/* Mapa de Google */}
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
            onLoad={(map) => setMap(map)}
          >
            {marker && <Marker position={marker} />}
          </GoogleMap>
        </div>

        {/* Lista de puntos verdes */}
        <div className="list-section">
          <h3>Puntos Verdes Guardados</h3>
          <ul className="puntos-verdes-lista">
              {items.map((ptoVerde) =>(
                  <li key={ptoVerde.idPv} onClick={()=>handleAddressClick({ptoVerde})} >{ptoVerde.direccion} #{ptoVerde.nro} COMUNA {ptoVerde.nomComuna}</li>
            ))}
          </ul>
        </div>
      </div>
    </LoadScript>
  );
}

export default PuntosVerdesW;
