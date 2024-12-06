import React, { useState } from 'react';
import axios from 'axios';
import { Login } from './componentes/Login';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

export function Sesion() {

  return (
    <div className='sesion'>
      <div className='cont-sesion'>
        <Login />
      </div>
    </div>
  )
}
