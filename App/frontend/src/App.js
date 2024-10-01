import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes,Route} from 'react-router-dom'

import {BarraNavegacion } from './componentes/BarraNavegacion'
import {Home } from './pages/Home'
import {Foro} from './pages/Foro'
import {Tienda } from './pages/Tienda'


function App() {
  
  
 
  
  return (
    <div>
    <Routes>
        <Route path='/' element={<BarraNavegacion/>}>
          <Route path='foro' element={<Foro/>} />
          <Route path='/' element={<Home/>} />
          <Route path='tienda' element={<Tienda/>} />
        </Route>
    </Routes>
        </div>
  );
}

export default App;
