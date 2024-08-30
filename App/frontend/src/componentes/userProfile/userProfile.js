import React from "react";
import './userProfile.css'
import 'bootstrap/dist/css/bootstrap.min.css';


export function userProfile(){
    return (
    <div className="user-profile-container container">

      <div className="card user-profile-card">

        <div className="card-body">
          <h4 className="card-title user-profile-title">Nombre del Usuario</h4>
          <p className="text-muted user-profile-email">Correo</p>
          <br></br>
          {/*Falta route que diriga a configuracion*/}
          <button className="btn btn-primary">Editar Perfil</button>
        </div>

      </div>

      <div>
        <h3>Datos de reciclaje</h3>
        <br></br>
        <p>Puntos de reciclapp</p>
      </div>

      <div>
        <h2>Mis direcciones</h2>
        <br></br>
        <p>Datos de direcciones</p>
        {/*Deberia enrutar igualmente a usersettings*/}
        <button>Configurar direcciones</button>
      </div>

    </div>
    )
}