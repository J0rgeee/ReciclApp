import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route  } from 'react-router-dom';

import { BarraNavegacion } from './componentes/BarraNavegacion';
import { Home } from './pages/Home';
import { Foro } from './pages/Foro';
import { Tienda } from './pages/Tienda';
import { Sesion } from './pages/Sesion';
import { Footer } from './componentes/Footer';
import { Reciclaje } from './pages/Reciclaje';
import AdminHome from './pages/admin/AdminHome';
import { MarkerProvider } from './pages/mapa/MarkerContext';
import PuntosVerdesW from './pages/mapa/PuntosVerdesW';
import { Pesa } from './pages/Pesa';


function App() {
  return (
    <MarkerProvider>
      <div>
        <BarraNavegacion />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='foro' element={<Foro />} />
          <Route path='tienda' element={<Tienda />} />
          <Route path='mapa' element={<PuntosVerdesW />} />
          <Route path='sesion' element={<Sesion />} />
          <Route path='reciclaje' element={<Reciclaje />} />
          <Route path='pesa' element={<Pesa />} />
          <Route path='adminhome' element={<AdminHome hideFooter={true}/>} />
        </Routes>
        <Footer />
      </div>
    </MarkerProvider>
  );
}

export default App;
