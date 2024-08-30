import React from 'react';
import './profileSettings.css';

const ProfileSettings = () => {
  return (
    <div className="profile-settings-container container">

      <h3>Configuración de Perfil</h3>

        {/*Formulario de cambio de datos del usuario*/}
      <form className="profile-settings-form">
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input type="text" className="form-control" placeholder="Nombre del Usuario" />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo Electronico</label>
          <input type="email" className="form-control" placeholder="usuario@email.com" />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input className="form-control" type="password" placeholder="Nueva Contraseña" />
        </div>

        <button className="btn btn-success" type="submit">Aplicar Cambios</button>
        {/*Falta route para devolverse a perfil*/}
        <button>Cancelar</button>

       </form>

        {/*Formulario de cambio de direccion de domicilio*/}
        <form>
            <div>
            <label className="form-label">Calle</label>
            <input type="text" className="form-control" placeholder="Calle" />
            </div>
            <div>
                {/*Seleccion de region falta cambiar input */}
            <label className="form-label">Region</label>
            <input type="text" className="form-control" placeholder="Region" />
            </div>
            <div>
                {/*Seleccion de comuna falta cambiar input */}
            <label className="form-label">Comuna</label>
            <input type="text" className="form-control" placeholder="Comuna" />
            </div>
            <div>
            <label className="form-label">Numero de casa o dpto</label>
            <input type="text" className="form-control" placeholder="" />
            </div>

            <button className="btn btn-success" type="submit">Aplicar Cambios</button>
            {/*Falta route para devolverse a perfil*/}
            <button>Cancelar</button>
        </form>
    </div>
  );
};

export default ProfileSettings;
