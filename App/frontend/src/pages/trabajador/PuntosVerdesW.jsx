import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, Autocomplete, Marker } from "@react-google-maps/api";
import axios from "axios";
import "./PuntosVerdesW.css";

// Configuración de axios
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000",
});

const initialCenter = { lat: -33.363579, lng: -70.678193 };

function PuntosVerdesW() {
  const [items, setItems] = useState([]);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
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
      setShowForm(true);
    }
  };

  const getComunaId = async (comunaName) => {
    try {
      const response = await client.get("/api/Comuna/comuna/");
      const comuna = response.data.find((item) => item.nombre === comunaName);
      return comuna ? comuna.idComuna : null;
    } catch (error) {
      console.error("Error al obtener las comunas:", error);
      return null; // Retorna null si hay un error
    }
  };

  const handleConfirmAdd = async () => {
    if (searchLocation) {
      const comunaId = await getComunaId("Santiago"); // Cambia el nombre según sea necesario
      const response = await client.get("/api/PtoVerde/ptoverde/");
      const newNro =
        response.data.length > 0
          ? Math.max(...response.data.map((item) => item.nro)) + 1
          : 1;

      const requestData = {
        direccion: searchLocation.address,
        nombre: searchLocation.address,
        nro: newNro,
        estado: true,
        nomComuna: comunaId,
      };

      try {
        await client.post("/api/PtoVerde/ptoverde/", requestData);
        const newItem = {
          ...requestData,
          lat: searchLocation.lat,
          lng: searchLocation.lng,
        };
        setItems((prevItems) => [...prevItems, newItem]);

        // Actualizar el marcador y el centro del mapa
        setMarker({ lat: searchLocation.lat, lng: searchLocation.lng });
        setCenter({ lat: searchLocation.lat, lng: searchLocation.lng });
        setShowForm(false);
      } catch (error) {
        console.error("Error al agregar el punto verde:", error);
      }
    }
  };

  const handleDelete = async (idPv) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este punto verde?")
    ) {
      try {
        await client.delete(`/api/PtoVerde/ptoverde/${idPv}/`);
        setItems((prevItems) => prevItems.filter((item) => item.idPv !== idPv));
      } catch (error) {
        console.error("Error al eliminar el punto verde:", error);
      }
    }
  };

  const handleLocationClick = (location) => {
    if (location.lat && location.lng) {
      setCenter({ lat: location.lat, lng: location.lng });
      setMarker({ lat: location.lat, lng: location.lng });
      map.panTo({ lat: location.lat, lng: location.lng });
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await client.get("/api/PtoVerde/ptoverde/");
        setItems(
          response.data.map((item) => ({
            ...item,
            lat: item.lat || -33.363579,
            lng: item.lng || -70.678193,
          }))
        );
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

        {showForm && (
          <div className="confirm-form">
            <p>¿Deseas agregar esta ubicación?</p>
            <p>{searchLocation.address}</p>
            <button onClick={handleConfirmAdd}>Confirmar</button>
            <button onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        )}

        <GoogleMap
          mapContainerClassName="google-map"
          center={center}
          zoom={15}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {marker && <Marker position={marker} />}
          {items.map((item, index) => (
            <Marker key={index} position={{ lat: item.lat, lng: item.lng }} />
          ))}
        </GoogleMap>
      </div>
      {/* Lista de direcciones */}
      <div className="list-section">
        <h3>Puntos Verdes Guardados</h3>
        <ul className="puntos-verdes-lista">
          {items.map((item, index) => (
            <li key={index} onClick={() => handleLocationClick(item)}>
              {item.direccion}
              <button onClick={() => handleDelete(item.idPv)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PuntosVerdesW;
