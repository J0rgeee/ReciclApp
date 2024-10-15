import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

function PuntosVerdesW() {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const autoCompleteRef = useRef(null);

  const onLoad = (autocomplete) => {
    autoCompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autoCompleteRef.current !== null) {
      const place = autoCompleteRef.current.getPlace();
      const location = place.geometry.location;
      setSearchLocation({ lat: location.lat(), lng: location.lng() });
    }
  };

  const handleAddMarker = () => {
    if (searchLocation) {
      setMarker(searchLocation);
      console.log('Punto verde guardado: ', autoCompleteRef.current.getPlace().formatted_address);
    }
  };

  return (
    <LoadScript googleMapsApiKey='AIzaSyB6QP-vSFY3Hzzf-3Zq20bMB5NWlt4mI-8' libraries={['places']}>
      <div>
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input 
            type='text'
            placeholder='Ingresa direccion'
            style={{ width: '300px', height: '40px', marginBottom: '10px' }} // Ajusté el tamaño del input
          />
        </Autocomplete>
        <button onClick={handleAddMarker} style={{ height: '30px', marginLeft: '10px' }}>
          Agregar Punto Verde
        </button>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={(map) => setMap(map)}
      >
        {marker && <Marker position={marker} />} {/* Si hay un marcador, se mostrará en la ubicación seleccionada */}
      </GoogleMap>
    </LoadScript>
  );
}

export default PuntosVerdesW;
