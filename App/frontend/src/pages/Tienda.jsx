import React from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Image,Offcanvas,Button } from 'react-bootstrap';
import Articulos from './componentes/Tienda/Articulos';
import Footer from './componentes/Footer'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});


export function Tienda() {

  const [showSidebar, setShowSidebar] = useState(false);
  const [usuarioActivo, setUsuarioActivo] = useState();
  const [usuario, setUsuario] = useState([]);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  useEffect(() => {

     const usuAct = async() =>{
      const useract = await axios.get('http://localhost:8000/api/user');
      //  console.log(useract);
      setUsuario(useract.data.user);
      console.log(usuario);

    }
    
    client.get("/api/user").then(function (res) {
      setUsuarioActivo(true);
      usuAct();
    })
      .catch(function (error) {
        setUsuarioActivo(false);
      });
  }, []);


  if(usuarioActivo===false)
  {
    return(
      <div> 
        <Articulos/>
        <Footer/>

      </div>
      
    )
  }

  if(usuarioActivo)
  {
  return (
    <div>
      <Button variant="danger" onClick={toggleSidebar}>
          ☰ Menú
      </Button>

      {/* Sidebar */}
      <Offcanvas show={showSidebar} onHide={toggleSidebar} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <Link to=''> <Image src='/botones/b1.png'  width="70" className="d-inline-block align-top p-2 imgbr"/> </Link> <br/>
            <Link to=''> <Image src='/botones/b2.png'  width="70" className="d-inline-block align-top p-2 imgbr"/> </Link> <br/>
        </Offcanvas.Body>
      </Offcanvas>

      <Articulos/>

      <Footer/>

      
    </div>
  )
}

}
