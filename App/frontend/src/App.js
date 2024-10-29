import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api'; // Importa LoadScript

import { BarraNavegacion } from './componentes/BarraNavegacion';
import { Home } from './pages/Home';
import { Foro } from './pages/Foro';
import { Tienda } from './pages/Tienda';
import { Sesion } from './pages/Sesion';
import PuntosVerdesW from './pages/trabajador/PuntosVerdesW';
import { Footer } from './componentes/Footer';
import { Reciclaje } from './pages/Reciclaje';

function App() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyAKEX7Y7Xo0tSLxB5fSZGuRZwMlV4NwANY" libraries={["places"]}> {/* Asegúrate de agregar tu API key aquí */}
      <div>
        <BarraNavegacion />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='foro' element={<Foro />} />
          <Route path='tienda' element={<Tienda />} />
          <Route path='mapa' element={<PuntosVerdesW />} />
          <Route path='sesion' element={<Sesion />} />
          <Route path='reciclaje' element={<Reciclaje />} />
        </Routes>
        <Footer />
      </div>
    </LoadScript>
  );
}

export default App;
