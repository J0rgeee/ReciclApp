import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useLocation } from 'react-router-dom';

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
import CheckoutTienda from './pages/componentes/Tienda/checkout';
import AdminStats from './pages/admin/AdminStats';

function App() {
  const location = useLocation(); // Obtén la ruta activa

  // Determina si la ruta activa requiere ocultar el footer
  const hideFooter = location.pathname === '/adminhome';
  return (
    <MarkerProvider>
      <div>
        <BarraNavegacion />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='foro' element={<Foro />} />
          <Route path='tienda' element={<Tienda />} />
          <Route path='checkout' element={<CheckoutTienda />} />
          <Route path='mapa' element={<PuntosVerdesW />} />
          <Route path='sesion' element={<Sesion />} />
          <Route path='reciclaje' element={<Reciclaje />} />
          <Route path='pesa' element={<Pesa />} />
          <Route path='adminhome' element={<AdminHome hideFooter={true} />} />
        </Routes>
        {!hideFooter && <Footer />}
      </div>
    </MarkerProvider>
  );
}

export default App;
